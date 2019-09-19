# DEVNOTES

### Release

## update version:

```
yarn build; yarn lerna version
```

## publish a pre-release - dist-tag: next

```
yarn lerna publish from-package --dist-tag next
```

## publish a stable release - dist-tag: latest

```
yarn lerna publish from-package --dist-tag latest
```
