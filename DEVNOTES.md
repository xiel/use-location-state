# DEVNOTES

### Release

## update version:

```
yarn build; yarn lerna version
```

## publish a pre-release - dist-tag: next

create a pre-release version before

```
yarn lerna publish from-package --dist-tag next --ignore-prepublish
```

add dist-tag "latest" to previously published packages under "next":

```
npx lerna exec --no-bail --no-private --no-sort --stream -- '[ -n "$(npm v . dist-tags.next)" ] && npm dist-tag add ${LERNA_PACKAGE_NAME}@$(npm v . dist-tags.next) latest'
```

remove next tag from all packages:

```
npx lerna exec --no-bail --no-private --no-sort --stream -- '[ -n "$(npm v . dist-tags.next)" ] && npm dist-tag rm ${LERNA_PACKAGE_NAME}@$(npm v . dist-tags.next) next'
```

## publish a stable release - dist-tag: latest

```
yarn lerna publish from-package --dist-tag latest --ignore-prepublish
```
