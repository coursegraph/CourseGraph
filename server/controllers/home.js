/**
 * GET /
 * Home page.
 * @param app {App}
 * @return {Function}
 */
exports.index = (app) => (req, res) => {
  res.redirect('/graph');
};
