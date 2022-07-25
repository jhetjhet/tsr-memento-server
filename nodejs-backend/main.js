require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const recordFormatRoutes = require('./routes/recordFormatRoutes');
const middlewares = require('./middlewares');

const apiRoute = express.Router();

apiRoute.use(recordFormatRoutes);

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use('/api/', apiRoute);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_DB_CONN, async (err) => {
    if(err)
        throw err;

    await app.listen(PORT);

    console.log(`Server running in port ${PORT}...`);

});