import gitProfile  from "../assets/gitbg2.png";

export default function CallToAction() {
  return (
    <div className='flex flex-col sm:flex-row p-3 border border-teal-600 justify-center items-center rounded-tl-3xl rounded-br-3xl text-center'>
        <div className="flex-1 justify-center flex flex-col">
            <h2 className='text-2xl'>
                Want to stay updated about Development?
            </h2>
            <p className='text-gray-500 my-2'>
                Checkout the free resources on my Github profile.
            </p>
            <button className='bg-gradient-to-l from-indigo-500 via-purple-500 to-pink-500 p-2 rounded-tl-xl rounded-br-xl hover:bg-gradient-to-r hover:from-indigo-500 hover:via-purple-500 hover:to-pink-500 font-medium text-white hover:text-black hover:shadow-lg'>
                <a href="https://github.com/Galib-23" target='_blank' rel='noopener noreferrer'>
                    Visit
                </a>
            </button>
        </div>
        <div className="p-7 flex-1">
            <img className=" rounded-tl-xl rounded-br-xl" src={gitProfile} />
        </div>
    </div>
  )
}