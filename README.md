# mdn-sitetree

Trying to render out a tree map of all the MDN content.

## To dev

```bash
yarn
yarn start
open http://localhost:3000
```

## To update `public/tree.json`

You need a Yari checkout of all content. E.g.

```bash
node build-tree.js ~/yari/content/files
```
