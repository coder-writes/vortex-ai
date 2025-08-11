import { Eraser, Scissors, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "@clerk/clerk-react";
import toast from "react-hot-toast";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const { getToken } = useAuth();
  const onSubmitHandler = async (e) => {
    e.preventDefault();
     try {
      setContent("");
      setLoading(true);
      if(object.split(' ').length > 1){
        return toast('Please enter only one object name')
      }
      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
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
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* left */}
      <form
        onSubmit={onSubmitHandler}
        action=""
        className="w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#8E37EB]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>
        <label className="block mt-2">
          <span className="sr-only">Choose image</span>
          <input
            onChange={(e) => setInput(e.target.files[0])}
            type="file"
            accept="image/*"
            className="block w-full text-sm text-gray-600
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

        <p className="mt-6 text-sm font-medium">Describe Object name to Remove</p>
        <input
          onChange={(e) => setObject(e.target.value)}
          value={object}
          type="text"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 focus:border-[#8E37EB] focus:ring-2 focus:ring-[#C341F6]/30 transition"
          placeholder="Enter object name to remove..."
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#C341F6] to-[#8E37EB] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer"
        >
          <Scissors className="w-5" /> Remove Object
        </button>
      </form>
      {/* right */}
      <div className="w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          {
            loading ? <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span> :
          <Scissors className="w-5 h-5 text-[#8E37EB]" />
          }
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>
        {loading && !content ? (
           <div className="mt-4 flex justify-center">
          <DotLottieReact
              src="https://lottie.host/a78033e4-d89d-4db8-94fb-cfe8a2927059/YAk7k1LtmO.lottie"
              loop
              autoplay
            />
        </div>
        ) :  !content ? ( <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Scissors className="w-9 h-9" />
            <p>
               Upload an image and specify an object name to remove it from the image
            </p>
          </div>
        </div>) : (
          <img src={content} alt="img" className="mt-3 w-full h-full" />
        )
        }
      </div>
    </div>
  );
};

export default RemoveObject;
