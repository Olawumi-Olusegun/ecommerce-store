import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";


export const connectDb = async () => {

    if(!MONGODB_URI) {
        throw new Error("Invalid database string");
    }

    mongoose.set("strictQuery", true);

    try {

        await mongoose.connect(MONGODB_URI);

        if(mongoose.connection.readyState === 1) {
            console.log(`Connected to database`)
        }else {
            console.log("Connection already established")
        }
        
    } catch (error) {
        console.log(`Error connecting to database ${error}`);
        process.exit(1);
    }


}