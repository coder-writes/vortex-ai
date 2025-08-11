import { FileText, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import Markdown from "react-markdown";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState(null); // Initialize as null
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setContent("");
      setLoading(true);
      if (!input) {
        return toast.error("Please upload a file");
      }
      if (input.type !== "application/pdf") {
        return toast.error("Please upload a valid PDF file");
      }
      if (input.name.includes(" ")) {
        return toast.error("File name should not contain spaces");
      }
      // Optional: Check file size (e.g., limit to 5MB)
      if (input.size > 5 * 1024 * 1024) {
        return toast.error("File size exceeds 5MB limit");
      }

      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/review-resume", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred while reviewing the resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Resume Review</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Resume</p>
        <label
          htmlFor="resume-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors duration-200 mt-2 ${
            input 
              ? "border-green-400 bg-green-50 hover:bg-green-100" 
              : "border-[#8E37EB] bg-gray-50 hover:bg-purple-50"
          }`}
        >
          {input ? (
            <>
              <svg
                className="w-8 h-8 mb-2 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-sm text-green-700 font-medium text-center px-2">
                {input.name}
              </span>
              <span className="text-xs text-green-600 mt-1">
                {(input.size / (1024 * 1024)).toFixed(2)} MB • Click to change
              </span>
            </>
          ) : (
            <>
              <svg
                className="w-8 h-8 mb-2 text-[#8E37EB]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                />
              </svg>
              <span className="text-sm text-gray-600">
                Click to upload or drag and drop
              </span>
              <span className="text-xs text-gray-400 mt-1">
                PDF only, max 5MB
              </span>
            </>
          )}
          <input
            id="resume-upload"
            onChange={(e) => setInput(e.target.files[0] || null)}
            type="file"
            accept="application/pdf"
            className="hidden"
            required
          />
        </label>
        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Analysis Result</h1>
        </div>
        {loading && !content ? (
          <div className="mt-4 flex justify-center">
            <DotLottieReact
              src="https://lottie.host/66f9e1a0-dd17-4d43-91e5-90cfb0df98ec/fQQc4QTtX7.lottie"
              loop
              autoplay
            />
          </div>
        ) : content ? (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center h-full">
              <FileText className="w-9 h-9" />
              <p>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sunt,
                numquam nobis quis distinctio facilis cumque!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
