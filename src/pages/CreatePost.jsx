import { FileInput, Select, TextInput } from "flowbite-react";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl my-7 font-semibold">Create a post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput type="text" placeholder="Title" required id="title" className="flex-1" />
          <Select>
            <option value="uncategorized">Select a category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">Next.js</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-[1px] border-teal-500 border-dashed p-3">
          <FileInput type="file" accept="image/*" />
          <button type="button" className="py-2 px-3 bg-cyan-900 hover:bg-cyan-700 text-white rounded-md hover:shadow-md">Upload</button>
        </div>
        <ReactQuill theme="snow" placeholder="Write something" className="h-72 mb-12"/>
        <button type="button" className="py-2 px-3 bg-cyan-900 hover:bg-cyan-700 text-white rounded-md hover:shadow-md  self-center w-full sm:w-1/2">Publish</button>
      </form>
    </div>
  )
}

export default CreatePost
