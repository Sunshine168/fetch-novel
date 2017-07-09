const Chapter = require('../lib/mongo').Chapter;

module.exports = {
  // 保存章节内容
  create: (chapter) => {
    return Chapter.create(chapter).exec();
  },
  //通过书编号获取记录
  getChapterByBookNum: (bookNum) => {
    return Chapter
      .find({
        bookNum: bookNum
      })
      .addCreatedAt()
      .exec();
  },
  //通过抓取结果序号获取记录
  getChapterById: (id) => {
    return Chapter
      .findOne({
        _id: id
      })
      .addCreatedAt()
      .exec();
  },
  updateChapterByBookNum: (id, chapter) => {
    return Chapter.update({
      _id: id
    }, {
      $set: chapter
    }).exec();
  },
};