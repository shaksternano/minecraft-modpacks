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

/**
 * @param {string} dir
 * @returns {string[]}
 */
function getModpacks(dir) {
    const entries = fs.readdirSync(dir, {withFileTypes: true});
    const modpacks = [];
    for (const entry of entries) {
        if (entry.isDirectory()) {
            const files = fs.readdirSync(path.join(entry.parentPath, entry.name));
            if (files.includes("pack.toml")) {
                modpacks.push(entry.name);
            }
        }
    }
    return modpacks;
}

const files = walk(PUBLIC_DIR).filter((f) => f !== "/manifest.json");
const modpacks = getModpacks(PUBLIC_DIR);
const manifest = {
    files: files,
    modpacks: modpacks,
}

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(manifest, null, 2));
console.log(`Generated manifest.json with ${files.length} files`);
