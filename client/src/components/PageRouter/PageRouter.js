import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Landing from "../../pages/Landing/Landing";
import EditProfile from "../../pages/EditProfile/EditProfile";
import CreatePost from "../../pages/CreatePost/CreatePost";

export default function RouterPage() {
  return (
    <Routes>
      <Route exact path="/" element={Landing} />
      <Route path="/edit" element={<EditProfile />} />
      <Route exact path="/post">
        <CreatePost />
      </Route>
    </Routes>
  );
}
