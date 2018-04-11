# file-stats 
  - 统计某个文件夹中文件的个数及行数
  - 由于`node_modules`文件夹很大且统计其无实际意义，所以程序强制不会统计`node_modules`文件夹，其中的文件数也不会计算到总共的文件个数中

## Example
```javascript
$ file-stats -dir './'
```
 
 
 
```javascript
此次统计的配置为：
{
  dir: './',
  excludeDir: /^$/,
  excludeFile: /(\.DS_Store\b|\.localized\b)$/,
  fileType: /(\.html\b|\.css\b|\.less\b|\.sass\b|\.js\b|\.ts\b|\.json\b|\.md\b|\.jpeg\b|\.jpg\b|\.png\b|\.gif\b)$/i,
  countsOnly: /(\.jpeg\b|\.jpg\b|\.png\b|\.gif\b)$/i,
}


此文件夹中除了 node_modules 文件夹中总共有 2161 个文件，符合条件的有 1793 个


文件统计结果
-----------------------------------------------------------------------------------
            FileType               单位 (个)               单位 (行)
-----------------------------------------------------------------------------------
            *.md                   68                     4473
            *.js                   376                    90386
            *.json                 32                     616
            *.jpeg                 12                     --
            *.html                 490                    43032
            *.css                  106                    4862
            *.png                  297                    --
            *.jpg                  311                    --
            *.gif                  98                     --
            *.less                 3                      284
-----------------------------------------------------------------------------------
            total                  1793 个                143653 行
-----------------------------------------------------------------------------------
```

- 统计出来的FileType有三种形式：
  - **/file**：代表没有后缀名的文件，显示文件最后`/`后的字符，如`path/path/file`
  - **.file**：代表以`.`开头，并且没有后缀名的文件，如`.DS_Store`
  - ***.fileType**：正常有后缀名的文件，如：`path/path/test.js`；包含以.开头的正常的后缀文件，如：`path/path/.file.js`

- 如果FileType的长度超过15位，会截取前面15位加上`...`，如：`/file...`；`.file...`；`*.fileType...`


## Installation
- 作为命令行工具：

```javascript
$ npm i file-stats -g
```
- 作为nodejs模块：

```javascript
$ npm i file-stats -S
```

## Usage
- 作为命令行工具：

 - `$ file-stats -h`
 
 ```javascript
  Usage: file-stats [options] <arguments>

  Options:

    -v, -V, --version                 output the version number
    -u, --default                     Use the default configuration.
    -d, --dir <dir>                   Configure the statistics folder by String.
    -e, --exclude-dir <excludeDir>    configure the excluded folders by Regex.
    -x, --exclude-file <excludeFile>  configure the excluded files by Regex.
    -f, --file-type <fileType>        configure the file type by Regex.
    -o, --counts-only <countsOnly>    Configure the file type that only counts the number of files by Regex.
    -c, --config <config>             Use other configuration files. The configuration file must return an object.
    -h, --help                        output usage information


  Home: https://github.com/xudeming208/file-stats

  Doc: https://github.com/xudeming208/file-stats/blob/master/README.md

  Examples1: file-stats -u

  Examples2: file-stats -d './' -e '/\/view\//i' -x '/(\bbanner\.html\b)$/i' -f '/(\.html\b)$/i'
 -o '/(\.mp4\b)$/i'

  Examples3: file-stats -c './myConfig.js'
 ```
 
 - 配置某一个选项
 
 ```javascript
 file-stats -d './' -e '/^$/' -x '/^$/' -f '/(\.html\b|\.css\b)$/i' -o '/(\.mp4\b)$/i'
 ```
 - 配置文件
 
 ```javascript
 file-stats -c config.js
 
 // 配置文件(`config.js`)必须是返回一个配置对象，如：
 module.exports = {
      dir: './',
      excludeDir: /^$/,
      excludeFile: /(\.DS_Store\b|\.localized\b)$/,
      fileType: /(\.html\b|\.css\b|\.less\b|\.sass\b|\.js\b|\.ts\b|\.json\b|\.md\b|\.jpeg\b|\.jpg\b|\.png\b|\.gif\b)$/i,
      countsOnly: /(\.jpeg\b|\.jpg\b|\.png\b|\.gif\b)$/i,
    }
 ```
 
 - 统计某一个文件多少行
 
 ```javascript
 file-stats -d './' -f '/utils\.js/'
 ```

 - 如果要统计swf的个数，不统计其行数，则设置：
 
 ```javascript
 file-stats -d './' -f '/(\.swf\b)$/i' -o /(\.swf\b)$/i
 ```

- 作为nodejs模块：
 
 ```javascript
 const fileStats = require('file-stats');
 
 fileStats({
      dir: "./"
 })
 ```

## Options

```javascript
{
  // 描述：统计哪个文件夹
  // 类型：字符串；区分大小写，可以为相对目录和绝对目录
  // 例子：['./', '../test', '/root']
  dir: './',
  // 描述：在dir文件夹中排除哪些文件夹
  // 类型：正则；区分大小写
  // 例子：排除test文件夹 => /\/test\//
  // 备注：强制不统计node_modules文件夹
  excludeDir: /^$/,
  // 描述：在dir文件夹中排除哪些文件
  // 类型：正则；区分大小写
  // 例子：排除test.js文件 => /\btest.js\b/
  // 备注：如果不想排除，设置excludeFile: /^$/
  excludeFile: /(\.DS_Store\b|\.localized\b)$/,
  // 描述：在dir文件夹中统计哪些类型，包括其个数和行数的统计
  // 类型：正则；不区分大小写
  // 默认值：html,css,less,sass,js,ts,json,md,jpeg,jpg,png,gif
  // 备注：如果想统计所有类型，设置fileType:/.*/
  fileType: /(\.html\b|\.css\b|\.less\b|\.sass\b|\.js\b|\.ts\b|\.json\b|\.md\b|\.jpeg\b|\.jpg\b|\.png\b|\.gif\b)$/i,
  // 描述：fileType的子集，在fileType规定的文件类型中，哪些类型不统计行数(某些类型的文件统计其行数无意义)，只统计其个数
  // 类型：正则；不区分大小写
  // 默认值：jpeg, jpg, png, gif
  // 备注：如果设置countsOnly:/^$/，则fileType规定的类型都会统计行数，包括jpeg、png等
  countsOnly: /(\.jpeg\b|\.jpg\b|\.png\b|\.gif\b)$/i
}
```
