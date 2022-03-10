const { users, message } = require("../../models");

exports.inputMessage = async (req, res) => {
  try {
    userId = req.users.id;

    const { id } = req.params;

    console.log(id, userId);

    const messageBody = req.body.message;

    const findId = await users.findOne({
      where: {
        id,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "bio"],
      },
    });

    if (!findId) {
      return res.send({
        status: "failed",
        message: "no user found",
      });
    } else if (id == userId) {
      return res.send({
        status: "failed",
        message: "cannot send message for yourself",
      });
    }

    const sendingMessage = await message.create({
      message: messageBody,
      sourceId: userId,
      targetId: id,
    });

    res.status(200).send({
      status: "success",
      data: {
        id: userId,
        message: messageBody,
        user: findId,
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

exports.getAllMessage = async (req, res) => {
  try {
    userId = req.users.id;

    console.log(userId);

    const data = await message.findAll({
      include: {
        model: users,
        as: "sender",
        attributes: {
          exclude: ["bio", "createdAt", "updatedAt", "password"],
        },
      },
      where: {
        targetId: userId,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "targetId", "sourceId", "email"],
      },
    });

    res.status(200).send({
      status: "success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};
