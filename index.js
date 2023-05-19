#!/usr/bin/env node
import chalk from 'chalk';
import meow from 'meow';
import { Listr } from 'listr2';
import { run } from '@mermaid-js/mermaid-cli';
import { readFile, stat, writeFile } from 'node:fs/promises';
import { globby } from 'globby';
import { optimize } from 'svgo';

const replaceExtension = (filename, replacement) => filename.replace(/\.md$/, replacement);
const getOutputFilename = (filename) => replaceExtension(filename, '.svg');
const getOutputGlob = (filename) => replaceExtension(filename, '*.svg');

const helpMessage = `Pass the filename(s) of one or more markdown file(s) containing your diagrams in a code block.

${chalk.bold('Usage')}
    $ ningyo <file> [... <more files>]

${chalk.bold('Options')}
    --no-optimize Skip optimizing output with svgo (might help with styling issues)

${chalk.bold('Examples')}
    ningyo pie-of-truth.md          # single file
    ningyo foo.md bar.md            # multiple files
    ningyo baz.md --no-optimize     # skip svgo
`;

const cli = meow(helpMessage, {
    importMeta: import.meta,
    flags: {
        optimize: {
            type: 'boolean',
            default: true,
        },
    },
});

if (cli.input.length === 0) cli.showHelp();

const skipSvgo = !cli.flags.optimize;

async function checkFile(filename) {
    if (!filename.endsWith('.md')) throw new TypeError(`${filename} is not a Markdown file`);
    if (!(await stat(filename)).isFile()) throw new TypeError(`${filename} does not exist`);
}

async function convertMermaid(filename) {
    return run(filename, getOutputFilename(filename));
}

async function optimizeOutput(filename) {
    const files = await globby([getOutputGlob(filename)]);
    const promises = files.map(async (file) => {
        const svg = await readFile(file, { encoding: 'utf-8' });
        const { data } = optimize(svg);
        await writeFile(file, data, { encoding: 'utf-8' });
    });
    return Promise.all(promises);
}

const task = new Listr();

task.add(
    cli.input.map((filename) => ({
        title: filename,
        task: () =>
            new Listr([
                { title: 'checking file', task: () => checkFile(filename) },
                { title: 'converting mermaid diagram(s) to SVG', task: () => convertMermaid(filename) },
                { title: 'optimizing SVG output', task: () => optimizeOutput(filename), skip: skipSvgo },
            ]),
    }))
);

try {
    await task.run();
} catch (e) {
    console.error(chalk.bgRed.bold('Something went wrong. Please check the output above.'));
}
