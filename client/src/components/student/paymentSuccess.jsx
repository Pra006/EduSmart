import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  
  const [isEnrolling, setIsEnrolling] = useState(true);
  const [error, setError] = useState(null);
  const [instructorName, setInstructorName] = useState(state?.instructor || "");

  useEffect(() => {
    const enrollStudentInDatabase = async () => {
      // Fetch course details to get instructor name if not already provided
      if (state && state.courseId && !instructorName) {
        try {
          const courseResponse = await axios.get(
            `http://localhost:3000/api/course/${state.courseId}`
          );
          if (courseResponse.data && courseResponse.data.instructor) {
            setInstructorName(courseResponse.data.instructor);
          }
        } catch (err) {
          console.warn("Could not fetch instructor name:", err);
        }
      }

      // Ensure we have the required data from the redirect state
      if (state && state.transactionId && state.courseId) {
        try {
          const studentId = localStorage.getItem("userId"); 
          
          console.log("StudentId from localStorage:", studentId);
          console.log("CourseId from state:", state.courseId);
          
          // Validate studentId exists and is not empty
          if (!studentId || studentId === "undefined" || studentId === "null") {
            console.error("Invalid studentId:", studentId);
            throw new Error("User not authenticated. Please login again.");
          }
          
          const enrollmentData = {
            studentId: studentId.trim(),
            courseId: state.courseId.trim(),
            paymentId: state.transactionId,
            amount: state.amount || "Paid", 
          };

          console.log("📤 Sending enrollment data:", enrollmentData);
          const response = await axios.post("/api/enrollment/create", enrollmentData);
          
          console.log("✅ Enrollment saved to MongoDB successfully:", response.data);
          setIsEnrolling(false);
        } catch (err) {
          console.error("Error saving enrollment:", err.response?.data || err.message);
          setError(err.response?.data?.message || "We couldn't automate your enrollment. Please contact support with your Transaction ID.");
          setIsEnrolling(false);
        }
      } else {
        console.warn("Missing required state data:", { state });
        setIsEnrolling(false);
      }
    };

    enrollStudentInDatabase();
  }, [state]);


  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-bold">Session Expired</h2>
        <p className="text-gray-500 mb-6">We couldn't find any transaction details.</p>
        <button onClick={() => navigate("/")} className="bg-gray-900 text-white px-6 py-2 rounded-lg">Go to Home</button>
      </div>
    );
  }

  const handleGoToCourses = () => {
    navigate("/my-courses", { 
      state: { 
        courseId: state.courseId, 
        courseName: state.courseName, 
        thumbnail: state.thumbnail, 
        instructor: state.instructor || "Expert Instructor",
        category: state.category || "General",
        transactionId: state.transactionId 
      } 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border border-gray-100">
        
        {isEnrolling ? (
          <div className="flex flex-col items-center py-10">
            <Loader2 className="h-16 w-16 text-indigo-600 animate-spin mb-6" />
            <h2 className="text-2xl font-bold text-gray-900">Finalizing Enrollment</h2>
            <p className="text-gray-500 mt-2">Setting up your access to {state.courseName}...</p>
          </div>
        ) : (
          <>
            {/* Visual Header */}
            <div className="relative flex justify-center mb-8">
              <div className="relative">
                {state.thumbnail ? (
                  <img 
                    src={state.thumbnail} 
                    alt="Course Thumbnail" 
                    className="w-32 h-32 rounded-3xl object-cover shadow-2xl border-4 border-white"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-3xl bg-indigo-50 flex items-center justify-center">
                    <ShieldCheck className="h-14 w-14 text-indigo-600" />
                  </div>
                )}
                <div className="absolute -bottom-3 -right-3 bg-green-500 rounded-full p-2 border-4 border-white shadow-lg">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Success! 🎉</h1>
            <p className="text-gray-500 mb-8">Your payment was processed and your enrollment is confirmed.</p>
            
            {/* Detailed Info Card */}
            <div className="bg-gray-50 rounded-3xl p-6 text-left mb-8 space-y-4 border border-gray-100">
              <div className="flex justify-between items-start">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Course Name</span>
                <span className="font-bold text-gray-900 text-sm text-right max-w-[200px]">{state.courseName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Instructor</span>
                <span className="font-semibold text-gray-700 text-sm">{instructorName || "Team LMS"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-wider">Status</span>
                <span className="bg-green-100 text-green-700 text-[10px] font-black px-3 py-1 rounded-full uppercase">Lifetime Access</span>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <span className="text-gray-400 text-[10px] font-bold uppercase block mb-1">Transaction Reference</span>
                <code className="text-xs text-indigo-600 font-mono break-all">{state.transactionId}</code>
              </div>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 rounded-xl flex items-center gap-3 text-left">
                <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                <p className="text-xs text-red-600 font-medium">{error}</p>
              </div>
            )}

            {/* Primary Action */}
            <button
              onClick={handleGoToCourses}
              className="group w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2 active:scale-[0.98]"
            >
              Start Learning Now
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <p className="mt-6 text-xs text-gray-400">
              A confirmation email has been sent to your registered address.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;