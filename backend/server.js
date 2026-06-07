const dotenv = require('dotenv').config();
const connectDB = require('./connect/database')
const express = require('express');
const { errorHandler } = require('./middleWare/middleWare');
const Cors = require('cors');
const port = process.env.PORT || 5000;

connectDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(Cors());

app.get('/', (req, res) => {
    res.json({ message: 'API is running', version: '1.0.0' })
})

app.use('/api/tasks', require('./routes/taskRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/patients', require('./routes/patientRoutes'))
app.use('/api/appointments', require('./routes/appointmentRoutes'))
app.use('/api/treatments', require('./routes/treatmentRoutes'))

app.use(errorHandler);

app.listen(port, () => console.log(`server is running away... on port ${port}`))




