import models from "../models/index.js";
import { get_user } from "./user.service.js";
import { compareTexts } from "../utils/TextCompare.js";

const { Scan, Document } = models;

const createScan = async (userId, documentId1, documentId2, scanConfig = {}) => {
  try {
    // Get both documents
    const doc1 = await Document.findOne({ where: { id: documentId1, userId } });
    const doc2 = await Document.findOne({ where: { id: documentId2, userId } });

    if (!doc1 || !doc2) {
      throw new Error("One or both documents not found");
    }

    // Check user has enough credits
    const user = await get_user(userId);
    if (user.credits < 1) {
      throw new Error("Insufficient credits");
    }

    // Compare the documents
    const { matchScore, matchDetails } = await compareTexts(
      doc1.extractedText,
      doc2.extractedText,
      scanConfig
    );

    // Create scan record
    const scan = await Scan.create({
      userId,
      documentId1,
      documentId2,
      matchScore,
      matchDetails: JSON.stringify({
        ...matchDetails,
        similarity: matchScore
      }),
      creditsUsed: 1,
    });

    // Deduct credit
    await user.update({ credits: user.credits - 1 });

    return scan;
  } catch (error) {
    throw error;
  }
};

const getUserScans = async (userId, limit) => {
  try {
    const options = {
      where: { userId },
      include: [
        { model: Document, as: "FirstDocument" },
        { model: Document, as: "SecondDocument" },
      ],
      order: [["createdAt", "DESC"]],
    };
    
    // Add limit if provided
    if (limit) {
      options.limit = limit;
    }
    
    const scans = await Scan.findAll(options);
    return scans;
  } catch (error) {
    throw error;
  }
};

const getScanById = async (id, userId) => {
  try {
    const scan = await Scan.findOne({
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

export { createScan, getUserScans, getScanById };