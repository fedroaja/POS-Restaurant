import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";

function Orderlist(props) {
  const [time, setTime] = useState(0);

  const startDate = new Date();
  const endDate = new Date(startDate.getTime() + 1000 * 60 * props.data.time); // + 10 seconds
  const range = endDate - startDate;

  function updateCountdown() {
    const diff = Math.max(0, endDate - new Date());
    const percen = 100 - (100 * diff) / range;
    setTime(parseInt(percen));

    if (diff >= 0) {
      requestAnimationFrame(updateCountdown);
    }
  }

  useEffect(() => {
    updateCountdown();
  }, []);

  return (
    <div style={{ display: "inline-block", float: "none" }}>
      <Card
        style={{
          border: "none",
          boxShadow: "0 2px 4px 0 rgba(0,0,0,0.2)",
          background: "white",
          marginRight: "8px",
          marginLeft: "8px",
          width: "250px",
          borderLeft: "5px solid #674188",
        }}
      >
        <div style={{ display: "inline-block", padding: "5px" }}>
          <Row>
            <Col
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
              }}
            >
              <img
                width={"45px"}
                height={"45px"}
                style={{
                  borderRadius: "10px",
                  marginRight: "8px",
                }}
                src="https://img.kurio.network/rlKzeW_1_iLZ-JMm9fFHX-rGdIE=/1200x1200/filters:quality(80)/https://kurio-img.kurioapps.com/22/06/22/53264347-b7ba-4257-852d-04e3d1b4e4e5.jpe"
              ></img>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {props.data.invoice}
                <br />6 Items | Table 1
              </span>
            </Col>
            <Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    backgroundColor: "orange",
                    borderRadius: "10px",
                    width: "50px",
                    height: "15px",
                    textAlign: "center",
                    color: "white",
                    fontSize: "9px",
                  }}
                >
                  Process
                </div>
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "25px",
                    height: "25px",
                    display: time === 100 ? "none" : "",
                  }}
                >
                  <CircularProgressbar
                    value={time}
                    strokeWidth={15}
                    text={time}
                  />
                </div>
              </Col>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}

export default Orderlist;
