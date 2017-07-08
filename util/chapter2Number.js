const number = ["十", "一", "二", "三", "四", "五", "六", "七", "八", "九"]
const section = ["十", "百", "千", "万"]
	//目前只转换10w以下的

var toNmber = function(str) {
	//正则匹配,str.match(/(\d+)/)
	var startIndex = str.indexOf("第"),
		endIndex = str.indexOf("章"),
		chapterNumber,
		result = ""
	if (startIndex === -1 && endIndex === -1) {
		//该规则不适合使用
	} else {
		chapterNumber = str.substring(startIndex + 1, endIndex);
		//substring和splice截取字符串的时候startIndex是包括在截取氛围内,而endIndex则不在
		if (typeof chapterNumber === "number") {
			return chapterNumber
		} else {
			//先判断范围
			//九,十九,二十九,一百零九,一千零二十九,一千二百三十九
			if (chapterNumber.length < 2) {
				//100以下
				result = chapterNumber.indexOf(result[1]) + chapterNumber(result[0]);
			} else {
				if (chapterNumber < 3)
				//1000以下,一百零九,一百,
			}
		}
	}
}