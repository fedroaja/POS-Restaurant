import React, { useCallback, useEffect, useRef, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import DoneIcon from "@mui/icons-material/Done";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RestaurantIcon from "@mui/icons-material/Restaurant";

function Orderlist(props) {
  const [time, setTime] = useState(0);

  const startDate = new Date(props.data.upddate);
  const endDate = new Date(
    startDate.getTime() + 1000 * 60 * props.data.delivery_time
  ); // + 10 seconds
  const range = endDate - startDate;

  useEffect(() => {
    if (props.data.fgStatus == "A") {
      const myTimer = setInterval(() => {
        let diff = Math.max(0, endDate - new Date());
        let percen = 100 - (100 * diff) / range;
        setTime(parseInt(percen));
        console.log(percen);

        if (diff <= 0) {
          clearInterval(myTimer);
        }
      }, 1000);
      return () => clearInterval(myTimer);
    }
  });

  function getStatus(code) {
    let status = "";
    let bgColor = "white";
    switch (code) {
      case "P":
        status = "Process";
        bgColor = "#ffa206";
        break;
      case "A":
        status = "Approved";
        bgColor = "#00d636";
        break;
      case "R":
        status = "Rejected";
        bgColor = "#ff0404";
        break;
      case "O":
        status = "Ready";
        bgColor = "purple";
        break;
      case "D":
        status = "Done";
        bgColor = "#0058ff";
        break;
      default:
        break;
    }
    return (
      <div
        style={{
          backgroundColor: bgColor,
          borderRadius: "10px",
          width: "50px",
          height: "15px",
          textAlign: "center",
          color: "white",
          fontSize: "9px",
        }}
      >
        {status}
      </div>
    );
  }

  async function updateOrder(status) {
    let updateStatus = await fetch(
      process.env.REACT_APP_BASE_URL + "/cashier/updateorder",
      {
        method: "post",
        body: JSON.stringify({
          status: status,
          invoice_id: props.data.invoice_id,
          table_code: props.data.table_code,
        }),
        headers: {
          "Content-type": "application/json;charset=UTF-8",
        },
        credentials: "include",
      }
    );
    let myRes = await updateStatus.json();

    if (myRes.ECode !== 0) {
      alert(myRes.EMsg);
      return;
    }
    props.setDataWaitingList(myRes.invoice);
  }

  function getIcon(status) {
    switch (status) {
      case "P":
        return <ThumbsUpDownIcon />;
      case "A":
        return <HourglassEmptyIcon />;
      case "O":
        return <RestaurantIcon />;
    }
  }

  useEffect(() => {
    if (time != 100) return;
    updateOrder("O");
  }, [time]);

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
              <span
                style={{
                  borderRadius: "10px",
                  marginRight: "8px",
                  width: "45px",
                  height: "45px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  fontSize: "20px",
                  color: "white",
                  background: "#674188",
                }}
              >
                {getIcon(props.data.fgStatus)}
              </span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                {props.data.invoice_code}
                <br />
                {props.data.total_item} Items | {props.data.table_name}
              </span>
            </Col>
            <Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                  marginBottom: "3px",
                }}
              >
                {getStatus(props.data.fgStatus)}
              </Col>
              <Col
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "flex-end",
                }}
              >
                {props.data.fgStatus == "A" ? (
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
                      text={time < 0 ? "Waiting" : time}
                    />
                  </div>
                ) : (
                  ""
                )}
                {props.data.fgStatus === "O" ? (
                  <Button
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "27px",
                      width: "28px",
                      borderRadius: "15px",
                    }}
                    onClick={(e) => {
                      updateOrder("D");
                    }}
                  >
                    <DoneIcon sx={{ fontSize: 15 }} />
                  </Button>
                ) : (
                  ""
                )}
              </Col>
            </Col>
          </Row>
        </div>
      </Card>
    </div>
  );
}

export default Orderlist;
