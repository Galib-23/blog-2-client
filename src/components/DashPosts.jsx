import { deleteObject, getDownloadURL, getStorage, ref } from "firebase/storage";
import { Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const DashPosts = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts);
          if (data.post.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchPosts();
    }
  }, [currentUser._id, currentUser.isAdmin]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`,
      );
      const data = await res.json();
      setUserPosts((prev) => [...prev, ...data.posts]);
      if (data.posts.length < 9) {
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
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



  const handleDeletePost = async (post) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteImage(post.image);
          const res = await fetch(
            `/api/post/deletepost/${post._id}/${currentUser._id}`,
            {
              method: 'DELETE',
            }
          );
          const data = await res.json();
          if (!res.ok) {
            console.log(data.message);
          } else {
            setUserPosts((prev) =>
              prev.filter((p) => p._id !== post._id)
            );
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    });
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {currentUser.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post Image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body key={post._id} className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleDeletePost(post)}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      className="text-teal-500 hover:underline"
                      to={`/update-post/${post._id}`}
                    >
                      <span>Edit</span>
                    </Link>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <div className="flex flex-col items-center mt-7">
              <button
                onClick={handleShowMore}
                className="underline hover:text-teal-300 text-teal-500 text-md"
              >
                Show more
              </button>
            </div>
          )}
        </>
      ) : (
        <p>You have no posts yet :(</p>
      )}
    </div>
  );
};

export default DashPosts;
