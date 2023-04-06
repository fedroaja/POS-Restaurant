import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Loading from "../Loading";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

function ModalComponent(props) {
  const [isLoad, setLoad] = useState(true);

  function modalBody() {
    switch (props.modalProps[0].fgModal) {
      case "table":
        {
          return (
            <Modal.Body>
              <Row>
                <Col xs={12} md={4}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#0068f3",
                        width: "40px",
                        height: "20px",
                        borderRadius: "10px",
                        display: "inline-block",
                      }}
                    ></span>
                    <span style={{ marginLeft: "5px" }}>Available</span>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#ff3131",
                        width: "40px",
                        height: "20px",
                        borderRadius: "10px",
                        display: "inline-block",
                      }}
                    ></span>
                    <span style={{ marginLeft: "5px" }}>Not Available</span>
                  </div>
                </Col>
                <Col xs={12} md={4}>
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#717171",
                        width: "40px",
                        height: "20px",
                        borderRadius: "10px",
                        display: "inline-block",
                      }}
                    ></span>
                    <span style={{ marginLeft: "5px" }}>Disabled</span>
                  </div>
                </Col>
              </Row>
              <Row style={{ marginTop: "10px" }}>
                {props.dataTable.map((x, idx) => {
                  return (
                    <Col
                      key={idx}
                      xs={6}
                      md={3}
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: x.color,
                        width: "80px",
                        height: "80px",
                        fontSize: "14px",
                        borderRadius: "15px",
                        margin: "10px",
                        cursor: "pointer",
                        color: "white",
                      }}
                      onClick={(e) => {
                        if (x.fgStatus != "A" || x.fgActive == "N") {
                          return;
                        }
                        let selected = [
                          {
                            table_id: x.table_id,
                            table_name: x.table_name,
                          },
                        ];
                        props.setSelectedTable(selected);
                        props.onHide(false);
                      }}
                    >
                      {x.table_name}
                    </Col>
                  );
                })}
              </Row>
            </Modal.Body>
          );
        }
        break;
      default:
        break;
    }
  }

  return (
    <div>
      <Modal
        show={props.show}
        onHide={props.onHide}
        title={props.modalProps[0].title}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <Row>
              <Col xs={12} md={12}>
                {props.modalProps[0].title}
              </Col>
            </Row>
          </Modal.Title>
        </Modal.Header>
        {modalBody()}
      </Modal>
    </div>
  );
}

export default ModalComponent;
