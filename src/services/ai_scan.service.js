import models from "../models/index.js";
import { get_user } from "./user.service.js";
import { compareTextsWithAI, generateScanReport } from "../utils/TextCompare.js";

const { AIScan, Document, User } = models;

/**
 * Create a new AI scan between two documents
 */
const createAIScan = async (userId, documentId1, documentId2, scanConfig = {}) => {
  try {
    const doc1 = await Document.findOne({ where: { id: documentId1, userId } });
    const doc2 = await Document.findOne({ where: { id: documentId2, userId } });

    if (!doc1 || !doc2) {
      throw new Error("One or both documents not found");
    }

    const user = await get_user(userId);
    if (user.credits < 1) {
      throw new Error("Insufficient credits");
    }

    const scan = await AIScan.create({
      userId,
      documentId1,
      documentId2,
      matchScore: 0,
      aiProvider: scanConfig.aiProvider || "openai",
      analysisDepth: scanConfig.analysisDepth || "standard",
      creditsUsed: 1,
      status: "pending",
    });

    processAIScan(scan.id, doc1.extractedText, doc2.extractedText, scanConfig)
      .then(() => console.log(`AI Scan ${scan.id} processed successfully`))
      .catch(err => console.error(`Error processing AI Scan ${scan.id}:`, err));

    await user.update({ credits: user.credits - 1 });

    return scan;
  } catch (error) {
    throw error;
  }
};

/**
 * Process an AI scan asynchronously
 */
const processAIScan = async (scanId, text1, text2, scanConfig) => {
  try {
    const scan = await AIScan.findByPk(scanId);
    if (!scan) throw new Error("Scan not found");

    const { matchScore, matchDetails } = await compareTextsWithAI(
      text1,
      text2,
      {
        aiProvider: scan.aiProvider,
        analysisDepth: scan.analysisDepth,
        ...scanConfig
      }
    );

    await scan.update({
      matchScore,
      matchDetails: JSON.stringify(matchDetails),
      status: "completed"
    });

    return scan;
  } catch (error) {
    console.error("AI scan processing error:", error);
    
    const scan = await AIScan.findByPk(scanId);
    if (scan) {
      await scan.update({
        status: "failed",
        matchDetails: JSON.stringify({ error: error.message })
      });
    }
    
    throw error;
  }
};

/**
 * Get all AI scans for a user
 */
const getUserAIScans = async (userId, limit) => {
  try {
    const options = {
      where: { userId },
      include: [
        { model: Document, as: "FirstDocument" },
        { model: Document, as: "SecondDocument" },
      ],
      order: [["createdAt", "DESC"]],
    };
    
    if (limit) {
      options.limit = limit;
    }
    
    const scans = await AIScan.findAll(options);
    return scans;
  } catch (error) {
    throw error;
  }
};

/**
 * Get a specific AI scan by ID
 */
const getAIScanById = async (id, userId) => {
  try {
    const scan = await AIScan.findOne({
      where: {
        id,
        userId,
      },
      include: [
        { model: Document, as: "FirstDocument" },
        { model: Document, as: "SecondDocument" },
      ],
    });
    return scan;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate a downloadable report for an AI scan
 */
const generateAIScanReport = async (scanId, userId) => {
  try {
    const scan = await getAIScanById(scanId, userId);
    if (!scan) throw new Error("Scan not found");
    
    const matchDetails = JSON.parse(scan.matchDetails);
    return generateScanReport(scan, matchDetails);
  } catch (error) {
    throw error;
  }
};

export { createAIScan, getUserAIScans, getAIScanById, generateAIScanReport };