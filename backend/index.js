require("dotenv").config();
const express = require("express");
const cors = require("cors");
// Get routes to the variabel
const router = require("./src/routes/routes");

const app = express();

const port = 5000;

const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // define client origin if both client and server have different origin
  },
});

app.use(express.json());
app.use(cors());

// Add endpoint grouping and router
app.use("/api/v1/", router);
app.use("/uploads", express.static("uploads"));

app.listen(port, () => console.log(`Listening on port ${port}!`));
