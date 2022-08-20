require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const recordRoutes = require('./routes/recordRoutes');
const authenticationRoutes = require('./routes/authenticationRoutes');
const middlewares = require('./middlewares');
const { authenticateMiddleware } = require('./middlewares/authentication');

app.options('*', cors()) // include before other routes
app.use(cors({
    origin: 'http://tsr-memento-react.s3-website-ap-southeast-1.amazonaws.com',
})); // cors policy
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(morgan('combined'));

const apiRoute = express.Router();
apiRoute.use(authenticateMiddleware);
apiRoute.use(recordRoutes);

app.use(authenticationRoutes);
app.use('/api/', apiRoute);
app.use(middlewares.errorHandler);

const PORT = process.env.PORT;

mongoose.connect(process.env.MONGO_DB_CONN, async (err) => {
    if(err)
        throw err;

    await app.listen(PORT);

    console.log(`Server running in port ${PORT}...`);

});