import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";
import useFetch from "./hooks/useFetch";
import api from "./api/posts";

function App() {
  const submitBtnRef = useRef(null);
  const deleteBtnRef = useRef(null);
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();

  const {
    data: posts,
    setData: setPosts,
    isLoading,
    error,
  } = useFetch("/posts");

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = Date.now();
    // console.log(id);
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };

    if (submitBtnRef.current) {
      submitBtnRef.current.disable = true;
      submitBtnRef.current.innerText = "In progress...";
    }

    try {
      const response = await api.post("/posts", newPost);
      if (response.status === 201 || response.status === 200) {
        setPosts([...posts, newPost]);

        toast.success("Post created successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        navigate("/");
      }

      // axios da status 200-299 dan tashqari barchasini error catch qilgani uchun error notifikatsiyasi catch'da yozdim
    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      console.error(error.message);
    } finally {
      setPostTitle("");
      setPostBody("");

      submitBtnRef.current.disable = false;
      submitBtnRef.current.innerText = "Submit";
    }
  };

  const handleDelete = async (id) => {
    if (deleteBtnRef.current) {
      deleteBtnRef.current.disable = true;
      deleteBtnRef.current.innerText = "In progress...";
    }
    try {
      const response = await api.delete(`/posts/${id}`);
      if (response.status === 200) {
        setPosts(posts.filter((post) => post.id !== id));
        toast.success("Post deleted successfully!", {
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        });

        navigate("/");
      }
      // axios da status 200-299 dan tashqari barchasini error catch qilgani uchun error notifikatsiyasi catch'da yozdim
    } catch (error) {
      toast.error("Something went wrong", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });

      console.error(error);
    } finally {
      deleteBtnRef.current.disable = false;
      deleteBtnRef.current.innerText = "Delete";
    }
  };

  const handleClearAll = async () => {
    try {
      for (let post of posts) {
        await fetch(`${API_URL}/posts/${post.id}`, {
          method: "DELETE",
        });
        setPosts([]);
      }

      toast.success("All posts deleted!", {
        style: {
          borderRadius: "10px",
          background: "#333",
          color: "#fff",
        },
      });
      navigate("/");
    } catch (error) {}
    setPosts([]);
    navigate("/");
  };

  return (
    <div className="App">
      <Toaster position="top-right" />
      <Header title="React JS Blog" />
      <Nav search={search} setSearch={setSearch} />
      {error && <p style={{ color: "red" }}>Error:{error}</p>}
      <Routes>
        <Route
          path="/"
          element={
            <Home
              posts={searchResults}
              onLoad={isLoading}
              clearAll={handleClearAll}
            />
          }
        />
        <Route
          path="/post"
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
              btnRef={submitBtnRef}
            />
          }
        />
        <Route
          path="/post/:id"
          element={
            <PostPage
              deleteBtn={deleteBtnRef}
              posts={posts}
              handleDelete={handleDelete}
            />
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="*" component={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
