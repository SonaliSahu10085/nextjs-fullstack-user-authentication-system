import mongoose from "mongoose";

export async function connectDb() {
    try {
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("MongoDb Connected Successfully.")
    } catch (err) {
        console.log("Something went wrong on db side");
        console.log(err);
    }
}