import multer from 'multer';
import path from 'path';
import fs from 'fs';
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(UPLOAD_DIR))
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
        const stamp = Date.now();
        const safe = file.fieldname + '-' + stamp + path.extname(file.originalname);
        cb(null, safe);
    }
});
export const upload = multer({ storage });
