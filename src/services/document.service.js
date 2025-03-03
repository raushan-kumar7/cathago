import fs from "fs-extra";
import path from "path";
import models from "../models/index.js";
import { extractTextFromFile } from "../utils/TextExtractor.js";

const { Document } = models;

const createDocs = async (userId, file) => {
  try {
    const extractedText = await extractTextFromFile(file.path, file.mimetype);
    const document = await Document.create({
      userId,
      filename: file.filename,
      originalName: file.originalname,
      fileType: file.mimetype,
      fileSize: file.size,
      extractedText,
    });

    return document;
  } catch (error) {
    throw error;
  }
};

const getUserDocs = async (userId) => {
  try {
    const documents = await Document.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]],
    });
    return documents;
  } catch (error) {
    throw error;
  }
};

const getDocsById = async (id, userId) => {
  try {
    const document = await Document.findOne({
      where: {
        id,
        userId,
      },
    });
    return document;
  } catch (error) {
    throw error;
  }
};

const deleteDoc = async (id, userId) => {
  try {
    const document = await Document.findOne({
      where: {
        id,
        userId,
      },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    // Delete file from storage
    const filePath = path.join(process.cwd(), "src", "uploads", document.filename);
    await fs.remove(filePath);

    // Delete from database
    await document.destroy();
    return true;
  } catch (error) {
    throw error;
  }
};

export { createDocs, getUserDocs, getDocsById, deleteDoc };