/**
 * Migration Script: Rename legacy block properties to match component inputs
 * 
 * Property mappings:
 *   feature-grid: title -> headline, items -> features
 *   stats-counter: background is now handled via styles (StyleInjectorService)
 * 
 * Run with: node migrate-block-properties.js
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../db/cms.db');

function migrateTable(db, tableName) {
    return new Promise((resolve, reject) => {
        console.log(`\nMigrating ${tableName}...`);
        
        db.all(`SELECT page_id, lang_code, content_json FROM ${tableName}`, [], (err, rows) => {
            if (err) {
                console.error(`Error reading ${tableName}:`, err.message);
                return resolve(0);
            }
            
            let updated = 0;
            let pending = rows.length;
            
            if (pending === 0) {
                return resolve(0);
            }
            
            rows.forEach(row => {
                if (!row.content_json) {
                    pending--;
                    if (pending === 0) resolve(updated);
                    return;
                }
                
                try {
                    let blocks = JSON.parse(row.content_json);
                    let modified = false;
                    
                    blocks = blocks.map(block => {
                        // Handle feature-grid blocks
                        if (block.type === 'feature-grid') {
                            const data = block.data || block;
                            
                            // Rename title -> headline
                            if (data.title !== undefined && data.headline === undefined) {
                                data.headline = data.title;
                                delete data.title;
                                modified = true;
                            }
                            
                            // Rename items -> features
                            if (data.items !== undefined && data.features === undefined) {
                                data.features = data.items;
                                delete data.items;
                                modified = true;
                            }
                            
                            // Restructure flat blocks to nested format
                            if (!block.data && block.type) {
                                const metaKeys = ['id', 'type', 'data', 'styles'];
                                const cleanData = {};
                                Object.keys(block).forEach(key => {
                                    if (!metaKeys.includes(key)) {
                                        cleanData[key] = block[key];
                                        delete block[key];
                                    }
                                });
                                
                                // Apply the renamed keys
                                if (cleanData.title && !cleanData.headline) {
                                    cleanData.headline = cleanData.title;
                                    delete cleanData.title;
                                }
                                if (cleanData.items && !cleanData.features) {
                                    cleanData.features = cleanData.items;
                                    delete cleanData.items;
                                }
                                
                                block.id = block.id || Math.random().toString(36).substring(2, 11);
                                block.data = cleanData;
                                modified = true;
                            }
                        }
                        
                        // Handle stats-counter blocks
                        if (block.type === 'stats-counter') {
                            const data = block.data || block;
                            
                            // Move background to styles
                            if (data.background && (!block.styles || !block.styles.background)) {
                                block.styles = block.styles || {};
                                block.styles.background = { color: data.background };
                                delete data.background;
                                modified = true;
                            }
                            
                            // Restructure flat blocks
                            if (!block.data && block.type) {
                                const metaKeys = ['id', 'type', 'data', 'styles'];
                                const cleanData = {};
                                Object.keys(block).forEach(key => {
                                    if (!metaKeys.includes(key)) {
                                        cleanData[key] = block[key];
                                        delete block[key];
                                    }
                                });
                                
                                block.id = block.id || Math.random().toString(36).substring(2, 11);
                                block.data = cleanData;
                                modified = true;
                            }
                        }
                        
                        return block;
                    });
                    
                    if (modified) {
                        const newJson = JSON.stringify(blocks);
                        db.run(
                            `UPDATE ${tableName} SET content_json = ? WHERE page_id = ? AND lang_code = ?`,
                            [newJson, row.page_id, row.lang_code],
                            function(err) {
                                if (err) {
                                    console.error(`  Error updating ${row.page_id}/${row.lang_code}:`, err.message);
                                } else {
                                    console.log(`  ✓ Updated: page_id=${row.page_id}, lang=${row.lang_code}`);
                                    updated++;
                                }
                                pending--;
                                if (pending === 0) resolve(updated);
                            }
                        );
                    } else {
                        pending--;
                        if (pending === 0) resolve(updated);
                    }
                } catch (e) {
                    console.error(`  Error parsing JSON for page_id=${row.page_id}, lang=${row.lang_code}:`, e.message);
                    pending--;
                    if (pending === 0) resolve(updated);
                }
            });
        });
    });
}

async function main() {
    console.log('========================================');
    console.log('Block Properties Migration');
    console.log('========================================');
    console.log(`Database: ${DB_PATH}`);
    
    const db = new sqlite3.Database(DB_PATH);
    
    try {
        const draftCount = await migrateTable(db, 'page_drafts');
        const contentCount = await migrateTable(db, 'page_contents');
        
        console.log('\n========================================');
        console.log('Migration Complete!');
        console.log(`  Drafts updated: ${draftCount}`);
        console.log(`  Contents updated: ${contentCount}`);
        console.log('========================================');
    } finally {
        db.close();
    }
}

main().catch(console.error);
