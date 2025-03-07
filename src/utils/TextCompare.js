import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Compare two text documents using basic string comparison
 * @param {string} text1 - First document text
 * @param {string} text2 - Second document text
 * @param {object} config - Comparison configuration
 * @returns {object} Match score and details
 */
export const compareTexts = async (text1, text2, config = {}) => {
  const { strictComparison = false, highlightMatches = true } = config;

  // Basic text preparation
  const prepText1 = strictComparison ? text1 : text1.toLowerCase();
  const prepText2 = strictComparison ? text2 : text2.toLowerCase();

  // Calculate similarity score using Levenshtein distance
  const similarity = calculateSimilarity(prepText1, prepText2);

  // Generate highlighted sections if requested
  let highlights = {};
  if (highlightMatches) {
    highlights = findMatchingSections(prepText1, prepText2);
  }

  return {
    matchScore: similarity,
    matchDetails: {
      similarity: similarity * 100, // Convert to percentage
      highlightedSections: highlights,
      comparisonMethod: "basic",
      documentLengths: {
        doc1Length: text1.length,
        doc2Length: text2.length,
      },
    },
  };
};

/**
 * Compare two text documents using AI
 * @param {string} text1 - First document text
 * @param {string} text2 - Second document text
 * @param {object} config - Comparison configuration
 * @returns {object} Match score and details from AI analysis
 */
export const compareTextsWithAI = async (text1, text2, config = {}) => {
  const { aiProvider = "openai", analysisDepth = "standard" } = config;

  try {
    // Select AI provider based on config
    if (aiProvider === "openai") {
      return await compareWithOpenAI(text1, text2, analysisDepth);
    } else if (aiProvider === "gemini") {
      return await compareWithGemini(text1, text2, analysisDepth);
    } else {
      throw new Error("Unsupported AI provider");
    }
  } catch (error) {
    console.error("AI comparison error:", error);
    // Fallback to basic comparison if AI fails
    return compareTexts(text1, text2, config);
  }
};

/**
 * Compare texts using OpenAI
 */
const compareWithOpenAI = async (text1, text2, analysisDepth) => {
  const prompt = `Compare the following two documents for similarity, identifying matching sections and potential paraphrasing.
  
Document 1:
${text1.substring(0, 8000)}

Document 2:
${text2.substring(0, 8000)}

Provide the following analysis:
1. Overall similarity percentage
2. List of exactly matching sections
3. Potentially paraphrased sections
4. Analysis of structural similarities
${analysisDepth === "deep" ? "5. Detailed content analysis with semantic relationships" : ""}`;

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });

  const analysis = response.choices[0].message.content;

  // Extract similarity percentage from the response
  const similarityMatch = analysis.match(
    /similarity percentage[:\s]*(\d+\.?\d*)%/i
  );
  const similarityScore = similarityMatch ? parseFloat(similarityMatch[1]) : 50;

  // Store score with only 2 decimal places (after dividing by 100)
  const matchScore = parseFloat((similarityScore / 100).toFixed(2));

  return {
    matchScore: matchScore,
    matchDetails: {
      similarity: similarityScore,
      aiAnalysis: analysis,
      comparisonMethod: "openai",
      analysisDepth: analysisDepth,
    },
  };
};

/**
 * Compare texts using Google's Gemini
 */
const compareWithGemini = async (text1, text2, analysisDepth) => {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Compare the following two documents for similarity, identifying matching sections and potential paraphrasing.
  
Document 1:
${text1.substring(0, 8000)}

Document 2:
${text2.substring(0, 8000)}

Provide the following analysis:
1. Overall similarity percentage
2. List of exactly matching sections
3. Potentially paraphrased sections
4. Analysis of structural similarities
${analysisDepth === "deep" ? "5. Detailed content analysis with semantic relationships" : ""}`;

  const result = await model.generateContent(prompt);
  const analysis = result.response.text();

  // Extract similarity percentage from the response
  const similarityMatch = analysis.match(
    /similarity percentage[:\s]*(\d+\.?\d*)%/i
  );
  const similarityScore = similarityMatch ? parseFloat(similarityMatch[1]) : 50;
  
  // Store score with only 2 decimal places (after dividing by 100)
  const matchScore = parseFloat((similarityScore / 100).toFixed(2));

  return {
    matchScore: matchScore,
    matchDetails: {
      similarity: similarityScore,
      aiAnalysis: analysis,
      comparisonMethod: "gemini",
      analysisDepth: analysisDepth,
    },
  };
};

/**
 * Calculate similarity score between two texts
 */
const calculateSimilarity = (text1, text2) => {
  // Simple word overlap calculation
  const words1 = text1.split(/\s+/);
  const words2 = text2.split(/\s+/);

  const uniqueWords1 = new Set(words1);
  const uniqueWords2 = new Set(words2);

  // Find common words
  const commonWords = new Set(
    [...uniqueWords1].filter((word) => uniqueWords2.has(word))
  );

  // Calculate Jaccard similarity
  const similarity =
    commonWords.size /
    (uniqueWords1.size + uniqueWords2.size - commonWords.size);

  // Return score with only 2 decimal places
  return parseFloat(similarity.toFixed(2));
};

/**
 * Find matching sections between two texts
 */
const findMatchingSections = (text1, text2) => {
  const sentences1 = text1.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const sentences2 = text2.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  const matches = [];

  sentences1.forEach((sentence1, idx1) => {
    sentences2.forEach((sentence2, idx2) => {
      if (sentence1.includes(sentence2) || sentence2.includes(sentence1)) {
        matches.push({
          doc1: { text: sentence1, index: idx1 },
          doc2: { text: sentence2, index: idx2 },
          similarity: calculateStringSimilarity(sentence1, sentence2),
        });
      }
    });
  });

  return {
    matchCount: matches.length,
    matches: matches.sort((a, b) => b.similarity - a.similarity).slice(0, 10),
  };
};

/**
 * Calculate string similarity between two strings
 */
const calculateStringSimilarity = (str1, str2) => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  return (longer.length - levenshteinDistance(longer, shorter)) / longer.length;
};

/**
 * Calculate Levenshtein distance between two strings
 */
const levenshteinDistance = (str1, str2) => {
  const matrix = Array(str2.length + 1)
    .fill()
    .map(() => Array(str1.length + 1).fill(0));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j - 1][i] + 1, // deletion
        matrix[j][i - 1] + 1, // insertion
        matrix[j - 1][i - 1] + cost // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
};

/**
 * Generate a downloadable report from scan results
 */
export const generateScanReport = (scan, matchDetails) => {
  try {
    const doc1Name = scan.FirstDocument?.originalName || "Document 1";
    const doc2Name = scan.SecondDocument?.originalName || "Document 2";
    const similarity = matchDetails.similarity.toFixed(1);
    const scanDate = new Date(scan.createdAt).toLocaleDateString();
    const scanTime = new Date(scan.createdAt).toLocaleTimeString();

    let reportText = `Document Comparison Report
      ===========================
      Date: ${scanDate}
      Time: ${scanTime}
      Scan ID: ${scan.id}

      Documents Compared:
      - ${doc1Name}
      - ${doc2Name}

      Results:
      - Similarity Score: ${similarity}%
      - Comparison Method: ${matchDetails.comparisonMethod || "basic"}
    `;

    if (
      matchDetails.comparisonMethod === "openai" ||
      matchDetails.comparisonMethod === "gemini"
    ) {
      reportText += `\nAI Analysis:\n${matchDetails.aiAnalysis}\n`;
    } else if (matchDetails.highlightedSections) {
      reportText += `\nMatching Sections (top ${matchDetails.highlightedSections.matchCount}):\n`;

      matchDetails.highlightedSections.matches.forEach((match, idx) => {
        reportText += `\n${idx + 1}. Similarity: ${(match.similarity * 100).toFixed(1)}%\n`;
        reportText += `   Document 1: "${match.doc1.text}"\n`;
        reportText += `   Document 2: "${match.doc2.text}"\n`;
      });
    }

    reportText += `\n===========================\nGenerated by DocScan`;

    return reportText;
  } catch (error) {
    console.error("Report generation error:", error);
    return "Error generating report";
  }
};