/**
 * GET /
 * Home page.
 * @param app {App}
 * @return {Function}
 */
exports.index = (app) => (req, res) => {
  // check if logged in already,

  res.redirect('/');
};
