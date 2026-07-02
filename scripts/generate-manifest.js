import fs from "node:fs";
import path from "node:path";

const PUBLIC_DIR = "public";
const OUTPUT_FILE = path.join(PUBLIC_DIR, "manifest.json");

/**
 * @param {string} dir
 * @param {string} baseDir
 * @returns {string[]}
 */
function walk(dir, baseDir = dir) {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    let files = [];
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relative = path.relative(baseDir, fullPath).split(path.sep).join("/");
        files.push("/" + relative);
        if (entry.isDirectory()) {
            files = files.concat(walk(fullPath, baseDir));
        }
    }
    return files;
}

const files = walk(PUBLIC_DIR).filter((file) => file !== "/manifest.json");

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(files, null, 2));
console.log(`Generated manifest.json with ${files.length} files`);
