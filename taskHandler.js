const exec = require('child_process').exec;
const execAsync = require('async-child-process').execAsync;
const async = require('async')
const delayAsync = require('./asyncFetch').delayAsync;
const program = require('commander');
const BookModel = require('./model/Books.js');
const ChapterModel = require('./model/Chapters.js');
let cmd;
/*
s 是章节开始(下标是0,所以需要手动减一,第一章就是 0)
e 是结束章节数
l 是并发数
m 模式
b 书的编号
test command:
node taskHandler.js -s 0 -e 10 -l 3 -b 5443
*/
program
	.version('0.1.0')
	.option('-s, --start [start]', 'start chapter', 0)
	.option('-e, --end [end]', 'end chapter')
	.option('-l, --limit [limit]', 'limit async', 3)
	.option('-m, --mode [mode]', 'Add bbq sauce', 2)
	.option('-b, --book [book]', 'book number')
	.parse(process.argv);
/*
 第一步获取章节连接,第二部获取章节内容并进行输出
 输出方式一 输出到数据库.(未实现)
 输出方式二 文件输出(在关注react-pdf,希望支持pdf输出)
*/
if (!program.book) {
	return
} else {
	cmd = `node fetchAllChapters.js -b ${program.book}`;
}
if (!program.start || !program.end) {
	console.log("must input with start-chapter and end-chapter ")
	return;
}

//
(async function() {

	const {
		stdout
		//调取子进程 执行cmd
	} = await execAsync(cmd, {
		//default value of maxBuffer is 200KB.
		maxBuffer: 1024 * 500
	});
	let data = JSON.parse(stdout),
		start = parseInt(program.start),
		end = parseInt(program.end),
		limit = parseInt(program.limit),
		dataList = data['dataList'],
		fetchResult = null;
	//use to debug 
	// let dataList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
	if (!dataList || data.length <= 0) {
		return
	}
	// /*储存*/
	// let book = {
	// 		bookNum: data.bookNumber,
	// 		url: data.url,
	// 		chapters: dataList,
	// 	},
	// 	result = await BookModel.create(book);
	// console.log(result)
	// console.log(dataList)
	//分发任务 每10s调取一次并发抓取10条记录 
	//截取需要的章节数
	/*根据章节,章节是一开始,默认无序章*/
	//dataList, start, end, limit
	//下面是抓每章内容
	try {
		fetchResult = await delayAsync(dataList, start, end, limit);
		console.log(fetchResult)
		var chapters = await ChapterModel.create({
			bookNum: data.bookNumber,
			start: start,
			end: end,
			chapters: fetchResult,
		});
		console.log(chapters)
	} catch (e) {
		console.log(e)
	}
	return
})()