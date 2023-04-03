import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PaidIcon from "@mui/icons-material/Paid";
import ReceiptIcon from "@mui/icons-material/Receipt";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import ChartComp from "../../components/admin/ChartComp";
import SalesHistory from "../../components/admin/SalesHistory";
import Loading from "../../components/Loading";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

function Dashboard() {
  const [dataEarning, setDataEarning] = useState([]);
  const [summary, setSummary] = useState([]);
  const [percentage, setPercentage] = useState([]);

  const [IsLoad, setIsLoad] = useState(true);
  const [saleHist, setSaleHist] = useState([]);

  const myStyle = {
    marginTop: "12%",
    fontSize: "25px",
    fontWeight: 600,
  };

  const earningStyle = {
    marginTop: "7%",
    fontSize: "25px",
    fontWeight: 600,
  };

  useEffect(() => {
    (async function () {
      let myUser = await fetch(
        process.env.REACT_APP_BASE_URL + "/trans/dashboard",
        { method: "get", credentials: "include" }
      );
      let myRes = await myUser.json();
      if (myRes.ECode !== 20) {
        setDataEarning(myRes.earning.map((item) => item.totalEarning));
        setSaleHist(myRes.hist);
        setSummary(myRes.summary);
        setPercentage(myRes.percentage);
        setIsLoad(false);
      } else {
        alert(myRes.EMsg);
      }
    })();
  }, []);

  function calPercentage() {
    if (percentage > 0) {
      return (
        <div style={{ color: "green", fontSize: "15px" }}>
          <ArrowUpwardIcon style={{ fontSize: "15px", marginBottom: "2px" }} />
          <span>{percentage.toString()} %</span>
        </div>
      );
    } else if (percentage < 0) {
      return (
        <div style={{ color: "#ff1f2b", fontSize: "15px" }}>
          <ArrowDownwardIcon
            style={{ fontSize: "15px", marginBottom: "2px" }}
          />
          <span>{percentage.toString()} %</span>
        </div>
      );
    } else {
      return (
        <div style={{ fontSize: "15px" }}>
          ~<span>{percentage.toString()} %</span>
        </div>
      );
    }
  }

  return (
    <div
      style={{ height: "100%", width: "100%", padding: "3%", overflow: "auto" }}
    >
      {IsLoad ? (
        <Loading type={"spinningBubbles"} size={80} />
      ) : (
        <Container>
          <Row>
            <Col>
              <Card
                style={{
                  width: "22rem",
                  border: "none",
                  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                  transition: "0.3s",
                  background: "#f2f7ff",
                  borderLeft: "10px solid #bfd7fc",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <Row>
                      <Col>
                        <PaidIcon /> Earning{" "}
                      </Col>
                      <Col style={{ paddingLeft: "26%" }}>
                        {calPercentage()}
                        <small style={{ fontSize: "12px" }}>
                          (From Last year)
                        </small>
                      </Col>
                    </Row>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Text style={earningStyle}>
                    <span>Rp. {summary[0].total.toLocaleString("id-ID")}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  width: "22rem",
                  border: "none",
                  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                  transition: "0.3s",
                  background: "#f2f7ff",
                  borderLeft: "10px solid #bfd7fc",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <ReceiptIcon /> Product
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Text style={myStyle}>
                    <span>{summary[1].total.toLocaleString("id-ID")}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col>
              <Card
                style={{
                  width: "22rem",
                  border: "none",
                  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
                  transition: "0.3s",
                  background: "#f2f7ff",
                  borderLeft: "10px solid #bfd7fc",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <TableRestaurantIcon /> Table
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Text style={myStyle}>
                    <span>{summary[2].total.toLocaleString("id-ID")}</span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <Row style={{ marginTop: "8%" }}>
            <Col>
              <ChartComp earning={dataEarning} />
            </Col>
            <Col>
              <SalesHistory data={saleHist} />
            </Col>
          </Row>
        </Container>
      )}
    </div>
  );
}

export default Dashboard;
