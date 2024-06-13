import { FaGoogle } from "react-icons/fa";

const OAuth = () => {

    const handleGoogleClick = async () => {

    }

  return (
    <button onClick={handleGoogleClick} className="w-full text-black bg-slate-200 py-2 rounded-lg hover:shadow-sm hover:bg-slate-100 hover:text-slate-700">
        <div className="flex items-center justify-center gap-2">
        <FaGoogle /> <span className="font-semibold">Continue with google</span>
        </div>
    </button>
  )
}

export default OAuth
