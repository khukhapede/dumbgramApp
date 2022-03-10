const { users, followRelation, feeds } = require("../../models");

const joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const Sequelize = require("sequelize");
const { json } = require("express/lib/response");

exports.register = async (req, res) => {
  const schema = joi.object({
    fullname: joi.string().min(3).required(),
    email: joi.string().email().required(),
    password: joi.string().required(),
    username: joi.string().alphanum().min(3).max(30).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.send({
      error: error.details[0].message,
    });
  }
  try {
    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const emailCheck = await users.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    console.log(emailCheck);

    if (emailCheck) {
      res.status(200).send({
        status: "exist",
        message: "email already exist",
      });
    } else {
      const newUser = await users.create({
        email: req.body.email,
        username: req.body.username,
        password: hashedPassword,
        fullname: req.body.fullname,
      });
      // const SECRET_KEY = "dumbgramTheBestSocmed";

      const token = jwt.sign({ email: newUser.email }, process.env.TOKEN_KEY);

      res.status(200).send({
        status: "success",
        message: "register successful",
        data: {
          user: {
            fullname: newUser.fullname,
            username: newUser.username,
            token,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

//validation login
exports.login = async (req, res) => {
  const schema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().min(5).required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.send({
      error: error.details[0].message,
    });
  }

  try {
    const { email, password } = req.body;

    // return res.send({ email, password });

    const userExist = await users.findOne({
      where: {
        email: email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    console.log(userExist);

    if (userExist == null) {
      return res.status(400).send({
        status: "failed",
        message: "email or password mismatch",
      });
    }

    const isValid = await bcrypt.compare(password, userExist.password);

    console.log(isValid);

    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "password or email mismatch",
      });
    }

    data = {
      id: userExist.id,
      email: userExist.email,
      username: userExist.username,
    };

    const token = jwt.sign(data, process.env.TOKEN_KEY);

    res.send({
      status: "success",
      message: "login success",
      data: {
        fullname: userExist.fullname,
        email: userExist.email,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

// get detail of user login

exports.userDetail = async (req, res) => {
  try {
    userId = req.users.id;

    let findUser = await users.findOne({
      include: [
        {
          model: followRelation,
          as: "sourceUser",
          attributes: [],
        },
        {
          model: followRelation,
          as: "targetUser",
          distinct: true,
          attributes: [],
        },
        {
          model: feeds,
          as: "creator",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [Sequelize.literal("COUNT(DISTINCT(sourceUser.id))"), "following"],
          [Sequelize.literal("COUNT(DISTINCT(targetUser.id))"), "followers"],
          [Sequelize.literal("COUNT(DISTINCT(creator.id))"), "posts"],
        ],
        exclude: ["createdAt", "password", "updatedAt"],
      },
      where: {
        id: userId,
      },
    });

    findUser = JSON.parse(JSON.stringify(findUser));

    findUser = {
      ...findUser,
      image: process.env.FILE_PATH + findUser.image,
    };

    console.log("datanya : " + findUser);

    res.send({
      status: "success",
      data: findUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

// get another user detail
exports.peopleDetail = async (req, res) => {
  try {
    const userId = req.users.id;

    const { id } = req.params;

    console.log(userId);

    let findUser = await users.findOne({
      include: [
        {
          model: followRelation,
          as: "sourceUser",
          attributes: [],
        },
        {
          model: followRelation,
          as: "targetUser",
          distinct: true,
          attributes: [],
        },
        {
          model: feeds,
          as: "creator",
          attributes: [],
        },
      ],
      attributes: {
        include: [
          [Sequelize.literal("COUNT(DISTINCT(sourceUser.id))"), "following"],
          [Sequelize.literal("COUNT(DISTINCT(targetUser.id))"), "followers"],
          [Sequelize.literal("COUNT(DISTINCT(creator.id))"), "posts"],
        ],
        exclude: ["createdAt", "password", "updatedAt"],
      },
      where: {
        id: id,
      },
    });

    findUser = JSON.parse(JSON.stringify(findUser));

    findUser = {
      ...findUser,
      image: process.env.FILE_PATH + findUser.image,
    };

    console.log("data people : " + findUser);

    if (userId == id) {
      return res.send({
        status: "success",
        data: { users: findUser, ownprofile: "yes" },
      });
    } else {
      return res.send({
        status: "success",
        data: { users: findUser, ownprofile: "no" },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

// get users

exports.getUsers = async (req, res) => {
  try {
    const usersData = await users.findAll({
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      data: {
        users: usersData,
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.userAuth = async (req, res) => {
  try {
    const id = req.users.id;
    const uname = req.users.username;

    console.log("hasiil user id::" + id + uname);

    const dataUser = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "bio"],
      },
    });

    console.log(dataUser);

    if (!dataUser) {
      return res.status(404).send({
        status: "failed",
      });
    }

    res.send({
      status: "success",
      data: {
        user: {
          id: dataUser.id,
          fullname: dataUser.fullname,
          username: dataUser.username,
          email: dataUser.email,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
exports.updateUsers = async (req, res) => {
  try {
    userId = req.users.id;

    const editData = {
      fullname: req.body.fullname,
      username: req.body.username,
      image: req.file.filename,
      bio: req.body.bio,
    };

    const userData = await users.findOne({
      where: {
        id: userId,
      },
    });

    if (!userData) {
      return res.send({
        status: "failed",
        message: "user not found",
      });
    }
    await users.update(editData, {
      where: {
        id: userId,
      },
    });

    const updatedData = await users.findOne({
      where: {
        id: userId,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.send({
      status: "success",
      message: `update profile success`,
      data: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server error",
    });
  }
};

exports.deleteUsers = async (req, res) => {
  try {
    userId = req.users.id;

    const userData = await users.findOne({
      where: {
        id: userId,
      },
    });

    if (!userData) {
      return res.send({
        status: "failed",
        message: "user not found",
      });
    }
    // else if (userId != id) {
    //   return res.send({
    //     status: "failed",
    //     message: "wrong account",
    //   });
    // }

    await users.destroy({
      where: {
        id: userId,
      },
    });

    res.send({
      status: "success",
      message: `Delete user with id: ${userId} finished`,
    });
  } catch (error) {
    console.log(error);
    res.send({
      status: "failed",
      message: "Server Error",
    });
  }
};
