import fs from "fs-extra";
import pdfParse from "pdf-parse";

export const extractTextFromFile = async (filePath, fileType) => {
  try {
    if (fileType === "application/pdf") {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    } else {
      throw new Error("Unsupported file type. Only PDF files are supported.");
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};