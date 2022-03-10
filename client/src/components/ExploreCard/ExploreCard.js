import React from "react";

import Styles from "./ExploreCard.module.css";

export default function ExploreCard(props) {
  const { feed, showFeedById } = props;
  console.log(feed);

  return (
    <div className={`${Styles.mainCard}`}>
      <div className={`${Styles.imgWrap}`}>
        <img
          src={feed.filename}
          alt="gambar"
            onClick={() => showFeedById(feed.id, feed.likes)}
        />
      </div>
    </div>
  );
}
