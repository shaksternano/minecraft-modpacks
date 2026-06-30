import {A, createAsync, query, useParams} from "@solidjs/router";
import {getModpack, getMods} from "~/util";
import {For} from "solid-js";

// noinspection JSUnusedGlobalSymbols
export default function Modpack() {
    const params = useParams();
    const modpackId = params.modpack ?? "";
    const modpack = createAsync(() => getModpackQuery(modpackId));
    const mods = createAsync(() => getModsQuery(modpackId));

    return (
        <main class="relative flex flex-col gap-8 items-center p-10">
            <h2 class="text-5xl">
                {modpack()?.name}
            </h2>
            <ul class="flex flex-col gap-2">
                <For each={mods()}>
                    {(mod) => (
                        <li>
                            <a href={mod.url} target="_blank" class="underline">
                                {mod.name}
                            </a>
                        </li>
                    )}
                </For>
            </ul>
            <A href="/" class="absolute top-4 left-4 underline">
                Back
            </A>
        </main>
    )
}

const getModpackQuery = query(async (modpackId: string) => {
    "use server";
    return await getModpack(modpackId);
}, "modpack")

const getModsQuery = query(async (modpackId: string) => {
    "use server";
    return await getMods(modpackId);
}, "mods")
