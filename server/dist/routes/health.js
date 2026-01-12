"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_1 = require("../index");
const router = express_1.default.Router();
router.get('/', async (req, res) => {
    try {
        const db = (0, index_1.getDb)();
        // Simple query to check DB connection
        await db.get('SELECT 1');
        const used = process.memoryUsage();
        res.json({
            status: 'online',
            database: 'connected',
            server_time: new Date().toISOString(),
            version: '1.0.0',
            memory: {
                rss: Math.round(used.rss / 1024 / 1024) + 'MB',
                heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
                heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
            }
        });
    }
    catch (error) {
        console.error('Health check failed', error);
        res.status(500).json({
            status: 'degraded',
            database: 'disconnected',
            error: 'System check failed'
        });
    }
});
exports.default = router;
