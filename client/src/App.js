import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Landing from "./pages/Landing/Landing";
import EditProfile from "./pages/EditProfile/EditProfile";
import CreatePost from "./pages/CreatePost/CreatePost";
import Feed from "./pages/Feed/Feed";
import Message from "./pages/Message/Message";
import UserProfile from "./pages/UserProfile/UserProfile";
import Explore from "./pages/Explore/Explore";
import MyFeed from "./pages/MyFeed/Myfeed";

import { Routes, Route, useNavigate } from "react-router-dom";

import { useContext, useState, useEffect } from "react";
import { UserContext } from "./context/userContext";

import { API } from "./config/api";

function App() {
  let api = API();
  let navigate = useNavigate();
  const [state, dispatch] = useContext(UserContext);

  useEffect(() => {
    if (!state.isLogin) {
      navigate("/");
    } else {
      navigate("/feed");
    }
  }, [state]);

  const checkUser = async () => {
    try {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };
      const response = await api.get("/check-auth", config);

      // If the token incorrect
      if (response.status === "failed") {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }

      // // Get user data
      let payload = response.data;
      console.log(payload);
      // // Get token from local storage
      payload.token = localStorage.token;
      console.log(payload.token);

      // // Send data to useContext
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  return (
    <Routes>
      <Route exact path="/" element={<Landing />} />
      <Route exact path="/edit" element={<EditProfile />} />
      <Route exact path="/create" element={<CreatePost />} />
      <Route exact path="/feed" element={<Feed />} />
      <Route exact path="/message" element={<Message />} />
      <Route path="/people" element={<UserProfile />}>
        <Route path=":id" element={<UserProfile />} />
      </Route>
      <Route exact path="/explore" element={<Explore />} />
      <Route exact path="/my-feed" element={<MyFeed />} />
    </Routes>
  );
}

export default App;
