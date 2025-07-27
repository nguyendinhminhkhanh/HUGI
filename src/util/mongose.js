module.exports = {
  mutipleMongooseToObject: function (mongooseArray) {
    return Array.isArray(mongooseArray)
      ? mongooseArray.map((item) =>
          typeof item.toObject === "function" ? item.toObject() : item
        )
      : mongooseArray;
  },

  mongooseToObject: function (mongoose) {
    return mongoose && typeof mongoose.toObject === "function"
      ? mongoose.toObject()
      : mongoose;
  },
};

//multipleMongooseToObject() là hàm tiện ích (utility)
//dùng để chuyển mảng dữ liệu từ Mongoose về dạng JavaScript "thuần" (plain object)
//điều này bắt buộc nếu bạn dùng Handlebars (hbs) để render dữ liệu trong view.
