import { Request, Response } from 'express';
import { handleChunkUpload, assembleChunks, parseFileContent } from '../services/uploadService';

export const uploadChunk = async (req: Request, res: Response) => {
  try {
    const { fileId, fileName, index, totalChunks } = req.body;
    const chunk = req.file;

    if (!chunk) {
      return res.status(400).json({ success: false, error: 'No chunk uploaded' });
    }

    await handleChunkUpload({ fileId, fileName, chunk, index, totalChunks });

    const currentChunkIndex = parseInt(index, 10);
    const totalChunkCount = parseInt(totalChunks, 10);

    if (currentChunkIndex === totalChunkCount - 1) {
      // Last chunk, assemble the file
      const finalFilePath = await assembleChunks(fileId, fileName);
      return res.status(200).json({ success: true, message: 'File uploaded successfully', filePath: finalFilePath, fileId });
    }

    res.status(200).json({ success: true, message: `Chunk ${index} of ${totalChunks} uploaded` });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, error: 'An error occurred during upload' });
  }
};

export const parseFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const result = await parseFileContent(fileId);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Parsing error:', error);
    res.status(500).json({ success: false, error: 'An error occurred during parsing' });
  }
}; 