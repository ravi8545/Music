import DataUriParser from "datauri/parser.js";
declare const getBuffer: (file: Express.Multer.File) => DataUriParser;
/**
 * Upload a file buffer to Cloudinary using upload_stream.
 * Works reliably for audio and image files without data URI size constraints.
 */
export declare const uploadToCloudinary: (file: Express.Multer.File, options: Record<string, any>) => Promise<any>;
export default getBuffer;
//# sourceMappingURL=dataUri.d.ts.map