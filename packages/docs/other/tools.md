# DragonBones tools
[Github](https://github.com/DragonBones/Tools)

* use `2db` convert other format files to DragonBones json format files，
```bash
$ 2db --help
```
* use `db2` convert DragonBones json format files to other format files，
```bash
$ db2 --help
```
## Install
:::code-group
```bash [npm]
npm install dragonbones-tools --global
```
```bash [yarn]
yarn global add dragonbones-tools
```
:::
## Usage
* Convert Spine json format files to DragonBones json format files in current path.
```bash
$ 2db -t spine
```
* Convert Live2d json format files to DragonBones json format files in current path.
```bash
$ 2db -t live2d
```
* Convert old DragonBones json format files to new DragonBones json format files in current path.
```bash
$ db2 -t new
```
* Convert DragonBones json format files to Spine json format files in current path.
```bash
$ db2 -t spine
```
* Convert DragonBones json format files (file path contains `hero` key word) to DragonBones binary format files in current path.
```bash
$ db2 -t binary -f hero
```
* Convert DragonBones json format files to DragonBones binary format files from input path to output path and delete raw files.
```bash
$ db2 -t binary -i d:/input -o d:/output -d
```