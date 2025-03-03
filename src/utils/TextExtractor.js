import fs from "fs-extra";
import pdfParse from "pdf-parse";

export const extractTextFromFile = async (filePath, fileType) => {
  try {
    // Handle only PDF files
    if (fileType === "application/pdf") {
      const dataBuffer = await fs.readFile(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text;
    } else {
      // Log the unsupported file type for debugging
      console.error(`Attempted to process non-PDF file type: ${fileType}`);
      throw new Error("Unsupported file type. Only PDF files are supported.");
    }
  } catch (error) {
    console.error("Error extracting text:", error);
    throw error;
  }
};