const async = require('async')
const execAsync = require('async-child-process').execAsync;
/*实现并发抓取的函数*/
var asyncFetch = function(data, number, method) {
		return new Promise(function(resolve, reject) {
			if (!data || data.length <= 0) {
				reject("data not exist")
			}
			let resultCollection = [];
			async.mapLimit(data, number, async function(data, callback) {
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
				/*将内容保存到json中*/
				json = JSON.parse(stdout);
				//保存index
				json.index = data.index;
				/*
				  目前未知callback为什么是undefined
				*/
				resultCollection.push(json);
				// callback(null, json) //not work
			}, function(err) {
				//回调函数在全部都执行完以后执行
				if (err) {
					reject(err)
				}
				resolve(resultCollection)
			})
		})
	}
	/*实现延时加载的函数*/
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
			//数据长度为空就返回
			reject("error")
			return;
		}
		//打印一下输入情况
		// console.log(dataList)
		try {
			/*章数的开始和结束*/
			console.log(`从${start}到 ${end}`)
			let startIndex = start,
				endIndex;
			while (startIndex != end) {
				/*
				需要注意的是当剩余的任务不足以达到并发数的时候
			    要保证任务分割不能出界
				*/
				if (startIndex + limit < end) {
					endIndex = startIndex + limit;
				} else {
					//截取出界
					endIndex = end;
				}
				/*分割任务*/
				chapter = dataList.slice(startIndex, endIndex);
				//通过闭包实现IIFE保存当时抓取的情况,不使用闭包绑定的数据则是运行之后的值
				(function(startIndex, endIndex, chapter) {
					//通过tempTimer 保存下来
					let tempTimer = setTimeout(async function() {
						//获得此次任务开始执行的时间
						var startTime = new Date(),
							time, chapterResult = [];
						//进行并发捕获执行命令
						try {
							chapterResult = await asyncFetch(chapter, limit);
						} catch (e) {
							console.log(e)
						}
						result = result.concat(chapterResult)
							//用于判断任务标记 
						counter++;
						time = new Date() - startTime;
						console.log(`完成抓取 ${startIndex} 到 ${endIndex} 计数器是${counter} 时间是${time}`)
					}, i * 1000);
					fetchTimers.push(tempTimer);

				})(startIndex, endIndex, chapter)
				i++; //控制延时
				//推进任务进行
				startIndex = endIndex;
			}
		} catch (e) {
			reject(e)
		}
		/*定时判断任务是否完成*/
		checkTimer = setInterval(function() {
			console.log(`counter is ${counter} count is ${count}`)
			if (counter == count) {
				//清除定时器
				clearTimeout(checkTimeOut);
				//清除定时器
				clearInterval(checkTimer);
				resolve(result)
			}
		}, 1000);
		//or use promise all ?
		//30s计时器判断超时,超时时间暂做距离
		checkTimeOut = setTimeout(function() {
			//超时清除所有定时器
			for (let i = 0; i < fetchTimers.length; i++) {
				clearTimeout(fetchTimers[i]);
			}
			//清除定时判断
			clearInterval(checkTimer);
			console.log("timout")
			reject(result)
		}, 50000);
	})
}

module.exports = {
	asyncFetch: asyncFetch,
	delayAsync: delayAsync,
}