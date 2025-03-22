import mongoose from 'mongoose';
import colors from 'colors';
import { ENV } from '../utils/loadEnv.js';

const Dbconnection = async () => {
    try {
        const connection = await mongoose.connect(ENV.MONGO_URL);
        console.log(`Connected to mongodb database`.bgGreen.white);
    } 
    catch (err) {
        console.log(`Error in database ${err}`.bgRed.white);
    }
};

export default Dbconnection;