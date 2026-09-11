import cloudinary from "cloudinary";
import DataUriParser from "datauri/parser.js";
import path from "path";
const getBuffer = (file) => {
    const parser = new DataUriParser();
    const extName = path.extname(file.originalname).toString();
    return parser.format(extName, file.buffer);
};
/**
 * Upload a file buffer to Cloudinary using upload_stream.
 * Works reliably for audio and image files without data URI size constraints.
 */
export const uploadToCloudinary = (file, options) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.v2.uploader.upload_stream(options, (error, result) => {
            if (error)
                reject(error);
            else
                resolve(result);
        });
        stream.end(file.buffer);
    });
};
export default getBuffer;
//# sourceMappingURL=dataUri.js.map