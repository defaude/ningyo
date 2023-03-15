import { readdir } from 'node:fs/promises';
import { deleteAsync } from 'del';
import { run } from '@mermaid-js/mermaid-cli';
import makeDir from 'make-dir';

const outputPath = 'output';

await deleteAsync(`${outputPath}/*`, { force: true });
await makeDir(outputPath);

for (const file of await readdir('src')) {
    await run(`src/${file}`, `${outputPath}/${file.replace(/\.md$/, '.svg')}`);
}
