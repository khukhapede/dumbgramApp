import React from "react";

import { Container, Grid, Row, Col, Button, Form } from "react-bootstrap";

import Styles from "./Message.module.css";

import Profile from "../../components/Profile/Profile";

import Navbar from "../../components/Navbar/Navbar";

import { Link } from "react-router-dom";

export default function Message() {
  return (
    <Container fluid className={`${Styles.mainBody}`}>
      <Row className={`${Styles.row}`}>
        <Col className={`${Styles.chatList}`}>
          <div>
            chat
          </div>
        </Col>
        <Col className={`${Styles.inputField} px-5`}>
          <Navbar />
          <div className={`${Styles.chatBody}`}>
            <div className={`${Styles.chatText}`}>
              <img src="./profile/russel.jpg" alt="cp" />
              <div className={`${Styles.chatMessage}`}> halo apa kabar</div>
            </div>
            <div>
              <Form>
                <Form.Control
                  type="text"
                  placeholder="Send Message"
                  className="bg-dark text-white my-3"
                />
              </Form>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
