# DragonBones tools
[Github](https://github.com/DragonBones/Tools)

* 使用 `2db` 命令将其他动画格式文件转换为龙骨 JSON 格式文件，使用 `--help` 命令查看 api 帮助。
* 使用 `db2` 命令将龙骨 JSON 格式文件转换为其他动画格式文件，使用 `--help` 命令查看 api 帮助。

## 安装
:::code-group
```bash [npm]
npm install dragonbones-tools --global
```
```bash [yarn]
yarn global add dragonbones-tools
```
:::
## 使用
* 将当面目录下所有的 Spine JSON 格式文件转换为龙骨 JSON 格式文件。
```bash
$ 2db -t spine
```
* 将当面目录下所有的 Live2d JSON 格式文件转换为龙骨 JSON 格式文件。
```bash
$ 2db -t live2d
```
* 将当面目录下所有的龙骨 JSON 格式文件转换为最新的龙骨 JSON 格式文件。
```bash
$ db2 -t new
```
* 将当面目录下所有的龙骨 JSON 格式文件转换为 Spine JSON 格式文件。
```bash
$ db2 -t spine
```
* 将当面目录下所有包含 `hero` 关键字的龙骨 JSON 格式文件转换为龙骨二进制格式文件。
```bash
$ db2 -t binary -f hero
```
* 将输入目录所有的龙骨 JSON 格式文件转换为龙骨二进制格式文件并输出到指定目录。
```bash
$ db2 -t binary -i d:/input -o d:/output -d
```