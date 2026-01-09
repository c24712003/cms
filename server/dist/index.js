"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDb = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const sqlite_1 = require("sqlite");
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Database Initialization
let db;
(async () => {
    db = await (0, sqlite_1.open)({
        filename: path_1.default.join(__dirname, 'db', 'cms.db'),
        driver: sqlite3_1.default.Database
    });
    // Load Schema
    const fs = require('fs');
    const schemaSql = fs.readFileSync(path_1.default.join(__dirname, 'db', 'schema.sql'), 'utf8');
    await db.exec(schemaSql);
    console.log('Database initialized');
})();
const getDb = () => db;
exports.getDb = getDb;
// Import Routes
const languages_1 = __importDefault(require("./routes/languages"));
const translations_1 = __importDefault(require("./routes/translations"));
const pages_1 = __importDefault(require("./routes/pages"));
const sitemap_1 = __importDefault(require("./routes/sitemap"));
// Register Routes
app.use('/api/languages', languages_1.default);
app.use('/api/translations', translations_1.default);
app.use('/api/pages', pages_1.default);
app.use('/', sitemap_1.default); // Root level for /sitemap.xml
app.listen(PORT, () => {
    console.log(`CMS Server running on port ${PORT}`);
});
