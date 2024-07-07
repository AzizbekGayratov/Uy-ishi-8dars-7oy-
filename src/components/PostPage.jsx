import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const PostPage = ({ deleteBtn, posts, handleDelete }) => {
  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);

  const navigate = useNavigate();

  return (
    <main className="PostPage">
      <article className="post">
        {post && (
          <>
            <h2>{post.title}</h2>
            <p className="postDate">{post.datetime}</p>
            <p className="postBody">{post.body}</p>
            <button
              ref={deleteBtn}
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    handleDelete(post.id);
                  }
                });
              }}
            >
              Delete Post
            </button>
            <button
              onClick={() => navigate(-1)}
              style={{
                marginLeft: "1rem",
                backgroundColor: "transparent",
                color: "black",
              }}
            >
              Cancel
            </button>
          </>
        )}
        {!post && (
          <>
            <h2>Post Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
              <Link to="/">Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;
