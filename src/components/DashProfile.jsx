import { Alert, TextInput } from "flowbite-react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { MdModeEdit } from "react-icons/md";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutSuccess,
  updateFailure,
  updateStart,
  updateSuccess,
} from "../redux/user/userSlice";
import Swal from "sweetalert2";

import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";

const DashProfile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [localImageFileUrl, setLocalImageFileUrl] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [updateDisable, setUpdateDisable] = useState(true);
  const [formData, setFormData] = useState({});

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setLocalImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      setUpdateDisable(false);
    }
  }, [imageFile]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
    setUpdateDisable(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateStart());
      let imageUrl =
        formData.profilePicture || currentUser.profilePicture || "";
      if (localImageFileUrl) {
        imageUrl = await uploadImage();
      }

      const updatedData = { ...formData, profilePicture: imageUrl };

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: data.message,
        });
        setUpdateDisable(true);
      } else {
        dispatch(updateSuccess(data));
        Swal.fire("User updated successfully");
        setUploadProgress(null);
        setUpdateDisable(true);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
      });
      dispatch(updateFailure(error.message));
      setUpdateDisable(true);
    }
  };

  const uploadImage = async () => {
    if (currentUser.profilePicture) {
      await deleteImage(currentUser.profilePicture);
    }
    return new Promise((resolve, reject) => {
      setUploadError(null);
      const storage = getStorage(app);

      // Create a unique filename to avoid error
      const fileName = new Date().getTime() + imageFile.name;

      // Create a ref of storage. This ref is from firebase/storage
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
          setUploadError(
            "Could not upload image. (File must be less than 2MB)",
          );
          setUploadProgress(null);
          setImageFile(null);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        },
      );
    });
  };

  const deleteImage = (imageUrl) => {
    return new Promise((resolve, reject) => {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, imageUrl);

        getDownloadURL(imageRef)
          .then(() => {
            return deleteObject(imageRef);
          })
          .then(() => {
            resolve();
          })
          .catch((error) => {
            if (error.code === "storage/object-not-found") {
              console.log("Image not found");
              resolve();
            } else {
              console.log("inside else: ", error);
              reject(error);
            }
          });
      } catch (error) {
        console.log(error.code);
        if (error.code === "storage/invalid-url") {
          console.log("Image not found");
          resolve();
        }
        reject(error);
      }
    });
  };
  const handleDeleteUser = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          dispatch(deleteUserStart());
          console.log("disp start");
          if (currentUser.profilePicture) {
            console.log("going to call");
            await deleteImage(currentUser.profilePicture);
          }
          console.log("after call");
          const res = await fetch(`/api/user/delete/${currentUser._id}`, {
            method: "DELETE",
          });
          const data = await res.json();
          if (!res.ok) {
            dispatch(deleteUserFailure(data.message));
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: data.message || "Something went wrong!",
            });
          } else {
            dispatch(deleteUserSuccess());
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
          }
        } catch (error) {
          dispatch(deleteUserFailure(error.message));
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        }
      }
    });
  };

  const handleSignout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sign Out"
    }).then(async (result) => {
      if (result.isConfirmed) {

        try {
          const res = await fetch('/api/user/signout', {
            method: 'POST',
          });
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          }else{
            dispatch(signOutSuccess());
            Swal.fire({
              title: "Signed Out",
              text: "You have successfully logged out",
              icon: "success"
            });
          }
        } catch (error) {
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: error.message || "Something went wrong!",
          });
        }
      }
    });
  };

  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleImageChange}
          ref={filePickerRef}
        />
        <div className="self-center relative">
          {uploadProgress && (
            <CircularProgressbar
              value={uploadProgress || 0}
              text={`${uploadProgress} %`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "128px",
                  height: "128px",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${uploadProgress / 100})`,
                },
              }}
            />
          )}
          <img
            className={`w-32 h-32 rounded-full object-cover border-4 border-[lightgray] ${
              uploadProgress && uploadProgress < 100 && "opacity-60"
            }`}
            src={localImageFileUrl || currentUser.profilePicture}
            alt=""
          />
          <span
            onClick={() => filePickerRef.current.click()}
            className="text-sm absolute -left-1 font-medium top-2 flex gap-1 items-center bg-white text-black rounded-lg p-1 shadow-sm cursor-pointer hover:scale-105"
          >
            <MdModeEdit className="dark:text-black" /> Edit
          </span>
        </div>
        {uploadError && <Alert color="failure">{uploadError}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentUser.username}
          onChange={handleChange}
        />
        <TextInput
          type="email"
          id="email"
          disabled
          placeholder="email"
          defaultValue={currentUser.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="password"
          onChange={handleChange}
        />
        <button
          disabled={updateDisable}
          type="submit"
          className={`${
            !updateDisable
              ? "bg-cyan-600 text-white hover:bg-cyan-300 hover:text-black"
              : "bg-gray-300 text-slate-600"
          } py-3 rounded-lg font-semibold`}
        >
          Update
        </button>
      </form>
      <div className="flex justify-between mt-4 text-red-600 font-semibold">
        <span
          onClick={handleDeleteUser}
          className="cursor-pointer hover:text-red-400"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignout}
          className="cursor-pointer hover:text-red-400"
        >
          Sign Out
        </span>
      </div>
    </div>
  );
};

export default DashProfile;
