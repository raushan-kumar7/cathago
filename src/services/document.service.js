import fs from "fs-extra";
import path from "path";
import models from "../models/index.js";
import { extractTextFromFile } from "../utils/TextExtractor.js";

const { Document, User } = models;

// Create a new document
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

// Get user's documents
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

// Get document by ID for a specific user
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

// Delete a document
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

// Get all documents (for admin)
const getAllDocuments = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows: documents } = await Document.findAndCountAll({
      include: [
        {
          model: User,
          attributes: ["username", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(count / limit);

    return {
      documents,
      totalDocuments: count,
      totalPages,
      currentPage: page,
    };
  } catch (error) {
    throw error;
  }
};

// Get document details for admin*
const getDocumentDetails = async (documentId) => {
  try {
    const document = await Document.findByPk(documentId, {
      include: [{ 
        model: User, 
        attributes: ['username', 'email', 'role', 'createdAt']
      }],
    });

    if (!document) {
      throw new Error('Document not found');
    }

    // Calculate total documents for the user
    const totalDocuments = await Document.count({
      where: { userId: document.userId }
    });

    return {
      ...document.get({ plain: true }),
      User: {
        ...document.User.get({ plain: true }),
        totalDocuments
      }
    };
  } catch (error) {
    throw error;
  }
};

export { 
  createDocs, 
  getUserDocs, 
  getDocsById, 
  deleteDoc, 
  getAllDocuments,
  getDocumentDetails 
};