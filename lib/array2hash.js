module.exports = function (req, res, next) {
  if (req && req.body && Object.prototype.toString.call(req.body) === '[object Array]') {
    req.body = req.body.reduce(function (acc, val) {
      const key = Object.keys(val)[0];
      acc[key] = val[key];
      return acc;
    }, {});
  }
  return next();
}
