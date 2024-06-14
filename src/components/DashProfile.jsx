import { TextInput } from "flowbite-react";
import { useSelector } from "react-redux";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <div className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full">
          <img
            className="w-full h-full rounded-full object-cover border-4 border-[lightgray]"
            src={currentUser.profilePicture}
            alt=""
          />
        </div>
        <TextInput type="text" id="username" placeholder="username" defaultValue={currentUser.username} />
        <TextInput type="email" id="email" placeholder="email" defaultValue={currentUser.email} />
        <TextInput type="password" id="password" placeholder="password"/>
        <button type="submit" className="bg-cyan-600 py-3 rounded-lg font-semibold text-white hover:bg-cyan-300 hover:text-black">Update</button>
      </form>
      <div className="flex justify-between mt-4 text-red-600 font-semibold">
        <span className="cursor-pointer hover:text-red-400">Delete Account</span>
        <span className="cursor-pointer hover:text-red-400">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
