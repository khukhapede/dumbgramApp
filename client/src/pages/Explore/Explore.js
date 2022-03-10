import React, { useState, useEffect } from "react";

import { API } from "../../config/api";

import { useQuery } from "react-query";

import { Container, Row, Col } from "react-bootstrap";

import Styles from "./Explore.module.css";

import Profile from "../../components/Profile/Profile";

import FeedDet from "../../components/FeedDet/FeedDet";

import Navbar from "../../components/Navbar/Navbar";

import Masonry from "react-masonry-component";

import ExploreCard from "../../components/ExploreCard/ExploreCard";

export default function Explore() {
  let api = API();

  const [fdShow, setFdShow] = useState(false);
  const [feedId, setFeedId] = useState(null);
  const [feedLikes, setFeedLikes] = useState(null);

  function showFeedById(id, likes) {
    openFd();
    setFeedId(id);
    setFeedLikes(likes);
  }

  const openFd = () => setFdShow(true);
  const closeFd = () => setFdShow(false);

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
    data: AllFeeds,
    isLoading: loadingFeeds,
    refetch,
  } = useQuery("feedsCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };
    const response = await api.get("/feeds", config);

    return response.data;
  });

  const refetchFeed = () => refetch();

  console.log("feed lagi loading? : " + loadingFeeds);

  if (!loadingFeeds) {
    console.log(AllFeeds);
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
          <h1><b>Explore</b></h1>
          <div className={`${Styles.feedList}`}>
            {(() => {
              if (!loadingFeeds) {
                return (
                  <Masonry
                    options={masonryOptions}
                    className="gallery"
                    elementType={"ul"}
                  >
                    {AllFeeds.map((feed) => (
                      <li key={feed.id}>
                        <ExploreCard feed={feed} showFeedById={showFeedById} />
                      </li>
                    ))}
                  </Masonry>
                );
              }
            })()}
            <FeedDet
              show={fdShow}
              close={closeFd}
              feedId={feedId}
              feedLikes={feedLikes}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
