import { Alert, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const CreatePost = () => {
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [localImageFileUrl, setLocalImageFileUrl] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      setLocalImageFileUrl(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {
    return new Promise((resolve, reject) => {
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.log(error);
          setImageUploadError("Image upload failed");
          setImageUploadProgress(null);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadError(null);
            setImageUploadProgress(null);
            resolve(downloadURL);
          });
        },
      );
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = localImageFileUrl;
      if (file) {
        imageUrl = await uploadImage();
      }
      const updatedData = { ...formData, image: imageUrl };

      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      if (data.success === false) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate("/");
        Swal.fire({
          title: "Post published!",
          text: "You have successfully created this post",
          icon: "success",
        });
      }
    } catch (error) {
      console.log(error);
      setPublishError("Something went wrong");
    }
  };

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />
          <Select
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-[1px] border-teal-500 border-dashed p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* <button type="button" className="py-2 px-3 bg-cyan-900 hover:bg-cyan-700 text-white rounded-md hover:shadow-md">Upload</button> */}
          {imageUploadProgress &&
            Swal.fire({
              title: "Uploading...",
              text: `${imageUploadProgress}%` ,
              icon: "info",
            })}
          {(formData.image || localImageFileUrl) && (
            <img
              src={formData.image || localImageFileUrl}
              alt="upload"
              className="w-1/2 h-72 object-cover rounded-lg"
            />
          )}
        </div>
        {imageUploadError && (
          <h1 className="text-red-500">{imageUploadError}</h1>
        )}
        <ReactQuill
          theme="snow"
          placeholder="Write something"
          className="h-72 mb-12"
          required
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <button
          type="submit"
          className="py-2 px-3 bg-cyan-900 hover:bg-cyan-700 text-white rounded-md hover:shadow-md  self-center w-full sm:w-1/2"
        >
          Publish
        </button>
        {publishError && (
          <Alert color="failure" className="mt-5">
            {publishError}
          </Alert>
        )}
      </form>
    </div>
  );
};

export default CreatePost;
