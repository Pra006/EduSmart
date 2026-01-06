import React, { useState } from "react";
import { CreditCard, Lock, CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const location = useLocation();

  // 1. CAPTURE ALL DYNAMIC DATA FROM PREVIOUS PAGE
  const courseId = location.state?.courseId;
  const courseName = location.state?.courseName || "Selected Course";
  const coursePrice = Number(location.state?.coursePrice) || 100;
  const instructorName = location.state?.instructorName || "Instructor";
  const thumbnail = location.state?.thumbnail; // Capture the thumbnail
  const category = location.state?.category;   // Capture the category

  const tax = Number((coursePrice * 0.1).toFixed(2));
  const total = Number((coursePrice + tax).toFixed(2));

  const [formData, setFormData] = useState({
    studentName: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!formData.studentName || !formData.email) {
      alert("Please fill all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:3000/api/payment/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          studentName: formData.studentName,
          email: formData.email,
          courseName,
          instructorName,
        }),
      });

      const data = await response.json();
      if (!data.success) throw new Error(data.message);

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: formData.studentName,
              email: formData.email,
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
      } else if (paymentIntent.status === "succeeded") {
        setLoading(false);
        
        // 2. PASS THE DATA TO THE SUCCESS PAGE
        // We include thumbnail and instructorName here so MyCourses can see them
        navigate("/payment-success", {
          state: {
            courseId,
            courseName,
            thumbnail,      // Added
            instructor: instructorName, // Added
            category,       // Added
            amount: total.toFixed(2),
            studentName: formData.studentName,
            email: formData.email,
            transactionId: paymentIntent.id,
          },
        });
      }
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-8 rounded-3xl shadow border">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-7 h-7 text-indigo-600" />
            <h2 className="text-2xl font-bold">Checkout</h2>
          </div>

          <form onSubmit={handlePayment} className="space-y-5">
            <input
              name="studentName"
              placeholder="Full Name"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />

            <div className="p-4 border rounded-lg bg-gray-50">
              <label className="text-sm text-gray-600 mb-2 block">Card Details</label>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: "16px",
                      color: "#424770",
                      "::placeholder": { color: "#aab7c4" },
                    },
                    invalid: { color: "#9e2146" },
                  },
                }}
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading || !stripe}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all disabled:bg-gray-400"
            >
              {loading ? "Processing..." : `Pay $${total.toFixed(2)}`}
            </button>

            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <Lock className="w-4 h-4" />
              Secure encrypted payment
            </div>
          </form>
        </div>

        <div className="w-full lg:w-1/3 bg-white rounded-2xl shadow p-6 h-fit">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          
          {/* 3. OPTIONAL: SHOW THUMBNAIL IN SUMMARY IF YOU WANT */}
          {thumbnail && (
            <img src={thumbnail} alt="course" className="w-full h-32 object-cover rounded-xl mb-4" />
          )}

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span>Course</span>
              <span className="font-medium">{courseName}</span>
            </div>
            {/* 4. SHOW INSTRUCTOR NAME IN SUMMARY */}
            <div className="flex justify-between">
              <span>Instructor</span>
              <span className="font-medium text-gray-600">{instructorName}</span>
            </div>
            <div className="flex justify-between">
              <span>Price</span>
              <span>${coursePrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-6 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm">Instant course access after payment</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutForm;