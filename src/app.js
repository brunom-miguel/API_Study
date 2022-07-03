const express = require('express');
const bodyParser = require('body-parser');
const PORT = 8080

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('./controllers/user/userController')(app);
require('./controllers/user/requireAuthUserController')(app);
require('./controllers/product/productController')(app);

app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`))