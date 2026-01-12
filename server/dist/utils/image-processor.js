"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processImage = processImage;
exports.convertToWebP = convertToWebP;
exports.resizeImage = resizeImage;
exports.getImageMetadata = getImageMetadata;
exports.optimizeImage = optimizeImage;
/**
 * Image Processing Utilities with Sharp
 * Provides WebP conversion, responsive image generation, and optimization
 */
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const DEFAULT_OPTIONS = {
    generateWebP: true,
    generateThumbnail: true,
    thumbnailWidth: 300,
    generateResponsive: true,
    responsiveSizes: [320, 640, 768, 1024, 1280],
    quality: 85
};
/**
 * Process an uploaded image
 * - Generates WebP version
 * - Generates thumbnail
 * - Generates responsive sizes
 */
async function processImage(inputPath, outputDir, options = {}) {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const filename = path_1.default.basename(inputPath);
    const ext = path_1.default.extname(filename);
    const baseName = path_1.default.basename(filename, ext);
    const result = {
        original: inputPath,
        responsive: []
    };
    try {
        // Get original metadata
        const metadata = await (0, sharp_1.default)(inputPath).metadata();
        result.metadata = {
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            size: fs_1.default.statSync(inputPath).size
        };
        // Generate WebP version
        if (opts.generateWebP && metadata.format !== 'webp') {
            const webpPath = path_1.default.join(outputDir, `${baseName}.webp`);
            await (0, sharp_1.default)(inputPath)
                .webp({ quality: opts.quality })
                .toFile(webpPath);
            result.webp = `/uploads/${baseName}.webp`;
        }
        // Generate thumbnail
        if (opts.generateThumbnail) {
            const thumbPath = path_1.default.join(outputDir, `${baseName}-thumb${ext}`);
            const thumbWebpPath = path_1.default.join(outputDir, `${baseName}-thumb.webp`);
            await (0, sharp_1.default)(inputPath)
                .resize(opts.thumbnailWidth, null, { fit: 'inside' })
                .toFile(thumbPath);
            if (opts.generateWebP) {
                await (0, sharp_1.default)(inputPath)
                    .resize(opts.thumbnailWidth, null, { fit: 'inside' })
                    .webp({ quality: opts.quality })
                    .toFile(thumbWebpPath);
            }
            result.thumbnail = `/uploads/${baseName}-thumb${ext}`;
        }
        // Generate responsive sizes
        if (opts.generateResponsive && opts.responsiveSizes) {
            const originalWidth = metadata.width || 1920;
            for (const width of opts.responsiveSizes) {
                // Skip sizes larger than original
                if (width >= originalWidth)
                    continue;
                const responsivePath = path_1.default.join(outputDir, `${baseName}-${width}w${ext}`);
                const responsiveWebpPath = path_1.default.join(outputDir, `${baseName}-${width}w.webp`);
                await (0, sharp_1.default)(inputPath)
                    .resize(width, null, { fit: 'inside' })
                    .toFile(responsivePath);
                const entry = {
                    width,
                    path: `/uploads/${baseName}-${width}w${ext}`
                };
                if (opts.generateWebP) {
                    await (0, sharp_1.default)(inputPath)
                        .resize(width, null, { fit: 'inside' })
                        .webp({ quality: opts.quality })
                        .toFile(responsiveWebpPath);
                    entry.webpPath = `/uploads/${baseName}-${width}w.webp`;
                }
                result.responsive.push(entry);
            }
        }
        return result;
    }
    catch (error) {
        console.error('Image processing error:', error);
        throw error;
    }
}
/**
 * Convert a single image to WebP
 */
async function convertToWebP(inputPath, outputPath, quality = 85) {
    await (0, sharp_1.default)(inputPath)
        .webp({ quality })
        .toFile(outputPath);
    return outputPath;
}
/**
 * Resize image maintaining aspect ratio
 */
async function resizeImage(inputPath, outputPath, width, height) {
    await (0, sharp_1.default)(inputPath)
        .resize(width, height, { fit: 'inside' })
        .toFile(outputPath);
    return outputPath;
}
/**
 * Get image metadata
 */
async function getImageMetadata(inputPath) {
    const metadata = await (0, sharp_1.default)(inputPath).metadata();
    return {
        width: metadata.width || 0,
        height: metadata.height || 0,
        format: metadata.format || 'unknown',
        space: metadata.space || 'unknown',
        hasAlpha: metadata.hasAlpha || false
    };
}
/**
 * Optimize image (reduce quality, strip metadata)
 */
async function optimizeImage(inputPath, outputPath, quality = 85) {
    const metadata = await (0, sharp_1.default)(inputPath).metadata();
    const format = metadata.format;
    let pipeline = (0, sharp_1.default)(inputPath);
    switch (format) {
        case 'jpeg':
        case 'jpg':
            pipeline = pipeline.jpeg({ quality, mozjpeg: true });
            break;
        case 'png':
            pipeline = pipeline.png({ quality, compressionLevel: 9 });
            break;
        case 'webp':
            pipeline = pipeline.webp({ quality });
            break;
        default:
            pipeline = pipeline.jpeg({ quality, mozjpeg: true });
    }
    await pipeline.toFile(outputPath);
    return outputPath;
}
