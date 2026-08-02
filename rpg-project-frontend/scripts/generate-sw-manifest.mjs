import fs from "node:fs/promises";
import path from "node:path";

const manifestPath = path.resolve(
    "build/client/.vite/manifest.json"
);

const manifest = JSON.parse(
    await fs.readFile(manifestPath, "utf8")
);

const files = [];

for (const value of Object.values(manifest)) {
    if (value.file)
        files.push("/" + value.file);

    if (value.css)
        files.push(
            ...value.css.map((x) => "/" + x)
        );

    if (value.assets)
        files.push(
            ...value.assets.map((x) => "/" + x)
        );
}

const unique = [...new Set(files)];

const output = `export default ${JSON.stringify(unique, null, 2)};`;

await fs.writeFile(
    "app/generated-precache.ts",
    output
);

console.log(
    `Generated ${unique.length} precache entries.`
);