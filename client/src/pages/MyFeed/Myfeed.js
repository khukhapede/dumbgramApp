import React, { useState, useEffect } from "react";

import { API } from "../../config/api";

import { useQuery } from "react-query";

import { Container, Row, Col } from "react-bootstrap";

import Styles from "./MyFeed.module.css";

import Profile from "../../components/Profile/Profile";

import FeedCard from "../../components/FeedCard/FeedCard";

import FeedDet from "../../components/FeedDet/FeedDet";

import Navbar from "../../components/Navbar/Navbar";

import Masonry from "react-masonry-component";

export default function MyFeed() {
  let api = API();

  const [fdShow, setFdShow] = useState(false);
  const [feedId, setFeedId] = useState(null);
  const [feedLikes, setFeedLikes] = useState(null);

  const openFd = () => setFdShow(true);
  const closeFd = () => setFdShow(false);

  function showFeedById(id, likes) {
    openFd();
    setFeedId(id);
    setFeedLikes(likes);
  }

  const masonryOptions = {
    fitWidth: true,
  };

  //get data for user
  let { data: users, isLoading: loadingaja } = useQuery(
    "usersCache",
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      const response = await api.get("/user-login", config);

      return response.data;
    }
  );

  if (!loadingaja) {
    console.log(users);
  }

  //loading data for feeds
  let {
    data: feedsFollow,
    isLoading: loadingFeeds,
    refetch,
  } = useQuery("myfeedsCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/my-feeds", config);

    return response.data;
  });

  const refetchFeed = () => refetch();

  console.log("feed lagi loading? : " + loadingFeeds);

  if (!loadingFeeds) {
    console.log(feedsFollow);
  }

  return (
    <Container fluid className={`${Styles.mainBody}`}>
      <Row className={`${Styles.row}`}>
        <Col className={`${Styles.profileColumn}`}>
          {loadingaja ? (
            <Profile
              name="loading"
              username="@loading"
              img="./profile/loading.png"
              about="loading"
            />
          ) : (
            <Profile
              name={users.fullname}
              username={`@${users.username}`}
              img={users.image}
              about={users.bio}
              posts={users.posts}
              following={users.following}
              followers={users.followers}
            />
          )}
        </Col>
        <Col className={`${Styles.feedColumn} px-3`}>
          <Navbar />
          <h1>
            <b>My Feeds</b>
          </h1>
          <div className={`${Styles.feedList}`}>
            {(() => {
              if (!loadingFeeds) {
                if (feedsFollow.length == 0) {
                  return <div>ngga ada follow</div>;
                } else {
                  return (
                    <Masonry
                      options={masonryOptions}
                      className="gallery"
                      elementType={"ul"}
                    >
                      {feedsFollow.map((feed) => (
                        <li key={feed.id}>
                          <FeedCard
                            feed={feed}
                            showFeedById={showFeedById}
                            refetchFeed={refetchFeed}
                          />
                        </li>
                      ))}
                    </Masonry>
                  );
                }
              }
            })()}
            <FeedDet
              show={fdShow}
              close={closeFd}
              feedId={feedId}
              feedLikes={feedLikes}
              refetchFeed={refetchFeed}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
