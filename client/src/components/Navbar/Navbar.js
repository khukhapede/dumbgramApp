import React, { useState } from "react";

import { Container, Grid, Row, Col, Button, Form } from "react-bootstrap";

import Styles from "./Navbar.module.css";

import { useNavigate } from "react-router-dom";

export default function Navbar() {
  let navigate = useNavigate();
  function createNav() {
    navigate("/create");
  }

  function messageNav() {
    navigate("/message");
  }
  return (
    <div className={`${Styles.navBody} my-3`}>
      <div className={`${Styles.search}`}>
        <Form>
          <Form.Control
            type="Search"
            placeholder="Search"
            className="bg-dark text-white"
          />
        </Form>
      </div>
      <div className={`${Styles.buttonList}`}>
        <button>
          <img src="/./icon/bell.png" alt="notif" />
        </button>
        <button onClick={messageNav}>
          <img src="/./icon/send.png" alt="send" />
        </button>
        <div className={`${Styles.buttonCreate}`}>
          <button onClick={createNav}>
            <b>create post</b>
          </button>
        </div>
      </div>
    </div>
  );
}
