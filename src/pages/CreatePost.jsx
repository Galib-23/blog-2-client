import { Alert, FileInput, Select, TextInput } from "flowbite-react";
import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = localImageFileUrl;
      if (file) {
        imageUrl = await uploadImage();
      }
      const updatedData = { ...formData, image: imageUrl };

      const res = await fetch("https://blog-2-server.vercel.app/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include',
        body: JSON.stringify(updatedData),
      });
      const data = await res.json();
      if (!res.ok) {
        if (updatedData.image) {
          await deleteImage(updatedData.image);
        }
        setPublishError(data.message);
        return;
      }
      if (data.success === false) {
        setPublishError(data.message);
        return;
      }
      if (res.ok) {
        setPublishError(null);
        navigate(`/post/${data.slug}`);
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
          {
            imageUploadProgress ? `Uploading...${imageUploadProgress}%` : 'Publish'
          }
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
