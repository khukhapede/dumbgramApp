import React, { useState, useEffect } from "react";

import { Container, Row, Col, Alert, Form, Modal } from "react-bootstrap";

import { useQuery, useMutation } from "react-query";

import Styles from "./FeedDet.module.css";

import { useNavigate } from "react-router-dom";
import { API } from "../../config/api";

export default function FeedDet(props) {
  let api = API();
  let navigate = useNavigate();

  const { show, close, feedId, feedLikes, refetchFeed } = props;

  const [enabled, setEnabled] = useState(show);

  console.log(feedId);

  useEffect(() => {
    console.log("Component feedDet was mounted.");
  }, []);
  //process for get feed data

  let {
    isIdle,
    data: feedData,
    isLoading,
    refetch,
  } = useQuery(
    ["feedDataCache", { feedId, show }],
    async () => {
      const config = {
        method: "GET",
      };
      console.log("/feed-detail/" + feedId);
      const response = await api.get("/feed-detail/" + feedId, config);

      return response.data;
    },
    { enabled: show }
  );

  const [id, setId] = useState();
  useEffect(() => {
    // check whether data exists
    if (!isLoading && !!feedData) {
      setEnabled(false);
      setId(feedData.id);
    }
  }, [feedData, isLoading]);

  console.log(`apakah loading data : ${isLoading} // ${isIdle}`);
  if (!isLoading && !isIdle) {
    console.log(feedData);
  }

  console.log(`id setelah fetching ${id}`);

  //process for add comment
  const [message, setMessage] = useState(null);
  const [form, setForm] = useState({
    feedId: "",
    comment: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      feedId: id,
      [e.target.name]: e.target.value,
    });
  };
  console.log(form.feedId);

  const kirimComment = useMutation(async (e) => {
    try {
      e.preventDefault();

      const body = JSON.stringify(form);
      console.log(body);

      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + localStorage.token,
        },
        body: body,
      };

      const response = await api.post("/comment", config);

      console.log(response);

      // Notification
      if (response.status == "success") {
        const alert = (
          <Alert variant="success" className="py-1">
            Success
          </Alert>
        );
        setMessage(alert);
        setForm({
          feedId: "",
          comment: "",
        });
        console.log("success submit");
        refetch();
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            {response.message}
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed after catch
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  });

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

  function peopleNav() {
    navigate("/people/" + feedData.creator.id);
  }

  function commentNav() {
    navigate("/people/" + feedData.commentId.coomentator.id);
  }

  return (
    <>
      <Modal
        // size="sm"
        show={show}
        onHide={close}
        centered
        // className={`${Styles.modal}`}
        contentClassName={`${Styles.modalContent}`}
        dialogClassName={`${Styles.modalDialog}`}
      >
        <Modal.Body>
          {(() => {
            if (!isIdle) {
              if (isLoading) {
                return <div>lagi loading</div>;
              } else {
                return (
                  <Container fluid className={`${Styles.mainBody}`}>
                    <Row>
                      <Col className={`${Styles.imageColumn}`}>
                        <img src={feedData.filename} alt="gambar" />
                      </Col>
                      <Col className={`${Styles.commentColumn}`}>
                        <p className={`${Styles.closeButton}`} onClick={close}>
                          <b>X</b>
                        </p>
                        <div className={`${Styles.postCaption}`}>
                          <img src={feedData.creator.image} alt="gambar" />
                          <div className={`${Styles.commentText}`}>
                            <div>
                              <b
                                style={{ cursor: "pointer" }}
                                onClick={peopleNav}
                              >
                                {feedData.creator.username}
                              </b>
                            </div>
                            <div>{feedData.caption}</div>
                          </div>
                        </div>
                        <div className={`${Styles.postComments}`}>
                          {feedData.commentId.map((comments) => (
                            <div key={comments.id}>
                              <div className={`${Styles.commList}`}>
                                <img
                                  src={comments.commentator.image}
                                  alt="gambar"
                                />
                                <div className={`${Styles.commentText}`}>
                                  <div>
                                    <b
                                      style={{ cursor: "pointer" }}
                                      onClick={() => {
                                        navigate(
                                          "/people/" + comments.commentator.id
                                        );
                                      }}
                                    >
                                      {comments.commentator.username}
                                    </b>
                                  </div>
                                  <div>{comments.comment}</div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className={`${Styles.commentInput}`}>
                          <div className={`${Styles.commentButtons}`}>
                            <button
                              onClick={() => {
                                likesInsert.mutate({
                                  id: id,
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
                          <p>{`${feedLikes} likes`}</p>
                          <div>
                            <Form onSubmit={(e) => kirimComment.mutate(e)}>
                              <Form.Group>
                                <Form.Control
                                  type="text"
                                  placeholder="Comment..."
                                  name="comment"
                                  value={form.comment}
                                  onChange={handleChange}
                                  size="sm"
                                  autoComplete="off"
                                  className={`${Styles.commentBox} bg-dark text-white`}
                                />
                              </Form.Group>
                            </Form>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Container>
                );
              }
            }
          })()}
        </Modal.Body>
      </Modal>
    </>
  );
}
