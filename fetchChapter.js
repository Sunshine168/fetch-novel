const phantom = require('phantom');
const mkdirp = require('mkdirp')
const program = require('commander');
const fs = require('async-file')
const path = require('path')
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
	const status = await page.open(URL),
		code = 1;
	if (status !== 'success') {
		code = -1;
		return;
	} else {
		// await page.includeJs("https://cdn.bootcss.com/jquery/1.12.4/jquery.js")
		await page.render('germy.png');
		var start = Date.now();
		var result = await page.evaluate(function() {
			//移除一些无关内容
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
					mkdirp(__dirname + path, (err) => {
						if (err) {
							console.log(err);
						}
					});
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