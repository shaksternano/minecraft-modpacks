import {A} from "@solidjs/router";

// noinspection JSUnusedGlobalSymbols
export default function NotFound() {
    return (
        <main class="relative flex flex-col gap-8 items-center p-10">
            <h2 class="text-5xl">
                404 - Not Found
            </h2>
            <A href="/" class="absolute top-4 left-4 underline">
                Home
            </A>
        </main>
    );
}
