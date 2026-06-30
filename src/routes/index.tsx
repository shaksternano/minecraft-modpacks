import {A, createAsync, query} from "@solidjs/router";
import {For} from "solid-js";
import {getAllModpacks} from "~/util";

// noinspection JSUnusedGlobalSymbols
export default function Index() {
    const modpacks = createAsync(() => getAllModpacksQuery());

    return (
        <main class="flex flex-col gap-8 items-center p-10">
            <h1 class="text-6xl">
                Modpacks
            </h1>
            <ul class="flex flex-col gap-4">
                <For each={modpacks()}>
                    {(modpack) => (
                        <li>
                            <A href={`/modpacks/${modpack.id}`} class="underline">
                                {modpack.name}
                            </A>
                        </li>
                    )}
                </For>
            </ul>
        </main>
    );
}

const getAllModpacksQuery = query(async () => {
    "use server";
    return await getAllModpacks();
}, "modpacks")
