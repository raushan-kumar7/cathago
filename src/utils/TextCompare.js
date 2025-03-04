export const compareTexts = async (text1, text2) => {
  try {
    // Simple comparison algorithm
    // 1. Remove punctuation and convert to lowercase
    const cleanText1 = text1.toLowerCase().replace(/[^\w\s]/g, "");
    const cleanText2 = text2.toLowerCase().replace(/[^\w\s]/g, "");

    // 2. Split into words
    const words1 = cleanText1.split(/\s+/).filter((word) => word.length > 3);
    const words2 = cleanText2.split(/\s+/).filter((word) => word.length > 3);

    // 3. Find common words
    const commonWords = words1.filter((word) => words2.includes(word));

    // 4. Calculate match score (percentage)
    const totalUniqueWords = new Set([...words1, ...words2]).size;
    const matchScore = (commonWords.length / totalUniqueWords) * 100;

    // 5. Find matching phrases (sequences of 3+ words)
    const matchingPhrases = [];
    for (let i = 0; i < words1.length - 3; i++) {
      const phrase = words1.slice(i, i + 3).join(" ");
      if (cleanText2.includes(phrase)) {
        matchingPhrases.push(phrase);
      }
    }

    return {
      matchScore: parseFloat(matchScore.toFixed(2)),
      matchDetails: {
        commonWordCount: commonWords.length,
        totalWords1: words1.length,
        totalWords2: words2.length,
        totalUniqueWords,
        matchingPhrases: matchingPhrases.slice(0, 10),
      },
    };
  } catch (error) {
    throw error;
  }
};
