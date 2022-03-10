import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { Container, Row, Col, Button, Form } from "react-bootstrap";

import { useMutation, useQuery } from "react-query";

import { API } from "../../config/api";

import Styles from "./CreatePost.module.css";

import Profile from "../../components/Profile/Profile";

import Navbar from "../../components/Navbar/Navbar";

export default function CreatePost() {
  let api = API();

  let navigate = useNavigate();

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

  console.log(`lagi loadingkah ?: ${loadingaja}`);

  if (!loadingaja) {
    console.log(users);
  }

  const [preview, setPreview] = useState(null);

  const [form, setForm] = useState({
    filename: "",
    caption: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    if (e.target.type === "file") {
      let url = URL.createObjectURL(e.target.files[0]);
      setPreview(url);
    }
  };

  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      const formData = new FormData();

      formData.set("filename", form.filename[0], form.filename[0].name);
      formData.set("caption", form.caption);

      const config = {
        method: "POST",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
        body: formData,
      };

      const response = await api.post("/feed", config);

      console.log(response);

      navigate("/my-feed");
    } catch (err) {
      console.log(err);
    }
  });

  return (
    <Container fluid className={`${Styles.mainBody}`}>
      <Row className={`${Styles.row}`}>
        <Col className={`${Styles.profileColumn}`}>
          {loadingaja ? (
            <Profile
              name="loading"
              username="@loading"
              img="./profile/Lauren-Mayberry.jpg"
              about="vocalist of chvrches!!!"
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
        <Col className={`${Styles.inputField} px-5`}>
          <Navbar />
          <h1>
            <b>Create Post</b>
          </h1>
          <Form onSubmit={(e) => handleSubmit.mutate(e)}>
            {preview && (
              <div>
                <img
                  src={preview}
                  style={{
                    maxWidth: "150px",
                    maxHeight: "150px",
                    objectFit: "cover",
                  }}
                  alt="preview"
                />
              </div>
            )}
            <Button className={`${Styles.buttonGradient} mt-5`}>
              <input
                type="file"
                id="upload"
                name="filename"
                hidden
                onChange={handleChange}
              />
              <label htmlFor="upload">
                <b>Upload videos or Photos</b>
              </label>
            </Button>
            <Form.Group className="mt-3 mb-5">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="caption"
                name="caption"
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <Button
              className={`${Styles.buttonGradient} mt-3 float-end`}
              type="submit"
            >
              <b>Upload</b>
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
