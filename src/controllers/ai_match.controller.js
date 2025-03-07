// import { asyncHandler } from "../utils/AsyncHandler.js";
// import {
//   createAIMatch,
//   getAIMatchById,
//   getUserAIMatches,
// } from "../services/ai_match.service.js";
// import { getUserDocs } from "../services/document.service.js";




// const renderAIMatchList = asyncHandler(async (req, res) => {
//   try {
//     const aiMatches = await getUserAIMatches(req.user.id);

//     // Change template path from "ai/index" to "ai-matches/index" and pass aiMatches
//     res.render("ai-matches/index", {
//       title: "AI Match History | DocScan",
//       subTitle: "Your AI Document Comparisons",
//       aiMatches, // Make sure to pass this
//       user: req.user,
//       currentPage: "ai-matches",
//     });
//   } catch (error) {
//     req.flash("error", "Could not load AI match history");
//     res.redirect("/dashboard");
//   }
// });

// const renderAIMatchForm = asyncHandler(async (req, res) => {
//   try {
//     const documents = await getUserDocs(req.user.id);
//     const recentAIMatches = await getUserAIMatches(req.user.id, 5);

//     if (documents.length < 2) {
//       req.flash(
//         "error",
//         "You need at least two documents to create an AI match"
//       );
//       return res.redirect("/documents");
//     }

//     res.render("ai-matches/new", {
//       title: "AI Document Matcher | DocScan",
//       subTitle: "Compare Documents with AI",
//       documents,
//       recentAIMatches,
//       user: req.user,
//       currentPage: "ai-matches",
//     });
//   } catch (error) {
//     req.flash("error", "Could not load AI match form");
//     res.redirect("/dashboard");
//   }
// });

// const createDocAIMatch = asyncHandler(async (req, res) => {
//   try {
//     const { documentId1, documentId2, matchOptions = [] } = req.body;

//     if (!documentId1 || !documentId2) {
//       req.flash("error", "Please select two documents to compare");
//       return res.redirect("/ai-matches/new");
//     }

//     if (documentId1 === documentId2) {
//       req.flash("error", "Please select two different documents");
//       return res.redirect("/ai-matches/new");
//     }

//     if (req.user.credits < 2) {
//       req.flash("error", "Insufficient credits. Please purchase more.");
//       return res.redirect("/credits/purchase");
//     }

//     const matchConfig = {
//       detailedAnalysis: matchOptions.includes("detailedAnalysis"),
//       provider: matchOptions.includes("alternateProvider")
//         ? "google"
//         : "openai",
//     };

//     const aiMatch = await createAIMatch(
//       req.user.id,
//       documentId1,
//       documentId2,
//       matchConfig
//     );

//     req.flash("success", "AI Document Match completed successfully");
//     res.redirect(`/ai-matches/${aiMatch.id}`);
//   } catch (error) {
//     req.flash("error", error.message || "An error occurred during AI matching");
//     res.redirect("/ai-matches/new");
//   }
// });



// /*
// const renderAIMatchDetails = asyncHandler(async (req, res) => {
//   try {
//     const aiMatch = await getAIMatchById(req.params.id, req.user.id);

//     if (!aiMatch) {
//       req.flash("error", "AI Match not found");
//       return res.redirect("/ai-matches");
//     }

//     const matchDetails = JSON.parse(aiMatch.matchDetails);

//     res.render("ai-matches/detail", {
//       title: "AI Match Results | DocScan",
//       subTitle: `Comparison: ${aiMatch.FirstDocument.originalName} vs ${aiMatch.SecondDocument.originalName}`,
//       aiMatch,
//       matchDetails,
//       user: req.user,
//       currentPage: "ai-matches",
//     });
//   } catch (error) {
//     req.flash("error", "Could not load AI match details");
//     res.redirect("/ai-matches");
//   }
// });
// */

// const renderAIMatchDetails = asyncHandler(async (req, res) => {
//   try {
//     const matchId = req.params.id;
//     const userId = req.user.id;
    
//     if (!matchId) {
//       req.flash("error", "Invalid match ID");
//       return res.redirect("/ai-matches");
//     }
    
//     const aiMatch = await getAIMatchById(matchId, userId);
    
//     if (!aiMatch) {
//       req.flash("error", "AI Match not found or you don't have permission to view it");
//       return res.redirect("/ai-matches");
//     }
    
//     // Check that the documents are properly loaded
//     if (!aiMatch.FirstDocument || !aiMatch.SecondDocument) {
//       req.flash("error", "The match documents could not be loaded");
//       return res.redirect("/ai-matches");
//     }
    
//     // Safely parse the match details
//     let matchDetails;
//     try {
//       matchDetails = typeof aiMatch.matchDetails === 'string' 
//         ? JSON.parse(aiMatch.matchDetails) 
//         : aiMatch.matchDetails;
//     } catch (parseError) {
//       console.error("Error parsing match details:", parseError);
//       req.flash("error", "Could not parse match details");
//       return res.redirect("/ai-matches");
//     }
    
//     res.render("ai-matches/detail", {
//       title: "AI Match Results | DocScan",
//       subTitle: `Comparison: ${aiMatch.FirstDocument.originalName} vs ${aiMatch.SecondDocument.originalName}`,
//       aiMatch,
//       matchDetails,
//       user: req.user,
//       currentPage: "ai-matches",
//     });
//   } catch (error) {
//     console.error("Error in renderAIMatchDetails:", error);
//     req.flash("error", "Could not load AI match details: " + error.message);
//     res.redirect("/ai-matches");
//   }
// });

// export {
//   renderAIMatchForm,
//   createDocAIMatch,
//   renderAIMatchList,
//   renderAIMatchDetails,
// };