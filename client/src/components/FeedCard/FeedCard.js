import React from "react";

import { useMutation } from "react-query";

import { API } from "../../config/api";

import Styles from "./FeedCard.module.css";

export default function FeedCard(props) {
  const { feed, showFeedById, refetchFeed } = props;
  console.log(feed);

  let api = API();

  // insert like
  const likesInsert = useMutation(async (likeData) => {
    try {
      let body = JSON.stringify(likeData);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + localStorage.token,
        },
        body: body,
      };

      const response = await api.post("/like", config);

      if (response.status == "success") {
        console.log("data like berhasil dikirim");
        refetchFeed();
      }
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <div className={`${Styles.mainCard}`}>
      <div className={`${Styles.imgWrap}`}>
        <img
          src={feed.filename}
          alt="gambar"
          onClick={() => showFeedById(feed.id, feed.likes)}
        />
      </div>
      <div className={`${Styles.feedProf}`}>
        <div className={`${Styles.profileDet}`}>
          <img src={feed.creator.image} alt="pp" />
          <b>{feed.creator.username}</b>
        </div>
        <div className={`${Styles.commentButtons}`}>
          <button
            onClick={() => {
              likesInsert.mutate({
                id: feed.id,
              });
            }}
          >
            <img src="/./icon/like.png" alt="like" />
          </button>
          <button>
            <img src="/./icon/comment.png" alt="comment" />
          </button>
          <button>
            <img src="/./icon/send.png" alt="send" />
          </button>
        </div>
      </div>
      <div className={`${Styles.likeCount}`}>{`${feed.likes} likes`}</div>
    </div>
  );
}
