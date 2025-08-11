import React from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const Hero = () => {
   const navigate = useNavigate()
  return (
    <div className="px-4 sm:px-20 xl:px-32 relative inline-flex flex-col w-full justify-center bg-[url(/gradientBackground.png)] bg-cover bg-no-repeat min-h-screen">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-5xl md:text-6xl 2xl:text-7xl font-semibold mx-auto leading-[1.2]">
          Unleash Your Creativity <br /> with{" "}
          <span className="text-blue-500">Powerful AI Tools</span>
        </h1>
        <p className="text-gray-500 mt-4">
          Instantly generate articles, images, and more with our suite of AI-powered tools. 
          Save time, boost productivity, and bring your ideas to life—no experience required.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm max-sm:text-xs">
        <button onClick={() => navigate('/ai')} className="bg-blue-500 text-white px-10 py-3 rounded-lg hover:scale-102 active:scale-95 transition cursor-pointer">
            Start Creating Now
        </button>
        <button onClick={()=>navigate('/contact')} className="bg-white px-10 py-3 rounded-lg border border-gray-300 hover:scale-102 active:scale-95 transition cursor-pointer">
        Contact us
        </button>
      </div>
      <div className="flex items-center gap-4 mt-8 mx-auto text-gray-600">
        <img src={assets.user_group} className="h-8" alt="User group" /> Trusted by 10,000+ creators
      </div>
    </div>
  );
};

export default Hero;
