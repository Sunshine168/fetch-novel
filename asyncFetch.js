const async = require('async')
const execAsync = require('async-child-process').execAsync;
/*内存空间是有限的。。。*/
var asyncFetch = function(data, number, method) {
	return new Promise(function(resolve, reject) {
		if (!data || data.length <= 0) {
			reject("data not exist")
		}
		let result = [];
		async.mapLimit(data, number, async(data) => {
			//需要设置延时不然ip会被封掉
			let cmd = `node fetchChapter.js  -u ${data.link} -f -p`,
				json,
				//获取一个内容就输出一个
				{
					stdout
				} = await execAsync(cmd, {
					//default value of maxBuffer is 200KB.
					maxBuffer: 1024 * 500
				});
			json = JSON.parse(stdout);
			json.index = data.index;
			result.push(json);
		}, function(err) {
			if (err) {
				reject(err)
			}
			resolve(result)
		})
	})
}

var delayAsync = function(dataList, start, end, limit) {
	return new Promise(function(resolve, reject) {
		var result = [],
			counter = 0,
			checkTimer,
			checkTimeOut,
			fetchTimers = [],
			count = Math.ceil((end - start) / limit),
			remain = start - end,
			i = 0;
		if (dataList.length <= 0) {
			reject("error")
			return;
		}
		//打印一下输入情况
		console.log(dataList)
		try {
			//章数的开始和结束
			console.log(`从${start}到 ${end}`)
			let startIndex = start,
				endIndex;
			while (startIndex != end) {
				if (startIndex + limit < end) {
					endIndex = startIndex + limit;
				} else {
					//截取出界
					endIndex = end;
				}
				chapter = dataList.slice(startIndex, endIndex);
				//通过闭包保存当时抓取的情况
				(function(startIndex, endIndex, chapter) {
					var tempTimer = setTimeout(async function() {
						let startTime = new Date(),
							time, chapterResult = [];
						//进行并发捕获执行命令
						try {
							chapterResult = await asyncFetch(chapter, limit);
							console.log(chapter)
						} catch (e) {
							// console.log(e)
						}
						result = result.concat(chapter)
							//用于判断任务标记
						counter++;
						time = new Date() - startTime;
						console.log(`完成抓取 ${startIndex} 到 ${endIndex} 计数器是${counter} 时间是${time}`)
					}, i * 1000);
					fetchTimers.push(tempTimer);

				})(startIndex, endIndex, chapter)
				i++; //控制延时
				startIndex = endIndex;
			}
		} catch (e) {
			reject(e)
		}
		checkTimer = setInterval(function() {
			console.log(`counter is ${counter} count is ${count}`)
			if (counter == count) {
				resolve(result)
				clearTimeout(checkTimeOut);
				clearInterval(checkTimer);
			}
		}, 1000);
		//or use promise all ?
		//30s计时器判断超时
		checkTimeOut = setTimeout(function() {
			for (let i = 0; i < fetchTimers.length; i++) {
				clearTimeout(fetchTimers[i]);
			}
			clearInterval(checkTimer);
			console.log("timout")
			reject(result)
		}, 30000);
	})
}

module.exports = {
	asyncFetch: asyncFetch,
	delayAsync: delayAsync,
}