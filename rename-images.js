const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

const outDir = './out';

async function finalObfuscateImages() {
  if (!fs.existsSync(outDir)) {
    console.error('❌ out/ 不存在，請先執行 npm run build');
    process.exit(1);
  }

  console.log('開始圖片混淆 + 路徑替換...');

  // 1. 收集並改名圖片（去重）
  const imageFiles = glob.sync(`${outDir}/**/*.{jpg,jpeg,png,gif,webp,svg,avif}`, { nocase: true });
  const seen = new Map();           // baseKey → newPath
  const renameMap = new Map();      // oldPath → newPath

  for (const oldFullPath of imageFiles) {
    const filename = path.basename(oldFullPath);
    const baseKey = filename.replace(/_\d+\.jpg$/i, '');   // 13_1.jpg → 13

    if (!seen.has(baseKey)) {
      const ext = path.extname(oldFullPath).toLowerCase();
      const dir = path.dirname(oldFullPath);
      const newName = 'img_' + Math.random().toString(36).slice(2, 24) + Date.now().toString(36).slice(-8) + ext;
      const newFullPath = path.join(dir, newName);

      await fs.rename(oldFullPath, newFullPath);

      const newRel = '/' + path.relative(outDir, newFullPath).replace(/\\/g, '/');
      seen.set(baseKey, newRel);
      renameMap.set(`/imgs/${filename}`, newRel);

      console.log(`✅ Renamed: ${filename} → ${newName}`);
    } else {
      await fs.remove(oldFullPath);
      console.log(`🗑️ Removed duplicate: ${filename}`);
    }
  }

 // 强力替换所有可能的路径，包括动态生成的路径
const filesToScan = glob.sync(`${outDir}/**/*.{html,js}`, { nocase: true });
console.log(`正在替换 ${filesToScan.length} 个文件中的旧路径...`);

for (const filePath of filesToScan) {
  let content = await fs.readFile(filePath, 'utf8');
  let changed = false;

  for (const [oldPath, newPath] of renameMap) {
    const oldName = path.basename(oldPath);

    // 增加对动态路径的处理，尤其是像 `/imgs/${id}_1.jpg` 这样的路径
    const patterns = [
      oldPath,                              // /imgs/13_1.jpg
      `"${oldPath}"`,                       // "/imgs/13_1.jpg"
      `'${oldPath}'`,                       // '/imgs/13_1.jpg'
      `\`${oldPath}\``,                     // `/imgs/13_1.jpg`
      oldName,                              // 13_1.jpg
      `"/imgs/${oldName}"`,                 // "/imgs/13_1.jpg"
      `'/imgs/${oldName}'`,                 // '/imgs/13_1.jpg'
      `\`/imgs/${oldName}\``,               // `/imgs/13_1.jpg`
      `src="${oldPath}"`,                   // src="/imgs/13_1.jpg"
      `src='${oldPath}'`,                   // src='/imgs/13_1.jpg'
      `src=\`${oldPath}\``,                 // src=/imgs/13_1.jpg
      `href="${oldPath}"`,                  // href="/imgs/13_1.jpg"
      `href='${oldPath}'`,                  // href='/imgs/13_1.jpg'
      `href=\`${oldPath}\``,                // href=/imgs/13_1.jpg
      `import("${oldPath}")`,               // 对于动态导入路径
      `require("${oldPath}")`,              // 对于 require 语法
      `imageSrc = \`/imgs/${oldName}\``,     // imageSrc = `/imgs/${id}_1.jpg`
      `\`/imgs/${oldName}\``,                // 对模板字符串中的路径进行替换
      `src="\`/imgs/${oldName}\`"`,          // src="\`/imgs/${id}_1.jpg\`"
    ];

    // 查找并替换每个匹配项
    for (const p of patterns) {
      if (content.includes(p)) {
        content = content.split(p).join(newPath);
        changed = true;

        // 输出路径替换日志
        const fileType = filePath.endsWith('.html') ? 'HTML' : 'JS';
        console.log(`🔄 Replaced path in ${fileType} file: ${path.relative(outDir, filePath)} - Old Path: ${oldPath} → New Path: ${newPath}`);
      }
    }
  }

  if (changed) {
    await fs.writeFile(filePath, content, 'utf8');
  }
}

console.log('🎉 全部完成！請檢查 index.html 和 Network 中的圖片路徑是否已變成亂碼');
}

finalObfuscateImages().catch(console.error);