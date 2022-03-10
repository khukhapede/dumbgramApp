import React, { useState } from "react";

import { Container, Grid, Row, Col, Button } from "react-bootstrap";

import Styles from "./Landing.module.css";

import Login from "../../components/Login/Login";

import Register from "../../components/Register/Register";

export default function Landing() {
  const [rgShow, setRgShow] = useState(false);
  const openRg = () => setRgShow(true);
  const closeRg = () => setRgShow(false);

  const [lgShow, setLgShow] = useState(false);
  const openLg = () => setLgShow(true);
  const closeLg = () => setLgShow(false);

  return (
    <Container fluid className={`${Styles.mainBody}`}>
      <Row>
        <Login show={lgShow} close={closeLg} subs={openRg} />
        <Register show={rgShow} close={closeRg} subs={openLg} />
        <Col className={`${Styles.firstColumn}`}>
          <Row className="mt-3">
            <img src="./images/dumbGram.png" alt="" />
          </Row>
          <Row className="mt-3">
            <h1>
              <b>share your best photo and videos</b>
            </h1>
          </Row>
          <Row className="mt-2 me-5">
            <p>
              Join now, share your creations with another people and enjoy other
              creations.
            </p>
          </Row>
          <Row className="my-5">
            <Col md="auto">
              <Button className={`${Styles.buttonLogin}`} onClick={openLg}>
                login
              </Button>
            </Col>
            <Col md="auto">
              <Button className={`${Styles.buttonLogin}`} onClick={openRg}>
                Register
              </Button>
            </Col>
          </Row>
        </Col>
        <Col className={`${Styles.secondColumn}`}>
          <div className={`${Styles.photoGrid}`}>
            <img src="/./images/landingBlack.png" alt="grid" />
          </div>
        </Col>
      </Row>
    </Container>
  );
}
