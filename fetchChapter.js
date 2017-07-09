const phantom = require('phantom');
const mkdirp = require('mkdirp')
const program = require('commander');
const fs = require('async-file')
const path = require('path')
	//设置用户代理
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`
	/*
	命令行参数
	p -替换原文本中的换行空格
	f -保存为文件
	t 自定义输出路径
    u 抓取单章的url
	*/
program
	.version('0.1.0')
	.option('-p, --puer', 'puerMode')
	.option('-f, --file', 'save2File')
	.option('-t, --path [path]', 'outPutPath')
	.option('-u, --url [url]', 'url')
	.parse(process.argv);
if (!program.url) {
	return;

}
const URL = program.url;
const DEFAULT_PATH = '/book/default/';

/*
替换br和&nbsp标签
*/
function puer(str) {
	if (!str) {
		return
	}
	str = str.replace(/<br\s*\/?>/gi, "\r\n");
	str = str.replace(/&nbsp;/g, " ")
	return str
}
/*
test url 
node fetchChapter.js -u http://www.qu.la/book/5443/3179374.html -f -p
*/

(async function() {
	//创建实例
	const instance = await phantom.create()
		//创建页面容器
	const page = await instance.createPage()
	page.setting("userAgent", userAgent)
	const status = await page.open(URL),
		code = 1;
	if (status !== 'success') {
		code = -1;
		return;
	} else {
		// await page.includeJs("https://cdn.bootcss.com/jquery/1.12.4/jquery.js")
		// await page.render('germy.png');
		var start = Date.now();
		var result = await page.evaluate(function() {
			//移除一些无关内容(等于直接在结果网页上的dom上进行操作)
			//请注意这里如果调用console.log()是无效的!
			$("#content a:last-child").remove()
			$("#content script:last-child").remove()
			$("#content div:last-child").remove()
			$("#content script:last-child").remove()
			return ({
				title: $("h1").html(),
				content: $("#content").html()
			});
		})
		if (result.title == '' || result.content == '') {
			//内容为空捕获失败
			console.log(JSON.stringify({
				code: -1
			}))
			return
		} else {
			//判断参数进一步处理
			if (program.puer) {
				var context = puer(result.content)
			}
			//文件模式处理后进行保存到文件.返回文件路径
			if (program.file) {

				let path = ""
				if (program.path) {
					//自定义路径
				} else {
					path = DEFAULT_PATH;
					//避免文件夹不存在,__dirname指向的是文件所在路径
					mkdirp(__dirname + path, (err) => {
						if (err) {
							console.log(err);
						}
					});
					//拼接出文件输出的路径
					path += result.title + ".txt";
					await fs.writeFile(__dirname + path, context)
						// return;
						//输出文件名
					console.log(JSON.stringify({
						code: 1,
						filePath: path
					}))
				}
			} else {
				console.log(JSON.stringify({
					code: 1,
					content: result
				}));
			}

		}
	}
	//exit
	await instance.exit();
})()