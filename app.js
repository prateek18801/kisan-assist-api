const express = require('express');
const cors = require('cors');

const router = require('./api/routes/router');

require('./api/utils/db').connect();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res, next)=> {
    return res.status(200).json({
        message: 'service online'
    });
})

app.use('/api', router);

app.listen(process.env.PORT, () => {
    console.log(`server running on PORT:${process.env.PORT}`);
});
