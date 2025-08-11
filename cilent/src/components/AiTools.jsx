import React from 'react'
import { AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'

const AiTools = () => {
    const navigate = useNavigate()
    const {user} = useUser()
  return (
    <div className='px-4 sm:px-20 xl:px-32 my-24'>
      <div className='text-center'>
        <h2 className='text-slate-700 text-[42px] font-semibold'>
        Powerful AI Tools
        </h2>
        <p className='text-gray-500 max-w-lg mx-auto'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sequi pariatur quis exercitationem suscipit ipsa ea! Placeat dolorum accusamus, pariatur harum, corporis rerum culpa officiis in soluta, amet quod beatae quasi.</p>
      </div>
      <div className="flex flex-wrap mt-10 justify-center gap-4">
  {AiToolsData.map((tool, index) => (
    <div
      key={index}
      className="p-8 w-[300px] bg-[#FDFDFE] shadow-lg border border-gray-100 rounded-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
      onClick={() => user && navigate(tool.path)}
    >
      <tool.Icon
        className="w-12 h-12 p-3 text-white rounded-xl"
        style={{
          background: `linear-gradient(to bottom, ${tool.bg.to})`,
        }}
      />
      <h3 className="mt-6 mb-3 text-lg font-semibold">{tool.title}</h3>
      <p className="text-gray-400 text-sm">{tool.description}</p>
    </div>
  ))}
</div>

    </div>
  )
}

export default AiTools
