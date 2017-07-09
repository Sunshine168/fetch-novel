const Mongolass = require('mongolass');
const moment = require('moment');
const objectIdToTimestamp = require('objectid-to-timestamp');
const mongolass = new Mongolass();
mongolass.connect('mongodb://localhost:27017/novel');
// 根据 id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function(results) {
    results.forEach(function(item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYYY-MM-DD HH:mm');
    });
    return results;
  },
  afterFindOne: function(result) {
    if (result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYYY-MM-DD HH:mm');
    }
    return result;
  }
});
/*
  下面模型的意思是
  Book表
  字段      属性
  bookNum  string
  url      stirng
  chapters 对象数组 - 对象的属性是index - number ...类推
*/
exports.Book = mongolass.model('Book', {
  bookNum: {
    type: 'string'
  },
  url: {
    type: 'string'
  },
  chapters: [{
    index: {
      type: "number"
    },
    link: {
      type: "string"
    },
    title: {
      type: "string"
    }
  }]
});
//书模型
exports.Book.index({
  bookNum: 1
}, {
  unique: true
}).exec(); // 根据书本编号找到书本的章节，书编号全局唯一

/*
  下面模型的意思是
  Chapter表
  字段      属性
  bookNum  string
  start    number
  end      number
  chapters 对象数组 - 对象的属性是code - number ...类推
*/
exports.Chapter = mongolass.model('Chapter', {
  bookNum: {
    type: 'string'
  },
  start: {
    type: 'number'
  },
  end: {
    type: 'number'
  },
  chapters: [{
    code: {
      type: 'number'
    },
    filePath: {
      type: 'string'
    },
    index: {
      type: 'number'
    }
  }]
});

//抓取一次章节的模型
exports.Chapter.index({
  bookNum: 1
}, {
  unique: true
}).exec(); // 根据书本编号找到书本的章节，用户名全局唯一