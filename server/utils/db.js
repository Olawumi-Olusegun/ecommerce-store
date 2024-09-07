import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";


export const connectDb = async () => {

    if(!MONGODB_URI) {
        throw new Error("Invalid database string");
    }

    mongoose.set("strictQuery", true);

    if(mongoose.connection.readyState === 0) {
        
        try {
              await mongoose.connect(MONGODB_URI);
              console.log(`Connected to database`)
          } catch (error) {
              console.log(`Error connecting to database ${error}`);
              process.exit(1);
          }
          
    } else {
        console.log("Connection already established")
    }


}