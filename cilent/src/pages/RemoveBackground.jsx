import { Eraser, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setContent("");
      setLoading(true);
      const formData = new FormData();
      formData.append("image", input);
      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-center justify-center flex-wrap gap-4 text-slate-700">
        <form
          onSubmit={onSubmitHandler}
          action=""
          className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 text-[#8E37EB]" />
            <h1 className="text-xl font-semibold">Background Removal</h1>
          </div>
          <p className="mt-6 text-sm font-medium">Upload Image</p>
          <label className="block mt-2">
            <span className="sr-only">Choose image</span>
            <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className=" block w-full text-sm text-gray-600
            file:mr-4 file:py-2 file:px-4
            file:rounded-lg file:border-0
            file:text-sm file:font-semibold
            file:bg-gradient-to-r file:from-[#C341F6] file:to-[#8E37EB] file:text-white
            hover:file:from-[#a82be2] hover:file:to-[#7a2bbd]
            cursor-pointer
            "
          required
            />
          </label>
          <p className="text-xs text-gray-500 font-light mt-1">
            Support image file only
          </p>

          <button
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
          >
            {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> : <Eraser className="w-5" />}
            Remove Background
          </button>
        </form>
        {/* right */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 justify-center items-center">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {loading && !content ? (
           <div className="mt-4 flex justify-center items-center w-full h-full flex-1">
          <DotLottieReact
              src="https://lottie.host/a78033e4-d89d-4db8-94fb-cfe8a2927059/YAk7k1LtmO.lottie"
              loop
              autoplay
            />
        </div>
        ) : !content ? (
          <div className="flex-1 flex justify-center items-center w-full h-full">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9" />
            <p>
              Upload an image to see the background-removed result here.
            </p>
          </div>
        </div>
          ) : (
            <div className="flex-1 flex justify-center items-center w-full h-full">
              <img src={content} alt="image" className="mt-3 max-w-full max-h-96 object-contain" />
            </div>
          )
        }
      </div>
    </div>
  );
};

export default RemoveBackground;
