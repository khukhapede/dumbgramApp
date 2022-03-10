const jwt = require("jsonwebtoken");

exports.auth = (req, res, next) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.send({ messages: "access denied!!!" });
  }

  try {
    // const SECRET_KEY = "dumbgramTheBestSocmed";

    const verified = jwt.verify(token, process.env.TOKEN_KEY);

    req.users = verified;

    next();
  } catch (error) {
    res.status(400).send({
      messages: "invalid user access",
    });
  }
};
