import { Spinner, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const DashComments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://blog-2-server.vercel.app/api/comment/getcomments`, {
          method: 'GET',
          credentials: 'include',
        });
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          setLoading(false);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        setLoading(false);
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error",
        });
        console.log(error.message);
      }
    };
    if (currentUser.isAdmin) {
      fetchComments();
    }
  }, [currentUser]);

  if (loading)
    return (
      <div className="flex flex-col w-full justify-center items-center">
        <Spinner size="xl" />
      </div>
    );


    const handleDelete = async (commentId) => {
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
            const res = await fetch(`https://blog-2-server.vercel.app/api/comment/deleteComment/${commentId}`, {
              method: "DELETE",
              credentials: 'include',
            });
            const data = await res.json();
            if (res.ok) {
              setComments(
                comments.filter((comment) => comment._id !== commentId),
              );
              Swal.fire({
                title: "Deleted!",
                text: "Comment has been deleted.",
                icon: "success"
              });
            } else {
              Swal.fire({
                title: "Error!",
                text: data.message,
                icon: "error",
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
      {currentUser.isAdmin && comments.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Comment content</Table.HeadCell>
              <Table.HeadCell>Likes</Table.HeadCell>
              <Table.HeadCell>Post</Table.HeadCell>
              <Table.HeadCell>User</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
            </Table.Head>
            {comments.map((comment) => (
              <Table.Body className="divide-y" key={comment._id}>
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell className="sm:max-w-56 md:max-w-96">{comment.content}</Table.Cell>
                  <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${comment.postId.slug}`}>
                      <img
                        className="w-20 h-10 object-cover bg-gray-500"
                        src={comment.postId.image}
                        alt=""
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <img
                      className="w-10 h-10 object-cover rounded-full bg-gray-500"
                      src={comment.userId.profilePicture}
                      alt=""
                    />
                  </Table.Cell>
                  <Table.Cell>{comment.userId.username}</Table.Cell>
                  <Table.Cell>
                    <span
                      onClick={() => handleDelete(comment._id)}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            ))}
          </Table>
          {showMore && (
            <button
              onClick={() => {}}
              className="w-full text-teal-500 self-center text-sm py-7"
            >
              Show more
            </button>
          )}
        </>
      ) : (
        <p>You have no comments yet!</p>
      )}
    </div>
  );
};

export default DashComments;
