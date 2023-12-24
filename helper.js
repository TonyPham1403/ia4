const handlebars = require("handlebars");

handlebars.registerHelper("equal", function (value1, value2, options) {
  return value1 === value2 ? options.fn(this) : options.inverse(this);
});
