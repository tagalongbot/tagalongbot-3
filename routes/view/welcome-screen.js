let view_template = require('../../views/welcome-screen.marko');

let sendWelcomeScreen = async ({ query }, res) => {
  res.marko(
    view_template,
  );
}

module.exports = sendWelcomeScreen;
