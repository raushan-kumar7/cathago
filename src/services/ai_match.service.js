// import models from "../models/index.js";
// import { ExpressError } from "../utils/ExpressError.js";
// import { aiComparison } from "../utils/AiComparison.js";
// import { get_user } from "../services/user.service.js";
// import { createSystemLog } from "../services/system_log.service.js";
// import { getDocsById } from "../services/document.service.js";

// const { AIMatch } = models;

// const createAIMatch = async (
//   userId,
//   documentId1,
//   documentId2,
//   options = {}
// ) => {
//   let transaction;
//   try {
//     transaction = await models.sequelize.transaction();
    
//     const doc1 = await getDocsById(documentId1, userId);
//     const doc2 = await getDocsById(documentId2, userId);

//     if (!doc1 || !doc2) {
//       throw new Error("One or both documents not found");
//     }
    
//     const user = await get_user(userId);
//     if (user.credits < 2) {
//       throw new Error("Insufficient credits");
//     }
    
//     const comparisonResult = await aiComparison(
//       doc1.extractedText,
//       doc2.extractedText,
//       options
//     );
    
//     const aiMatch = await AIMatch.create(
//       {
//         userId,
//         documentId1,
//         documentId2,
//         aiProvider: comparisonResult.aiAnalysis.provider,
//         matchScore: comparisonResult.aiAnalysis.aiSimilarityScore,
//         matchDetails: JSON.stringify({
//           basicComparison: comparisonResult.basicComparison,
//           aiAnalysis: comparisonResult.aiAnalysis.fullAnalysis,
//         }),
//         creditsUsed: 2,
//         status: "completed",
//       },
//       { transaction }
//     );
    
//     await user.update(
//       {
//         credits: user.credits - 2,
//       },
//       { transaction }
//     );
    
//     await createSystemLog(
//       {
//         userId,
//         category: "AI_MATCH",
//         logLevel: "info",
//         message: `AI Match created between documents ${documentId1} and ${documentId2}`,
//         metadata: {
//           matchId: aiMatch.id,
//           matchScore: aiMatch.matchScore,
//         },
//       },
//       { transaction }
//     );
    
//     await transaction.commit();
//     return aiMatch;
//   } catch (error) {
//     if (transaction) await transaction.rollback();
    
//     await createSystemLog({
//       userId,
//       category: "AI_MATCH",
//       logLevel: "error",
//       message: `AI Match creation failed: ${error.message}`,
//       metadata: { documentId1, documentId2, error: error.toString() },
//     });
//     throw new ExpressError(400, error.message || "");
//   }
// };
// const getUserAIMatches = async (userId, limit = 10) => {
//   try {
//     return await AIMatch.findAll({
//       where: { userId },
//       include: [
//         { model: models.Document, as: "FirstDocument" },
//         { model: models.Document, as: "SecondDocument" },
//       ],
//       order: [["createdAt", "DESC"]],
//       limit,
//     });
//   } catch (error) {
//     await createSystemLog({
//       userId,
//       category: "AI_MATCH",
//       logLevel: "error",
//       message: `Failed to retrieve AI matches: ${error.message}`,
//     });
//     throw error;
//   }
// };

// const getAIMatchById = async (id, userId) => {
//   try {
//     return await AIMatch.findOne({
//       where: { id, userId },
//       include: [
//         { model: models.Document, as: "FirstDocument" },
//         { model: models.Document, as: "SecondDocument" },
//       ],
//     });
//   } catch (error) {
//     await createSystemLog({
//       userId,
//       category: "AI_MATCH",
//       logLevel: "error",
//       message: `Failed to retrieve AI match details: ${error.message}`,
//     });
//     throw error;
//   }
// };
// export { createAIMatch, getUserAIMatches, getAIMatchById };
