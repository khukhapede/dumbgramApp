const { users, followRelation } = require("../../models");

const joi = require("joi");

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

exports.follow = async (req, res) => {
  try {
    const userId = req.users.id;

    const targetId = req.body.id;

    const findId = await users.findOne({
      where: {
        id: targetId,
      },
    });

    const findDuplicate = await followRelation.findOne({
      where: {
        sourceId: userId,
        targetId,
      },
    });

    if (!findId) {
      return res.send({
        status: "failed",
        message: "no user found",
      });
    } else if (userId === targetId) {
      return res.send({
        status: "failed",
        message: "cannot follow yourself",
      });
    } else if (findDuplicate) {
      await followRelation.destroy({
        where: {
          sourceId: userId,
          targetId,
        },
      });
      return res.send({
        status: "success",
        message: `${userId} unfollow ${targetId}`,
      });
    } else {
      await followRelation.create({
        sourceId: userId,
        targetId,
      });
      res.status(200).send({
        status: "success",
        message: `${userId} following ${targetId}`,
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

exports.checkFollow = async (req, res) => {
  try {
    const userId = req.users.id;

    const targetId = req.params.id;

    const findId = await users.findOne({
      where: {
        id: targetId,
      },
    });

    if (!findId) {
      return res.send({
        status: "failed",
        message: "user not found",
      });
    }

    const findDuplicate = await followRelation.findOne({
      where: {
        sourceId: userId,
        targetId,
      },
    });

    if (!findDuplicate) {
      return res.send({
        status: "notfollow",
      });
    } else {
      return res.send({
        status: "following",
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

exports.followers = async (req, res) => {
  try {
    const { id } = req.params;

    const findFollowersId = await followRelation.findAll({
      where: {
        sourceId: id,
      },
      attributes: ["targetId"],
      raw: true,
    });

    console.log(findFollowersId);

    let arrTarget = findFollowersId.map((a) => a.targetId);

    console.log(arrTarget);

    const findFollowers = await users.findAll({
      where: {
        id: arrTarget,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      message: "console log ongoing",
      data: {
        followers: findFollowers,
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

exports.following = async (req, res) => {
  try {
    const { id } = req.params;

    const findFollowingId = await followRelation.findAll({
      where: {
        targetId: id,
      },
      attributes: ["sourceId"],
      raw: true,
    });

    console.log(findFollowingId);

    let arrSource = findFollowingId.map((a) => a.sourceId);

    console.log(arrSource);

    const findFollowing = await users.findAll({
      where: {
        id: arrSource,
      },
      attributes: {
        exclude: ["password", "createdAt", "updatedAt"],
      },
    });

    res.status(200).send({
      status: "success",
      message: "fetching following success",
      data: {
        followers: findFollowing,
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
