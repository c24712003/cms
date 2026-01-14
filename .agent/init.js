#!/usr/bin/env node

/**
 * CMS Agent 初始化腳本
 * 
 * 功能:
 * - 掃描專案結構
 * - 檢測技術棧
 * - 輸出專案摘要
 * - 驗證配置完整性
 * 
 * 使用方式:
 *   node .agent/init.js [--verbose] [--check]
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const AGENT_DIR = __dirname;

// 顏色輸出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  dim: '\x1b[2m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

function header(msg) {
  console.log(`\n${colors.blue}═══ ${msg} ═══${colors.reset}\n`);
}

// 掃描專案結構
function scanProject() {
  const structure = {
    hasClient: fs.existsSync(path.join(ROOT, 'client')),
    hasServer: fs.existsSync(path.join(ROOT, 'server')),
    hasDocs: fs.existsSync(path.join(ROOT, 'docs')),
    hasAgent: fs.existsSync(AGENT_DIR),
  };
  
  return structure;
}

// 讀取 package.json
function readPackageJson(dir) {
  const pkgPath = path.join(ROOT, dir, 'package.json');
  if (fs.existsSync(pkgPath)) {
    return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  }
  return null;
}

// 檢測技術棧
function detectTechStack() {
  const clientPkg = readPackageJson('client');
  const serverPkg = readPackageJson('server');
  
  const stack = {
    frontend: [],
    backend: [],
  };
  
  if (clientPkg) {
    const deps = { ...clientPkg.dependencies, ...clientPkg.devDependencies };
    if (deps['@angular/core']) stack.frontend.push(`Angular ${deps['@angular/core']}`);
    if (deps['tailwindcss']) stack.frontend.push(`Tailwind CSS ${deps['tailwindcss']}`);
    if (deps['rxjs']) stack.frontend.push(`RxJS ${deps['rxjs']}`);
  }
  
  if (serverPkg) {
    const deps = { ...serverPkg.dependencies, ...serverPkg.devDependencies };
    if (deps['express']) stack.backend.push(`Express ${deps['express']}`);
    if (deps['sqlite3']) stack.backend.push(`SQLite ${deps['sqlite3']}`);
    if (deps['typescript']) stack.backend.push(`TypeScript ${deps['typescript']}`);
  }
  
  return stack;
}

// 統計 Content Blocks
function countContentBlocks() {
  const blocksDir = path.join(ROOT, 'client/src/app/features/content-blocks');
  if (!fs.existsSync(blocksDir)) return 0;
  
  return fs.readdirSync(blocksDir)
    .filter(f => f.endsWith('.component.ts'))
    .length;
}

// 統計 API 路由
function countApiRoutes() {
  const routesDir = path.join(ROOT, 'server/src/routes');
  if (!fs.existsSync(routesDir)) return 0;
  
  return fs.readdirSync(routesDir)
    .filter(f => f.endsWith('.ts'))
    .length;
}

// 檢查 Agent 配置完整性
function checkAgentConfig() {
  const required = [
    'project.md',
    'rules.md',
    'workflows/new-content-block.md',
    'workflows/new-api-endpoint.md',
    'workflows/i18n-flow.md',
    'workflows/db-migration.md',
    'context/tech-stack.md',
    'context/api-reference.md',
    'context/db-schema.md',
    'skills/angular-patterns/SKILL.md',
    'skills/content-blocks/SKILL.md',
  ];
  
  const results = required.map(file => ({
    file,
    exists: fs.existsSync(path.join(AGENT_DIR, file)),
  }));
  
  return results;
}

// 主程序
function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const checkOnly = args.includes('--check');
  
  header('CMS Agent 專案初始化');
  
  // 1. 專案結構
  const structure = scanProject();
  log('📁 專案結構:', 'blue');
  log(`   ├─ client/  ${structure.hasClient ? '✓' : '✗'}`, structure.hasClient ? 'green' : 'red');
  log(`   ├─ server/  ${structure.hasServer ? '✓' : '✗'}`, structure.hasServer ? 'green' : 'red');
  log(`   ├─ docs/    ${structure.hasDocs ? '✓' : '✗'}`, structure.hasDocs ? 'green' : 'red');
  log(`   └─ .agent/  ${structure.hasAgent ? '✓' : '✗'}`, structure.hasAgent ? 'green' : 'red');
  
  // 2. 技術棧
  const stack = detectTechStack();
  log('\n🔧 技術棧:', 'blue');
  log('   前端: ' + stack.frontend.join(', '));
  log('   後端: ' + stack.backend.join(', '));
  
  // 3. 專案統計
  log('\n📊 專案統計:', 'blue');
  log(`   Content Blocks: ${countContentBlocks()} 個`);
  log(`   API Routes: ${countApiRoutes()} 個`);
  
  // 4. Agent 配置檢查
  log('\n⚙️  Agent 配置:', 'blue');
  const configCheck = checkAgentConfig();
  const missing = configCheck.filter(c => !c.exists);
  const complete = configCheck.filter(c => c.exists);
  
  log(`   完整: ${complete.length}/${configCheck.length}`, complete.length === configCheck.length ? 'green' : 'yellow');
  
  if (verbose || missing.length > 0) {
    configCheck.forEach(c => {
      log(`   ${c.exists ? '✓' : '✗'} ${c.file}`, c.exists ? 'dim' : 'red');
    });
  }
  
  // 總結
  header('完成');
  
  if (missing.length === 0) {
    log('✨ Agent 配置完整,可以開始使用!', 'green');
  } else {
    log(`⚠️  缺少 ${missing.length} 個配置文件`, 'yellow');
  }
  
  log(`\n提示: 使用 'node .agent/init.js --verbose' 查看詳細信息\n`, 'dim');
}

main();
