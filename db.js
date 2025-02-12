const mongoose = require('mongoose');

const connectDB = async () => {
    if (!process.env.MONGO_DB_URL) throw new Error('Falta la url de la base de datos');

    try {
        await mongoose.connect(process.env.MONGO_DB_URL);
        console.log('Data Base connected...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
