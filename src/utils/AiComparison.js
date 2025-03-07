import openAI from "openai";
import { compareTexts } from "./TextCompare.js";

export const aiComparison = async (text1, text2, options = {}) => {
  try {
    const basicComparison = await compareTexts(text1, text2);

    const openai = new openAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const truncatedText1 = text1.slice(0, 4000);
    const truncatedText2 = text2.slice(0, 4000);

    const aiAnalysisResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert document comparison AI. Analyze the following two texts and provide a comprehensive comparison."
        },
        {
          role: "user",
          content: `Perform a detailed comparative analysis of these two documents:
          Document 1 (first 4000 characters):
          ${truncatedText1}

          Document 2 (first 4000 characters):
          ${truncatedText2}

          Please provide:
          1. Overall similarity assessment (0-100%)
          2. Key similarities
          3. Key differences
          4. Potential areas of concern or overlap
          5. Contextual analysis`
        }
      ],
      max_tokens: 500
    });

    const aiAnalysis = aiAnalysisResponse.choices[0].message.content;

    const similarityMatch = aiAnalysis.match(/Similarity[: ]*(\d+)%/i);

    const aiSimilarityScore = similarityMatch ? parseFloat(similarityMatch[1]) : basicComparison.matchDetails;

    return {
      basicComparison,
      aiAnalysis: {
        fullAnalysis: aiAnalysis,
        aiSimilarityScore,
        provider: 'openai',
      },
    }

    
  } catch (error) {
    console.error("AI comparison Error: ", error);
    throw error;
  }
};