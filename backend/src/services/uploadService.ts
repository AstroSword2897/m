import fs from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

interface ChunkUploadData {
  fileId: string;
  fileName: string;
  chunk: Express.Multer.File;
  index: string;
  totalChunks: string;
}

export const handleChunkUpload = async (data: ChunkUploadData) => {
  const { fileId, chunk, index } = data;
  const chunkDir = path.join(UPLOAD_DIR, fileId);
  
  if (!fs.existsSync(chunkDir)) {
    fs.mkdirSync(chunkDir, { recursive: true });
  }

  const chunkPath = path.join(chunkDir, `${index}`);
  await fs.promises.writeFile(chunkPath, chunk.buffer);
};

export const assembleChunks = async (fileId: string, fileName: string): Promise<string> => {
  const chunkDir = path.join(UPLOAD_DIR, fileId);
  const finalFilePath = path.join(UPLOAD_DIR, fileName);

  const chunkFiles = await fs.promises.readdir(chunkDir);
  chunkFiles.sort((a, b) => parseInt(a, 10) - parseInt(b, 10));

  const writeStream = fs.createWriteStream(finalFilePath);

  for (const chunkFile of chunkFiles) {
    const chunkPath = path.join(chunkDir, chunkFile);
    const chunkBuffer = await fs.promises.readFile(chunkPath);
    writeStream.write(chunkBuffer);
    await fs.promises.unlink(chunkPath); // Clean up chunk
  }

  writeStream.end();
  await fs.promises.rmdir(chunkDir); // Clean up chunk directory

  return finalFilePath;
};

export const parseFileContent = async (fileId: string) => {
  // This is a placeholder for the actual file parsing logic.
  // For a 1GB file, this should be handled by a worker thread
  // or a separate service to avoid blocking the event loop.
  return {
    message: `File ${fileId} would be parsed here.`,
    status: 'Parsing not yet implemented.',
  };
}; 