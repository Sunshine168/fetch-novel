const async = require('async');
const moment = require('moment');
var arr = [{
	name: 'Jack',
	delay: 200
}, {
	name: 'Mike',
	delay: 100
}, {
	name: 'Freewind',
	delay: 300
}, {
	name: 'Test',
	delay: 50
}];
var log = function(msg, obj) {
	//对log进行了封装。主要是增加了秒钟的输出，通过秒数的差值方便大家对async的理解。
	process.stdout.write(moment().format('ss.SSS') + '> ');
	if (obj !== undefined) {
		process.stdout.write(msg);
		console.log(obj);
	} else {
		console.log(msg);
	}
}
async.mapLimit(arr, 2, function(item, callback) {
	log('1.5 enter: ' + item.name);
	setTimeout(function() {
		log('1.5 handle: ' + item.name);
		// if (item.name === 'Jack') callback('myerr');
		callback(null, item.name + '!!!');
	}, item.delay);
}, function(err, results) {
	log('1.5 err: ', err);
	log('1.5 results: ', results);
});