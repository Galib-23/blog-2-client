import { TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  const filePickerRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      //convert to URL (temporary)
      setImageFileUrl(URL.createObjectURL(file));
    }
  };
  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    const storage = getStorage(app);

    //create a unique filename to avoid error
    const fileName = new Date().getTime() + imageFile.name;

    //create a ref of storage. this ref is from firebase/storage
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log(error);
        setUploadError("Could not upload image. (File must be less then 2MB)");
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          setImageFileUrl(downloadUrl);
        });
      },
    );
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
        />
        <div className="self-center relative">
          <img
            className="w-32 h-32 rounded-full object-cover border-4 border-[lightgray]"
            src={imageFileUrl || currentUser.profilePicture}
            alt=""
          />
          <span
            onClick={() => filePickerRef.current.click()}
            className="text-sm absolute -left-1 font-medium top-2 flex gap-1 items-center bg-white text-black rounded-lg p-1 shadow-sm cursor-pointer hover:scale-105"
          >
            <MdModeEdit className="dark:text-black" /> Edit
          </span>
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput type="password" id="password" placeholder="password" />
        <button
          type="submit"
          className="bg-cyan-600 py-3 rounded-lg font-semibold text-white hover:bg-cyan-300 hover:text-black"
        >
          Update
        </button>
      </form>
      <div className="flex justify-between mt-4 text-red-600 font-semibold">
        <span className="cursor-pointer hover:text-red-400">
          Delete Account
        </span>
        <span className="cursor-pointer hover:text-red-400">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
