import React from "react";
import microsoft from "../../assets/microsoft.jpeg";
import paypal from "../../assets/paypal.png";
import google from "../../assets/google.webp";
import accenture from "../../assets/accenture.png";
import apple from "../../assets/apple.jpg";



const Companies = () => {
  return (
    <section className="text-center py-10">
      {/* Heading */}
      <p className="text-gray-600 text-xl font-medium mb-6">
        Trusted by learners from
      </p>

      {/* Company Logos */}
      <div className="flex flex-wrap justify-center items-center gap-8 px-10">
        <img
          src={microsoft}
          alt="Microsoft"
          className="w-[120px] sm:w-[180px] h-auto object-contain rounded-2xl shadow-sm hover:scale-105 transition-transform duration-300"
        />
        <img
          src={paypal}
          alt="Microsoft"
          className="w-[120px] sm:w-[180px] h-auto object-contain rounded-2xl shadow-sm hover:scale-105 transition-transform duration-300"
        />
        <img
          src={google}
          alt="Microsoft"
          className="w-[120px] sm:w-[180px] h-auto object-contain rounded-2xl shadow-sm hover:scale-105 transition-transform duration-300"
        />
        <img
          src={accenture}
          alt="Microsoft"
          className="w-[120px] sm:w-[180px] h-auto object-contain rounded-2xl shadow-sm hover:scale-105 transition-transform duration-300"
        />
      </div>
    </section>
  );
};

export default Companies;
