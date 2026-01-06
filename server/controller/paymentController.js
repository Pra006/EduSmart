import Stripe from "stripe";
import Payment from "../model/paymentModel.js";
import dotenv from "dotenv";
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createPayment = async (req, res) => {
    try {
        const { studentName, email, courseName, instructorName, amount } = req.body;

        // 1. Validation: Ensure all required fields are present
        if (!amount || !email || !studentName) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields (amount, email, or studentName)" 
            });
        }
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(amount) * 100),
            currency: "usd",
            payment_method_types: ["card"],
            metadata: { studentName, courseName } // Optional: helps search in Stripe Dashboard
        });

        const payment = await Payment.create({
            studentName,
            email, // Make sure this matches the field name in your Model
            courseName,
            instructorName,
            amount,
            status: "pending", 
            paymentIntentId: paymentIntent.id
        });
        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            payment,
            message: "Payment intent created. Please confirm on the frontend."
        });

    } catch (error) {
        console.error("❌ Stripe/DB Error:", error.message);
        
       
        return res.status(500).json({
            success: false,
            message: error.message || "Internal Server Error"
        });
    }
};