import toml from "toml";
import fs from "node:fs/promises";
import path from "node:path";
import {isServer} from "solid-js/web";

export interface Modpack {
    id: string;
    name: string;
}

export interface Mod {
    id: string;
    name: string;
    url: string;
    update: Record<string, any>;
}

export async function getAllModpacks(): Promise<Modpack[]> {
    let modpacks = [] as string[];
    if (isServer) {
        const rootFiles = await fs.readdir(getRoot(), {withFileTypes: true});
        for (const file of rootFiles) {
            if (file.isDirectory()) {
                const directoryContents = await listFiles(joinPath(file.parentPath, file.name));
                if (directoryContents.includes("pack.toml")) {
                    modpacks.push(file.name)
                }
            }
        }
    } else {
        const manifest = await fetch("/manifest.json");
        const manifestContent = await manifest.json();
        modpacks = manifestContent.modpacks
    }
    return Promise.all(modpacks.map(getModpack));
}

export async function getModpack(modpackId: string): Promise<Modpack> {
    const filePath = joinPath(getRoot(), modpackId, "pack.toml");
    const raw = await readText(filePath);
    const modpackDetails = toml.parse(raw) as Modpack;
    modpackDetails.id = modpackId;
    return modpackDetails;
}

export async function getMods(modpackId: string): Promise<Mod[]> {
    const modsDirectory = joinPath(getRoot(), modpackId, "mods");
    const modMetaFiles = await listFiles(modsDirectory);
    return Promise.all(modMetaFiles.sort().map(async (metafile) => {
        const raw = await readText(joinPath(modsDirectory, metafile));
        const modDetails = toml.parse(raw) as Mod;
        const modId = metafile.split(".")[0];
        modDetails.id = modId;
        if ("modrinth" in modDetails.update) {
            modDetails.url = `https://modrinth.com/mod/${modId}`;
        } else if ("curseforge" in modDetails.update) {
            modDetails.url = `https://www.curseforge.com/minecraft/mc-mods/${modId}`;
        }
        return modDetails;
    }));
}

function getRoot(): string {
    if (isServer) {
        return joinPath(process.cwd(), "public");
    } else {
        return "/"
    }
}

function joinPath(...paths: string[]): string {
    if (isServer) {
        return path.join(...paths);
    } else {
        let joined = paths.join("/");
        if (joined.startsWith("//")) {
            joined = joined.slice(1);
        }
        return joined;
    }
}

async function listFiles(directory: string): Promise<string[]> {
    if (isServer) {
        return await fs.readdir(directory);
    } else {
        const manifest = await fetch("/manifest.json");
        const manifestContent = await manifest.json();
        const files = manifestContent.files as string[];
        return files
            .filter(file => file !== directory && file.startsWith(directory))
            .map((file) => file.slice(directory.length + 1).split("/")[0]);
    }
}

async function readText(file: string): Promise<string> {
    if (isServer) {
        return await fs.readFile(file, "utf-8");
    } else {
        const response = await fetch(file);
        return await response.text();
    }
}
