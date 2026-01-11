/**
 * Image Processing Utilities with Sharp
 * Provides WebP conversion, responsive image generation, and optimization
 */
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

export interface ProcessedImage {
    original: string;
    webp?: string;
    thumbnail?: string;
    responsive?: { width: number; path: string; webpPath?: string }[];
    metadata?: {
        width: number;
        height: number;
        format: string;
        size: number;
    };
}

export interface ProcessingOptions {
    generateWebP?: boolean;
    generateThumbnail?: boolean;
    thumbnailWidth?: number;
    generateResponsive?: boolean;
    responsiveSizes?: number[];
    quality?: number;
}

const DEFAULT_OPTIONS: ProcessingOptions = {
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
export async function processImage(
    inputPath: string,
    outputDir: string,
    options: ProcessingOptions = {}
): Promise<ProcessedImage> {
    const opts = { ...DEFAULT_OPTIONS, ...options };
    const filename = path.basename(inputPath);
    const ext = path.extname(filename);
    const baseName = path.basename(filename, ext);

    const result: ProcessedImage = {
        original: inputPath,
        responsive: []
    };

    try {
        // Get original metadata
        const metadata = await sharp(inputPath).metadata();
        result.metadata = {
            width: metadata.width || 0,
            height: metadata.height || 0,
            format: metadata.format || 'unknown',
            size: fs.statSync(inputPath).size
        };

        // Generate WebP version
        if (opts.generateWebP && metadata.format !== 'webp') {
            const webpPath = path.join(outputDir, `${baseName}.webp`);
            await sharp(inputPath)
                .webp({ quality: opts.quality })
                .toFile(webpPath);
            result.webp = `/uploads/${baseName}.webp`;
        }

        // Generate thumbnail
        if (opts.generateThumbnail) {
            const thumbPath = path.join(outputDir, `${baseName}-thumb${ext}`);
            const thumbWebpPath = path.join(outputDir, `${baseName}-thumb.webp`);

            await sharp(inputPath)
                .resize(opts.thumbnailWidth, null, { fit: 'inside' })
                .toFile(thumbPath);

            if (opts.generateWebP) {
                await sharp(inputPath)
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
                if (width >= originalWidth) continue;

                const responsivePath = path.join(outputDir, `${baseName}-${width}w${ext}`);
                const responsiveWebpPath = path.join(outputDir, `${baseName}-${width}w.webp`);

                await sharp(inputPath)
                    .resize(width, null, { fit: 'inside' })
                    .toFile(responsivePath);

                const entry: { width: number; path: string; webpPath?: string } = {
                    width,
                    path: `/uploads/${baseName}-${width}w${ext}`
                };

                if (opts.generateWebP) {
                    await sharp(inputPath)
                        .resize(width, null, { fit: 'inside' })
                        .webp({ quality: opts.quality })
                        .toFile(responsiveWebpPath);
                    entry.webpPath = `/uploads/${baseName}-${width}w.webp`;
                }

                result.responsive!.push(entry);
            }
        }

        return result;
    } catch (error) {
        console.error('Image processing error:', error);
        throw error;
    }
}

/**
 * Convert a single image to WebP
 */
export async function convertToWebP(
    inputPath: string,
    outputPath: string,
    quality: number = 85
): Promise<string> {
    await sharp(inputPath)
        .webp({ quality })
        .toFile(outputPath);
    return outputPath;
}

/**
 * Resize image maintaining aspect ratio
 */
export async function resizeImage(
    inputPath: string,
    outputPath: string,
    width: number,
    height?: number
): Promise<string> {
    await sharp(inputPath)
        .resize(width, height, { fit: 'inside' })
        .toFile(outputPath);
    return outputPath;
}

/**
 * Get image metadata
 */
export async function getImageMetadata(inputPath: string): Promise<{
    width: number;
    height: number;
    format: string;
    space: string;
    hasAlpha: boolean;
}> {
    const metadata = await sharp(inputPath).metadata();
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
export async function optimizeImage(
    inputPath: string,
    outputPath: string,
    quality: number = 85
): Promise<string> {
    const metadata = await sharp(inputPath).metadata();
    const format = metadata.format;

    let pipeline = sharp(inputPath);

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
