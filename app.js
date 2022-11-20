const express = require('express');
const router = require('./api/routes/router');
require('./api/utils/db').connect();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

app.listen(process.env.PORT, () => {
    console.log(`server running on PORT:${process.env.PORT}`);
});