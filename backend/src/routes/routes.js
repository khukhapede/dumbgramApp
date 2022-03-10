const express = require("express");

const router = express.Router();

const { auth } = require("../../middlewares/auth");

const { uploadFile } = require("../../middlewares/uploadFile");

const {
  register,
  userDetail,
  peopleDetail,
  login,
  getUsers,
  updateUsers,
  deleteUsers,
  userAuth,
} = require("../controller/users");

const {
  follow,
  followers,
  following,
  checkFollow,
} = require("../controller/follow");

const { inputMessage, getAllMessage } = require("../controller/message");

const {
  addFeed,
  getFeedByFollow,
  getAllFeeds,
  peopleFeeds,
  getFeedDetail,
  addLike,
  myFeeds,
  addComments,
  getAllComments,
} = require("../controller/feed");

//==================

//===== users and login =====
router.post("/register", register);

router.post("/login", login);

router.get("/users", getUsers);

router.get("/user-login", auth, userDetail);

router.get("/people/:id", auth, peopleDetail);

router.get("/check-auth", auth, userAuth);

router.patch("/user", auth, uploadFile("image"), updateUsers);

router.delete("/user", auth, deleteUsers);

// ===== follow process ======
router.post("/follow", auth, follow);

router.get("/follow-check/:id", auth, checkFollow);

router.get("/follower/:id", auth, followers);

router.get("/following/:id", auth, following);

// ====== messages =====
router.post("/message/:id", auth, inputMessage);

router.get("/message-user", auth, getAllMessage);

// ===== feeds =====
router.post("/feed", auth, uploadFile("testfield"), addFeed);

router.get("/get-feed", auth, getFeedByFollow);

router.get("/people-feeds/:id", auth, peopleFeeds);

router.get("/my-feeds", auth, myFeeds);

router.get("/feed-detail/:id", getFeedDetail);

router.get("/feeds", getAllFeeds);

router.post("/like", auth, addLike);

router.post("/comment", auth, addComments);

router.get("/comment/:id", auth, getAllComments);

module.exports = router;
