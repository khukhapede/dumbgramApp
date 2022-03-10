import React, { useEffect, useState } from "react";

import { Container, Grid, Row, Col, Button, Form } from "react-bootstrap";

import { useMutation, useQuery } from "react-query";

import { useNavigate } from "react-router-dom";

import { API } from "../../config/api";

import Styles from "./EditProfile.module.css";

import Profile from "../../components/Profile/Profile";

import Navbar from "../../components/Navbar/Navbar";

export default function EditProfile() {
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

  const [userData, setUserData] = useState({});

  const [form, setForm] = useState({
    image: "",
    bio: "",
    fullname: "",
    username: "",
  });

  let { userRefetch } = useQuery("refetchCache", async () => {
    const config = {
      headers: {
        Authorization: "Basic " + localStorage.token,
      },
    };

    const response = await api.get("/user-login", config);
    setForm({
      image: response.data.image,
      bio: response.data.bio,
      fullname: response.data.fullname,
      username: response.data.username,
    });
    setUserData(response.data);
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.type === "file" ? e.target.files : e.target.value,
    });

    // Create image url for preview
    if (e.target.type === "file") {
      setPreview(e.target.files);
    }
  };

  // Create function for handle insert new product data with useMutation here ...
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Store data with FormData as object
      const formData = new FormData();
      if (preview) {
        formData.set("image", preview[0], preview[0]?.name);
      }
      formData.set("fullname", form.fullname);
      formData.set("username", form.username);
      formData.set("bio", form.bio);

      // Configuration
      const config = {
        method: "PATCH",
        headers: {
          Authorization: "Basic " + localStorage.token,
        },
        body: formData,
      };

      // Insert product data
      const response = await api.patch("/user", config);

      console.log(response);

      navigate("/feed");
    } catch (error) {
      console.log(error);
    }
  });

  return (
    <Container fluid className={`${Styles.mainBody}`}>
      <Row>
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
            <b>Edit Profile</b>
          </h1>
          <Form onSubmit={(e) => handleSubmit.mutate(e)}>
            {!preview ? (
              <div>
                <img
                  src={form.image}
                  style={{
                    maxWidth: "75px",
                    maxHeight: "75px",
                    objectFit: "cover",
                  }}
                  alt="recent"
                />
              </div>
            ) : (
              <div>
                <img
                  src={URL.createObjectURL(preview[0])}
                  style={{
                    maxWidth: "75px",
                    maxHeight: "75px",
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
                name="image"
                hidden
                onChange={handleChange}
              />
              <label htmlFor="upload">
                <b>Upload Photos</b>
              </label>
            </Button>
            <Form.Group className="my-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="name"
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Control
                type="text"
                placeholder="username"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="mt-3 mb-5">
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="bio"
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <Button
              className={`${Styles.buttonGradient} mt-3 float-end px-5`}
              type="submit"
            >
              <b>Save</b>
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
