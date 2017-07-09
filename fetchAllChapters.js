const phantom = require('phantom');
const program = require('commander');
/*
  命令行参数帮助工具
  设置 option b 代表 book ,[book]表示该参数可以通过program访问,这个参数表示书本编号
  命令 eg:
  node fetchAllChapters.js -b 5443  
*/
program
	.version('0.1.0')
	.option('-b, --book [book]', 'book number')
	.parse(process.argv);

//缺少书本参数直接退出
if (!program.book) {
	return
}
// example "5443",获取书本编号
const bookNumber = program.book
	//访问的url
const url = encodeURI(`http://www.qu.la/book/${bookNumber}/`);
//设置用户代理头
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`
try {
	//提供async环境
	(async function() {
		//创建实例
		const instance = await phantom.create()
			//创建页面容器
		const page = await instance.createPage()
			//设置
		page.setting("userAgent", userAgent)
			//判断是否访问成功
		const status = await page.open(url),
			code = 1;
		if (status !== 'success') {
			//访问失败修改状态码
			code = -1;
		} else {
			//获取当前时间
			var start = Date.now();
			var result = await page.evaluate(function() {
				var count = 1;
				return $('#list dl dd').map(function() {
					return ({
						index: count++,
						title: $(this).find('a').html(),
						link: url + ($(this).find('a').attr('href')).substring(($(this).find('a').attr('href')).lastIndexOf("/")),
					})
				}).toArray()
			})
			let data = {
				code: code,
				bookNumber: "5443",
				url: url,
				time: Date.now() - start,
				dataList: result
			}
			console.log(JSON.stringify(data));
		}
		//退出实例
		await instance.exit();
	})()
} catch (e) {
	console.log(e)
}