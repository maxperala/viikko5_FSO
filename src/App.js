import { useState, useEffect } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/loginService";
import Notification from "./components/Notif";
const { login, submit } = loginService;
const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [url, setUrl] = useState("");
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    success: false,
  });

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Logging in with", username, password);
    const paluu = await login(username, password);
    //console.log(paluu);
    if (paluu.token) {
      setUser(paluu);
      setUsername("");
      setPassword("");
      window.localStorage.setItem("loggedUser", JSON.stringify(paluu));
      //console.log(user);

      setNotification({
        show: true,
        message: `Logged in as ${paluu.name}`,
        success: true,
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", success: false });
      }, 5000);
    } else {
      console.log("wrong credentials");
      setNotification({
        show: true,
        message: `Invalid username or password`,
        success: false,
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", success: false });
      }, 5000);
    }
  };
  const logOut = (event) => {
    event.preventDefault();

    window.localStorage.clear();
    setUser(null);
    setPassword("");
    setUsername("");
    setNotification({
      show: true,
      message: `Logged out`,
      success: true,
    });
    setTimeout(() => {
      setNotification({ show: false, message: "", success: false });
    }, 5000);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await submit(
      { title: title, author: author, url: url },
      user.token
    );
    console.log(res);
    if (res.status === 201) {
      setNotification({
        show: true,
        message: `Added ${title} by ${author}`,
        success: true,
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", success: false });
      }, 5000);
    } else {
      setNotification({
        show: true,
        message: `Error adding Blog`,
        success: false,
      });
      setTimeout(() => {
        setNotification({ show: false, message: "", success: false });
      }, 5000);
    }
    blogService.getAll().then((blogs) => setBlogs(blogs));
  };

  if (user === null) {
    return (
      <div>
        <div>
          <Notification
            message={notification.message}
            success={notification.success}
            show={notification.show}
          />
        </div>
        <h2>Log in</h2>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            ></input>
          </div>
          <div>
            password
            <input
              type="text"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            ></input>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div>
        <Notification
          message={notification.message}
          success={notification.success}
          show={notification.show}
        />
      </div>
      <div>
        Logged in as {user.name}
        <button onClick={logOut}>Log out</button>
      </div>
      <div>
        <form onSubmit={handleSubmit}>
          <h2>Create New:</h2>
          title:
          <input
            type="text"
            name="Title"
            onChange={({ target }) => setTitle(target.value)}
          ></input>
          author:
          <input
            type="text"
            name="Author"
            onChange={({ target }) => setAuthor(target.value)}
          ></input>
          url:
          <input
            type="text"
            name="Url"
            onChange={({ target }) => setUrl(target.value)}
          ></input>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <h2>blogs</h2>
        {blogs.map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
      </div>
    </div>
  );
};

export default App;
