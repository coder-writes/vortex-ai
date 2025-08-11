import { Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const GenerateImages = () => {
  const ImageStyle = [
    "Realistic",
    "Cartoon",
    "Sketch",
    "Watercolor",
    "Impressionist",
  ];
  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    setContent("");
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Generate an image of ${input} in the style of ${selectedStyle}`;
      const { data } = await axios.post(
        "/api/ai/generate-image",
        { prompt, publish },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
    toast.error(error.message)
    }
    setLoading(false)
  };

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-wrap gap-4 text-slate-700">
      {/* Left form */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Image Generator</h1>
        </div>

        {/* Text input */}
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Jelaskan mau gambar apa..."
          required
        />

        {/* Style options */}
        <p className="mt-4 text-sm font-medium">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {ImageStyle.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${
                selectedStyle === item
                  ? "bg-purple-50 text-purple-700 border-purple-300"
                  : "text-gray-500 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {item}
            </span>
          ))}
        </div>

        {/* Publish toggle */}
        <div className="flex items-center gap-3 my-6">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={publish}
              onChange={(e) => setPublish(e.target.checked)}
            />
            <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-all duration-300"></div>
            <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5" />
          </label>
          <span className="text-sm">Make this image public</span>
        </div>

        {/* Submit button */}
        <button
          disabled={loading}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg hover:opacity-90 transition"
        >
          {loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          : <Image className="w-5" /> } Generate Image
        </button>
      </form>

      {/* Right preview */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Generated Image</h1>
        </div>
        <div className="flex-1 flex justify-center items-center">
          {loading && !content ? (
            <div className="flex justify-center items-center w-full h-full">
              <DotLottieReact
                src="https://lottie.host/9e7691ea-4dda-4994-8d55-b0610b4620c2/M5zbUKEJ9l.lottie"
                loop
                autoplay
              />
            </div>
          ) : content ? (
            <div className="flex justify-center items-center w-full h-full">
              <img src={content} alt="img" className="max-w-full max-h-96 object-contain" />
            </div>
          ) : (
            <div className="flex flex-1 justify-center items-center w-full h-full">
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center px-6">
                <Image className="w-9 h-9" />
                <p>
                Describe what you want to see, pick an art style, and let the AI bring your vision to life. Your generated image will appear here once ready. Make it public for others to enjoy your creativity!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
