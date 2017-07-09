const BookModel = require('../model/Books.js');
const ChapterModel = require('../model/Chapters.js');



var testStoreBook = async() => {
	//模拟数据
	let data = {
			bookNum: "4447",
			url: "www.google123.com",
			chapters: [{
				index: 5,
				link: "333",
				title: "123132"
			}, {
				index: 6,
				link: "333",
				title: "123132"
			}, {
				index: 7,
				link: "333",
				title: "123132"
			}]
		},
		bookNum = "4445"

	try {
		// var query = await BookModel.getBookByBookNum(bookNum);
		var result = await BookModel.create(data);
	} catch (e) {
		console.log(e)
	}
	console.log(result.result.ok)
		// process.exit()
}
var testStoreChapters = async() => {
		//模拟数据
		let data = {
				bookNum: "4445",
				start: 0,
				end: 10,
				chapters: [{
					index: 5,
					code: 1,
					filePath: "123132"
				}, {
					index: 6,
					code: 1,
					filePath: "123132"
				}, {
					index: 7,
					code: 1,
					filePath: "123132"
				}]
			},
			bookNum = "4445"

		try {
			// var result = await ChapterModel.updateChapterByBookNum(bookNum, data);
			var result = await ChapterModel.getChapterByBookNum(bookNum);
			console.log(result)
		} catch (e) {
			console.log(e)
		}
		// console.log(result.result.ok)
		// process.exit()
	}
	(async function() {
		try {
			// await testStoreChapters()
			var query = await testStoreBook()
				// var query = await testStoreChapters()

		} catch (e) {
			console.log(e.message)
		}
	})()