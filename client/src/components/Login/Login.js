import React, { useState, useContext } from "react";

import { Link, useNavigate } from "react-router-dom";

import { Alert, Button, Form, Modal } from "react-bootstrap";

import { API } from "../../config/api";

import { useMutation } from "react-query";

import { UserContext } from "../../context/userContext";

import Styles from "./Login.module.css";

export default function Login(props) {
  const { show, close, subs } = props;

  let navigate = useNavigate();
  function handleClick() {
    navigate("/feed");
  }

  let api = API();

  const [state, dispatch] = useContext(UserContext);

  const [message, setMessage] = useState(null);

  // store data from form

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const { email, password } = form;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // Create function for handle login process with useMutation here ...
  const handleSubmit = useMutation(async (e) => {
    try {
      e.preventDefault();

      // Data body
      const body = JSON.stringify(form);

      // Configuration Content-type
      const config = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      };

      // Insert data user to database
      const response = await api.post("/login", config);

      console.log(response);

      // Notification
      if (response.status == "success") {
        dispatch({
          type: "LOGIN_SUCCESS",
          payload: response.data,
        });

        const alert = (
          <Alert variant="success" className="py-1">
            Success login
          </Alert>
        );
        setMessage(alert);
        setForm({
          email: "",
          password: "",
        });
      } else {
        const alert = (
          <Alert variant="danger" className="py-1">
            Failed to login
          </Alert>
        );
        setMessage(alert);
      }
    } catch (error) {
      const alert = (
        <Alert variant="danger" className="py-1">
          Failed
        </Alert>
      );
      setMessage(alert);
      console.log(error);
    }
  });

  function subtitute() {
    close();
    subs();
  }

  return (
    <>
      <Modal
        show={show}
        onHide={close}
        centered
        contentClassName={`${Styles.modalContent}`}
        dialogClassName={`${Styles.modalDialog}`}
      >
        <Modal.Body>
          <h1 className="mt-3 mb-4 mx-3">
            <b>Login</b>
          </h1>
          {message && message}
          <Form className="mt-5" onSubmit={(e) => handleSubmit.mutate(e)}>
            <Form.Group className="m-3">
              <Form.Control
                type="text"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <Form.Group className="m-3">
              <Form.Control
                type="password"
                placeholder="password"
                name="password"
                value={password}
                onChange={handleChange}
                className="bg-dark text-white"
              />
            </Form.Group>
            <div className="d-grid mx-3 my-4">
              <Button className={`${Styles.buttonLogin}`} type="submit">
                <b>Login</b>
              </Button>
            </div>
          </Form>
          <p className="text-center text-secondary">
            dont have account? click{" "}
            <button className={`${Styles.switch}`} onClick={subtitute}>
              <b>here</b>
            </button>
          </p>
        </Modal.Body>
      </Modal>
    </>
  );
}
