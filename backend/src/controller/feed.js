const {
  users,
  feeds,
  followRelation,
  likes,
  comments,
} = require("../../models");

const Sequelize = require("sequelize");
const { json } = require("express/lib/response");
const { inputMessage } = require("./message");

exports.addFeed = async (req, res) => {
  try {
    userId = req.users.id;

    const caption = req.body.caption;
    const filename = req.file.filename;

    

    await feeds.create({
      caption,
      filename,
      userId,
    });

    const data = await feeds.findOne({
      where: {
        userId,
      },
      include: {
        model: users,
        as: "creator",
        attributes: {
          exclude: ["bio", "createdAt", "updatedAt", "password"],
        },
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "userId"],
      },
      order: [["id", "DESC"]],
    });

    res.send({
      status: "success",
      message: "test multer success",
      data: data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getFeedByFollow = async (req, res) => {
  try {
    userId = req.users.id;

    const getFollowing = await followRelation.findAll({
      attributes: ["targetId"],
      where: {
        sourceId: userId,
      },
      raw: true,
    });

    let followingId = getFollowing.map((a) => a.targetId);

    let findFeed = await feeds.findAll({
      include: [
        {
          model: likes,
          as: "postId",
          attributes: [],
        },
        {
          model: users,
          as: "creator",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email"],
          },
        },
      ],
      attributes: {
        include: [[Sequelize.fn("COUNT", Sequelize.col("postId.id")), "likes"]],
        exclude: ["userId", "createdAt", "updatedAt"],
      },
      where: {
        userId: followingId,
      },
      required: false,
      group: ["feeds.id"],
    });

    findFeed = JSON.parse(JSON.stringify(findFeed));

    findFeed = findFeed.map((feed) => {
      return {
        ...feed,
        filename: process.env.FILE_PATH + feed.filename,
        creator: {
          ...feed.creator,
          image: process.env.FILE_PATH + feed.creator.image,
        },
      };
    });

    res.send({
      status: "success",
      data: findFeed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.peopleFeeds = async (req, res) => {
  try {
    const userId = req.users.id;

    const { id } = req.params;

    let findFeed = await feeds.findAll({
      include: [
        {
          model: likes,
          as: "postId",
          attributes: [],
        },
        {
          model: users,
          as: "creator",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email"],
          },
        },
      ],
      attributes: {
        include: [[Sequelize.literal("COUNT(DISTINCT(postId.id))"), "likes"]],
        exclude: ["userId", "createdAt", "updatedAt"],
      },
      where: {
        userId: id,
      },
      required: false,
      group: ["feeds.id"],
    });

    findFeed = JSON.parse(JSON.stringify(findFeed));

    findFeed = findFeed.map((feed) => {
      return {
        ...feed,
        filename: process.env.FILE_PATH + feed.filename,
        creator: {
          ...feed.creator,
          image: process.env.FILE_PATH + feed.creator.image,
        },
      };
    });

    res.send({
      status: "success",
      data: findFeed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.myFeeds = async (req, res) => {
  try {
    const userId = req.users.id;

    let findFeed = await feeds.findAll({
      include: [
        {
          model: likes,
          as: "postId",
          attributes: [],
        },
        {
          model: users,
          as: "creator",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email"],
          },
        },
      ],
      attributes: {
        include: [[Sequelize.literal("COUNT(DISTINCT(postId.id))"), "likes"]],
        exclude: ["userId", "createdAt", "updatedAt"],
      },
      where: {
        userId: userId,
      },
      required: false,
      group: ["feeds.id"],
    });

    findFeed = JSON.parse(JSON.stringify(findFeed));

    findFeed = findFeed.map((feed) => {
      return {
        ...feed,
        filename: process.env.FILE_PATH + feed.filename,
        creator: {
          ...feed.creator,
          image: process.env.FILE_PATH + feed.creator.image,
        },
      };
    });

    res.send({
      status: "success",
      data: findFeed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getFeedDetail = async (req, res) => {
  try {
    const feedid = req.params.id;

    let findFeedData = await feeds.findOne({
      include: [
        {
          model: users,
          as: "creator",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email", "bio"],
          },
        },
        {
          model: comments,
          as: "commentId",
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: {
            model: users,
            as: "commentator",
            attributes: {
              exclude: ["createdAt", "updatedAt", "password", "email", "bio"],
            },
          },
        },
      ],
      where: {
        id: feedid,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt", "password", "email", "bio"],
      },
      required: false,
    });

    findFeedData = JSON.parse(JSON.stringify(findFeedData));

    findFeedData = {
      ...findFeedData,
      filename: process.env.FILE_PATH + findFeedData.filename,
      creator: {
        ...findFeedData.creator,
        image: process.env.FILE_PATH + findFeedData.creator.image,
      },
    };

    findFeedData.commentId = findFeedData.commentId.map((comment) => {
      return {
        ...comment,
        commentator: {
          ...comment.commentator,
          image: process.env.FILE_PATH + comment.commentator.image,
        },
      };
    });

    res.send({
      status: "success",
      data: findFeedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getAllFeeds = async (req, res) => {
  try {
    const findId = await feeds.findAll({
      attributes: ["id"],
      order: Sequelize.literal("rand()"),
      limit: 10,
      raw: true,
    });

    let randomId = findId.map((a) => a.id);

    let findFeed = await feeds.findAll({
      include: [
        {
          model: likes,
          as: "postId",
          attributes: [],
        },
        {
          model: users,
          as: "creator",
          attributes: {
            exclude: ["createdAt", "updatedAt", "password", "email"],
          },
        },
      ],
      attributes: {
        include: [[Sequelize.literal("COUNT(DISTINCT(postId.id))"), "likes"]],
        exclude: ["userId", "createdAt", "updatedAt"],
      },
      group: ["feeds.id"],
      order: Sequelize.literal("rand()"),
      where: {
        id: randomId,
      },
    });

    findFeed = JSON.parse(JSON.stringify(findFeed));

    findFeed = findFeed.map((feed) => {
      return {
        ...feed,
        filename: process.env.FILE_PATH + feed.filename,
        creator: {
          ...feed.creator,
          image: process.env.FILE_PATH + feed.creator.image,
        },
      };
    });

    res.send({
      status: "success",
      data: findFeed,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.addLike = async (req, res) => {
  try {
    userId = req.users.id;

    const { id } = req.body;

    const findFeed = await feeds.findOne({
      where: {
        id,
      },
    });

    console.log(findFeed);

    const findDuplicate = await likes.findOne({
      where: {
        feedId: id,
        userId,
      },
    });

    if (!findFeed) {
      return res.send({
        status: "failed",
        message: `feed: ${id} not found`,
      });
    } else if (findDuplicate) {
      await likes.destroy({
        where: {
          feedId: id,
          userId,
        },
      });
    } else {
      await likes.create({
        feedId: id,
        userId,
      });
    }

    res.send({
      status: "success",
      data: {
        feed: {
          id,
        },
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

exports.addComments = async (req, res) => {
  try {
    userId = req.users.id;

    const { feedId, comment } = req.body;

    const checkFeed = await feeds.findOne({
      where: {
        id: feedId,
      },
    });

    if (!checkFeed) {
      return res.send({
        status: "failed",
        message: `feed: ${feedId} not found`,
      });
    }

    await comments.create({
      feedId,
      userId,
      comment,
    });

    const checkComments = await comments.findOne({
      attributes: ["id"],
      order: [["id", "DESC"]],
    });

    res.send({
      status: "success",
      data: checkComments,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    userId = req.users.id;

    const id = req.params.id;

    console.log(id);

    const findComment = await comments.findAll({
      include: {
        model: users,
        as: "commentator",
        attributes: {
          exclude: ["password", "email", "updatedAt", "createdAt"],
        },
      },
      attributes: ["id", "comment"],
      where: {
        feedId: id,
      },
    });

    res.send({
      status: "success",
      data: findComment,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "internal server error",
    });
  }
};
