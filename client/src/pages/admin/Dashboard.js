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

function Dashboard() {
  const [dataEarning, setDataEarning] = useState([]);
  const [summary, setSummary] = useState([]);

  const [IsLoad, setIsLoad] = useState(true);
  const [saleHist, setSaleHist] = useState([]);

  const myStyle = {
    marginTop: "22%",
    fontSize: "30px",
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
        setIsLoad(false);
      } else {
        alert(myRes.EMsg);
      }
    })();
  }, []);

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
                  background:
                    "linear-gradient(45deg, rgba(255,243,0,0.299124649859944) 0%, rgba(149,0,255,0.2234943977591037) 100%)",
                }}
              >
                <Card.Body>
                  <Card.Title>
                    <PaidIcon /> Earning <small>(This Year)</small>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted"></Card.Subtitle>
                  <Card.Text style={myStyle}>
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
                  background:
                    "linear-gradient(45deg, rgba(255,243,0,0.499124649859944) 0%, rgba(255,115,0,0.4234943977591037) 100%)",
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
                  background:
                    "linear-gradient(90deg, rgba(255,243,0,0.499124649859944) 0%, rgba(50,255,187,0.4234943977591037) 100%)",
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
