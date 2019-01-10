require('dotenv').config();
let express = require('express');
let app = express();
let bodyParser = require('body-parser');

// Load Marko
require('marko/node-require');
let markoExpress = require('marko/express');

// Middlewares
let updateQueryParameter = require('./middlewares/updateQueryParameter.js');

// Routers
let peopleRoute = require('./routes/people.js');
let sendHomePage = require('./routes/home-page.js');
let sendWelcomeScreen = require('./routes/view/welcome-screen.js');

app.use(
  express.static(__dirname + '/public')
);

app.use(
  bodyParser.json()
);

app.use(
  bodyParser.urlencoded({ extended: false })
);

app.use(updateQueryParameter);

// Routers
app.use(
  '/people',
  peopleRoute
);

app.get(
  '/',
  sendHomePage
);

app.get(
  '/view/welcome-screen',
  sendWelcomeScreen
);

app.listen(process.env.PORT, () => console.log('Running on PORT' + process.env.PORT));
