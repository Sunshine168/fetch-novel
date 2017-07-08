const phantom = require('phantom');
const program = require('commander');
program
	.version('0.1.0')
	.option('-b, --book [book]', 'book number')
	.parse(process.argv);
//笔趣阁 type = 1
if (!program.book) {
	return
}
// example "5443"
const bookNumber = program.book
const url = encodeURI(`http://www.qu.la/book/${bookNumber}/`);
const startChapter = process.argv[2] ? process.argv[2] : 1
const userAgent = `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.115 Safari/537.36`
try {

	(async function() {
		//创建实例
		const instance = await phantom.create()
			//创建页面容器
		const page = await instance.createPage()
		page.setting("userAgent", userAgent)
		const status = await page.open(url),
			code = 1;
		if (status !== 'success') {
			code = -1;
		} else {
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
		await instance.exit();
	})()
} catch (e) {
	console.log(e)
}