import React, { useState, useContext, useEffect } from "react";

import { UserContext } from "../../context/userContext";

import { Row, Col, Button } from "react-bootstrap";

import Styles from "./Profile.module.css";

import { Link, useNavigate, useParams } from "react-router-dom";

import { useQuery, useMutation } from "react-query";

import { API } from "../../config/api";

export default function Profile(props) {
  let navigate = useNavigate();
  function feedNav() {
    navigate("/feed");
  }

  function exploreNav() {
    navigate("/explore");
  }

  function editNav() {
    navigate("/edit");
  }

  function myFeedNav() {
    navigate("/my-feed");
  }

  let api = API();
  const {
    name,
    username,
    img,
    about,
    status,
    posts,
    followers,
    following,
    refetchProps,
    id,
  } = props;

  const [state, dispatch] = useContext(UserContext);
  // get follow status

  let {
    data: followStat,
    isLoading: statLoading,
    refetch,
    isIdle,
  } = useQuery(
    ["folStatCache", { id, status }],
    async () => {
      const config = {
        method: "GET",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
      };

      const response = await api.get("/follow-check/" + id, config);

      return response.status;
    },
    { enabled: status }
  );

  // follow process
  const followProcess = useMutation(async (id) => {
    try {
      let body = JSON.stringify(id);
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + localStorage.token,
        },
        body: body,
      };

      const response = await api.post("/follow", config);

      if (response.status == "success") {
        console.log(response.message);
        refetchProps();
        refetch();
      }
    } catch (error) {
      console.log(error);
    }
  });

  if (!isIdle && !statLoading) {
    console.log(followStat);
  }

  return (
    <div>
      <div className={`${Styles.mainBody} ms-3`}>
        <Link to="/feed">
          <div>
            <img src="/./images/dumbGram.png" alt="dumbgram" className="mt-3" />
          </div>
        </Link>
        <div className={`${Styles.bioData}`}>
          {!status && (
            <div className={`${Styles.editBut}`}>
              <button onClick={editNav}>
                <img src="/./icon/editing.png" alt="edit" />
              </button>
            </div>
          )}
          <div className={`${Styles.profileFull}`}>
            <div className={`${Styles.profilePict}`}>
              <img src={img} alt="pp" />
            </div>
            <b>{name}</b>
            <p>{username}</p>
          </div>
          {(() => {
            if (!statLoading && status) {
              return (
                <div className={`${Styles.followMessage}`}>
                  <Button className={`${Styles.buttonMessage}`}>message</Button>
                  {followStat == "following" ? (
                    <Button
                      className={`${Styles.buttonUnFollow}`}
                      onClick={() => {
                        followProcess.mutate({
                          id: id,
                        });
                      }}
                    >
                      <b>unfollow</b>
                    </Button>
                  ) : (
                    <Button
                      className={`${Styles.buttonFollow}`}
                      onClick={() => {
                        followProcess.mutate({
                          id: id,
                        });
                      }}
                    >
                      <b>follow</b>
                    </Button>
                  )}
                </div>
              );
            }
          })()}
          <br />
          <Row>
            <Col style={{ cursor: "pointer" }} onClick={myFeedNav}>
              <div>
                <b>posts</b>
              </div>
              <div>{posts}</div>
            </Col>
            <Col className={`${Styles.lineCol}`}>
              <div>
                <b>Followers</b>
              </div>
              <div>{followers}</div>
            </Col>
            <Col>
              <div>
                <b>Following</b>
              </div>
              <div>{following}</div>
            </Col>
          </Row>
          <p className={`${Styles.biodetail} ms-4 mt-3`}>{about}</p>
        </div>
        <div className={`${Styles.navButton}`}>
          <button onClick={feedNav}>
            <img src="/./icon/home.png" alt="feed" />
            Feed
          </button>
          <button onClick={exploreNav}>
            <img src="/./icon/compass.png" alt="explore" />
            Explore
          </button>
        </div>
        <div className={`${Styles.logout}`}>
          <button onClick={() => dispatch({ type: "LOGOUT" })}>
            <img src="/./icon/exit.png" alt="logout" />
            logout
          </button>
        </div>
      </div>
    </div>
  );
}
