// db/db.js or config/db.js
import mongoose from 'mongoose';

export const db = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL || "mongodb+srv://Prakash:Prakash123@authdata.jyuw54c.mongodb.net/?appName=Authdata");
        
        console.log("✅ Database connected successfully");
        console.log(`📊 Database: ${mongoose.connection.name}`);
        
        // Connection event handlers
        mongoose.connection.on('connected', () => {
            console.log('✅ Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (err) => {
            console.error('❌ Mongoose connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('⚠️ Mongoose disconnected from MongoDB');
        });

        // Graceful shutdown
        process.on('SIGINT', async () => {
            await mongoose.connection.close();
            console.log('⚠️ Mongoose connection closed due to app termination');
            process.exit(0);
        });

    } catch (error) {
        console.log("❌ Database connection error:", error);
        process.exit(1);
    }
};