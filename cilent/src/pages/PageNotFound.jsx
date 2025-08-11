import React from 'react'
import { DotLottieReact } from '@lottiefiles/dotlottie-react'
import { useNavigate } from 'react-router-dom'
const PageNotFound = () => {
    const navigate = useNavigate();
    return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <DotLottieReact
      src="https://lottie.host/dcc07ebb-a0b5-4fd4-8d43-846b900da89b/R7kSST4y6M.lottie"
      loop
      autoplay
    />
        <div className="text-center mt-6">
            <h2 className="text-2xl font-bold">Page Not Found</h2>
            <p className="text-gray-500">Sorry, the page you are looking for does not exist.</p>
        </div>
        <button onClick={()=>navigate('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">Go Back Home</button>
    </div>
  )
}

export default PageNotFound
