# DEVNOTES

### Release

update version:
````
yarn lerna version
````

release next
````
yarn lerna publish from-package --dist-tag next
````

release stable
````
yarn lerna publish from-package --dist-tag latest
````