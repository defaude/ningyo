# Ningyo

🧜‍♀️ Because we like [Mermaid](https://mermaid.js.org/)s - but Bitbucket and Confluence don't... 🙄

Turns this

~~~markdown
```mermaid
pie title NETFLIX
    "Time spent searching" : 95
    "Time spent watching" : 5
```
~~~

into this

![The truth about Netflix](test-files/netflix-1.svg)

## Usage

Put your diagram(s) in Markdown files and pass their filenames as parameters to ningyo:

```shell
npx @defaude/ningyo foo.md bar.md baz.md
```

By default, the created SVG files will be optimized with [svgo](https://github.com/svg/svgo). Some diagram styles might
be broken by this, however. You can skip svgo by adding the `--no-optimize` flag:

```shell
npx @defaude/ningyo foo.md bar.md baz.md --no-optimize
```

## Further reading

Look at [the reference](https://mermaid.js.org/intro/n00b-syntaxReference.html) to see what you can do with Mermaid.

Sadly, there are no network / cloud diagrams available at the moment, but with a little effort, it _might_ become
reality [some time in the future](https://github.com/mermaid-js/mermaid/issues/1227).
