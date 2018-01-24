'use strict';

/**
 * @file readFile
 * @author xudeming208@126.com
 */

require('colors');
const fs = require('fs');
const bufType = require('./bufType');

// 写入数组
const inputArr = (arr, type, num) => {
	if (!arr.includes(type)) {
		arr.push(type);
		arr.push(num);
	} else {
		// 如果之前已经统计了此类型，则直接将其line相加
		let index = arr.indexOf(type);
		arr[index + 1] += num;
	}
}

// 读取单个文件行数
module.exports = (item, file) => {
	// 取得文件类型
	let match = file.match(/(\.[^.\/]*)$/ig);

	let type = '';
	if (!match) {
		// 没有后缀名的文件，file-stats显示文件最后`/`后的字符，如`path/path/file`；如果file名字太长，会截取前面10个字符，并在其前增加`...`，如：.../...0ca50ff3d2
		type = file.split('/').pop();

		// type太长的话截取
		if (type.length > 10) {
			type = '.../...' + type.substr(0, 10);
		} else {
			type = '.../' + type;
		}
	} else {
		// 以`.`开头，并且没有后缀名的文件，如`.DS_Store`；如果file名字太长，会截取前面10个字符，如：....DS_StoreD
		if (item.startsWith('.') && !item.substr(1).match(/\./g)) {
			type = match[0];

			// type太长的话截取
			if (type.length > 10) {
				type = '...' + type.substr(0, 10);
			}
		}
		// 正常有后缀名的文件，如：`path/path/test.js`；包含以.开头的正常的后缀文件，如：`path/path/.file.js`;后缀名通常不会超过10个字符
		else {
			type = '*' + match[0];
		}
	}

	let unit = '个';
	let num = 1;

	// 统计各种类型文件的个数
	inputArr(countArr, type, num);

	// 统计各种类型文件的行数；特殊文件不计算行数，如图片，视频等等，只计算个数
	if (!bufType.includes(type)) {
		unit = '行';
		let content = fs.readFileSync(file, 'utf-8');
		// 获取行数
		num = content.split('\n').length;
		inputArr(lineArr, type, num);
	}

	// output files
	console.log(`file：`.white, `${file}  `, `${num}`.red, `${unit}`.red);
}