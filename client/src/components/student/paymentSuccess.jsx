import React, { useEffect, useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; 

const PaymentSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isEnrolling, setIsEnrolling] = useState(true);

  useEffect(() => {
    const enrollStudentInDatabase = async () => {
      if (state && state.transactionId) {
        try {
          const studentId = localStorage.getItem("userId"); 
          const courseId = state.courseId; 

          const enrollmentData = {
            studentId: studentId,
            courseId: courseId,
            paymentId: state.transactionId
          };

          await axios.post("http://localhost:3000/api/enroll/create", enrollmentData);
          console.log("Enrollment saved to MongoDB successfully");
        } catch (error) {
          console.error("Error saving enrollment:", error);
        } finally {
          setIsEnrolling(false);
        }
      } else {
        setIsEnrolling(false);
      }
    };

    enrollStudentInDatabase();
  }, [state]);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No payment data found.</p>
      </div>
    );
  }

  // UPDATED NAVIGATION HANDLER
  const handleGoToCourses = () => {
    navigate("/my-courses", { 
      state: { 
        transactionId: state.transactionId,
        courseId: state.courseId,
        courseName: state.courseName, // This shows the name in MyCourses
        thumbnail: state.thumbnail,   // This shows the image in MyCourses
        instructor: state.instructor,
        category: state.category
      } 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-3xl shadow-lg max-w-md w-full text-center">
        {isEnrolling ? (
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Finalizing your enrollment...</p>
          </div>
        ) : (
          <>
            <div className="relative mb-6">
              {/* Show thumbnail if available for better UX */}
              {state.thumbnail && (
                <img 
                  src={state.thumbnail} 
                  alt="Course" 
                  className="w-24 h-24 rounded-2xl mx-auto object-cover border-4 border-green-50 shadow-md mb-2" 
                />
              )}
              <CheckCircle className="h-10 w-10 text-green-500 absolute -bottom-2 right-1/2 translate-x-12 bg-white rounded-full" />
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful 🎉</h1>
            <p className="text-gray-600 mb-6">Your course has been successfully added to your library.</p>
            
            <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-3 mb-8 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Course</span>
                <span className="font-bold text-gray-800 text-sm">{state.courseName}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-sm">Status</span>
                <span className="text-green-600 font-bold text-xs uppercase bg-green-50 px-2 py-1 rounded">Confirmed</span>
              </div>
              <p className="text-[10px] text-gray-400 font-mono mt-2 pt-2 border-t border-gray-200">
                TXN: {state.transactionId}
              </p>
            </div>

            <button
              onClick={handleGoToCourses}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-100 active:scale-95"
            >
              Go to My Courses
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;