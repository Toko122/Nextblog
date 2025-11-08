import mongoose from 'mongoose'

let isConnected = false;

const connectDb = async() => {
    if(isConnected && mongoose.connection.readyState === 1) {
        return;
    }
    
    try{
        if(mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB, {
                bufferCommands: false,
            })
            isConnected = true
            console.log("MongoDB connected");
        }
    }catch(err){
    console.error("MongoDB connection error:", err);
     isConnected = false;
    }
}

export default connectDb