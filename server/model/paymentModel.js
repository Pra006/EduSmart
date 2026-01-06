import mongoose from 'mongoose'

const paymentSchema = new mongoose.Schema({
    studentName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        unique:false,
    },
    courseName:{
        type:String,
        required: true,
    },
    instructorName:{
        type:String,
        required:true
    },
    amount:{
        type:Number,
        required:true,
    },
    paymentIntentId:{
        type:String,
        required:true,
    },
    status:{
        type:String,
       enum: ["pending", "completed", "failed"],
        default: "pending",
    },
    timestamp:{
        type:Date,
        default:Date.now
    },
});
export default mongoose.model("Payment", paymentSchema);