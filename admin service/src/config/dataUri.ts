import cloudinary from "cloudinary";
import DataUriParser from "datauri/parser.js";
import path from "path";

const getBuffer = (file: Express.Multer.File) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();

    return parser.format(extName, file.buffer);
};

/**
 * Upload a file buffer to Cloudinary using upload_stream.
 * Works reliably for audio and image files without data URI size constraints.
 */
export const uploadToCloudinary = (
    file: Express.Multer.File,
    options: Record<string, any>
): Promise<any> => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(
            options,
            (error: any, result: any) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        stream.end(file.buffer);
    });
};

export default getBuffer;
