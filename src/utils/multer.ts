import { Request } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const uploadsDir = path.join(__dirname, "../uploads");

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req: Request, file: any, cb: DestinationCallback) {
        cb(null, uploadsDir);
    },
    filename: function (req: Request, file: any, cb: FileNameCallback) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
});

const upload = multer({ storage: storage });

export default upload;