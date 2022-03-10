import React, { useState } from "react";

import { Container, Row, Col } from "react-bootstrap";

import { API } from "../../config/api";

import { useQuery, useMutation } from "react-query";

import Styles from "./UserProfile.module.css";

import Profile from "../../components/Profile/Profile";

import FeedCard from "../../components/FeedCard/FeedCard";

import FeedDet from "../../components/FeedDet/FeedDet";

import Navbar from "../../components/Navbar/Navbar";

import { useParams } from "react-router-dom";

import Masonry from "react-masonry-component";

export default function UserProfile() {
  let api = API();

  const { id } = useParams();

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
  let {
    data: people,
    isLoading: loadingaja,
    refetch: refetchProfile,
  } = useQuery("peopleCache", async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };

    const response = await api.get("/people/" + id, config);

    return response.data;
  });

  if (!loadingaja) {
    console.log(people.users);
  }

  const refetchProps = () => refetchProfile();

  //loading data for feeds
  let {
    isIdle,
    data: feedsPeople,
    isLoading: loadingFeeds,
    refetch,
  } = useQuery(
    ["peopleFeedsCache", id],
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      const response = await api.get("/people-feeds/" + id, config);

      return response.data;
    },
    {
      enabled: !!id,
    }
  );

  const refetchFeed = () => refetch();

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
              name={people.users.fullname}
              username={`@${people.users.username}`}
              img={people.users.image}
              about={people.users.bio}
              posts={people.users.posts}
              following={people.users.following}
              followers={people.users.followers}
              status={true}
              refetchProps={refetchProps}
              id={id}
            />
          )}
        </Col>
        <Col className={`${Styles.feedColumn} px-5`}>
          <Navbar />
          <h1>{!loadingaja && <b>{`${people.users.username} feeds`}</b>}</h1>
          <div className={`${Styles.feedList}`}>
            {(() => {
              if (!loadingFeeds && !isIdle) {
                if (feedsPeople.length == 0) {
                  return <div>ngga ada follow</div>;
                } else {
                  return (
                    <Masonry
                      options={masonryOptions}
                      className="gallery"
                      elementType={"ul"}
                    >
                      {feedsPeople.map((feed) => (
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
          </div>
        </Col>
      </Row>
      <FeedDet
        show={fdShow}
        close={closeFd}
        feedId={feedId}
        feedLikes={feedLikes}
        refetchFeed={refetchFeed}
      />
    </Container>
  );
}
