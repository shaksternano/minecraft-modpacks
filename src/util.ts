import toml from "toml";
import fs from "node:fs/promises";
import path from "node:path";

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
    "use server";
    const modpacks = await fs.readdir(path.join(process.cwd(), "public", "modpacks"))
    return Promise.all(modpacks.map(getModpack));
}

export async function getModpack(modpackId: string): Promise<Modpack> {
    "use server";
    const filePath = path.join(process.cwd(), "public", "modpacks", modpackId, "pack.toml");
    const raw = await fs.readFile(filePath, "utf-8");
    const modpackDetails = toml.parse(raw) as Modpack;
    modpackDetails.id = modpackId;
    return modpackDetails;
}

export async function getMods(modpackId: string): Promise<Mod[]> {
    "use server";
    const modsDirectory = path.join(process.cwd(), "public", "modpacks", modpackId, "mods");
    const modMetaFiles = await fs.readdir(modsDirectory);
    return Promise.all(modMetaFiles.sort().map(async (metafile) => {
        const raw = await fs.readFile(path.join(modsDirectory, metafile), "utf-8");
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
