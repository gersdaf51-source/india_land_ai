// 项目根目录新建 obfuscate.js
const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const OUT_DIR = path.join(__dirname, 'out');

// 1. 先混淆 JS 代码变量
function obfuscateJS(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      obfuscateJS(filePath);
    } else if (file.endsWith('.js') && !file.includes('framework') && !file.includes('main')) {
      const code = fs.readFileSync(filePath, 'utf8');
      const result = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        mangle: true,
        stringArray: true,
        stringArrayThreshold: 0.75
      });
      fs.writeFileSync(filePath, result.getObfuscatedCode());
      console.log(`✓ Obfuscated JS: ${file}`);
    }
  });
}

// 2. 模拟“图片混淆”：如果你想改图片名，可以在此处添加逻辑
// 但最稳妥的办法是只混淆代码，让图片保留原名以确保 metadata 不报错。

console.log('--- Start Post-Build Process ---');
obfuscateJS(path.join(OUT_DIR, '_next/static/chunks'));
console.log('--- All Done! ---');
