const Book = require('../lib/mongo').Book;

module.exports = {
  // 保存章节内容
  create: (book) => {
    return Book.create(book).exec();
  },
  //通过书编号获取记录
  getBookByBookNum: (bookNum) => {
    return Book
      .findOne({
        bookNum: bookNum
      })
      .addCreatedAt()
      .exec();
  },
  updateBookByBookNum: (bookNum, book) => {
    return Book.update({
      bookNum: bookNum,
    }, {
      $set: book
    }).exec();
  },
};