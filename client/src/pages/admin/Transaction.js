import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Loading from "../../components/Loading";
import TableComp from "../../components/admin/TableComp";
import ModalComp from "../../components/admin/ModalComp";
import Button from "react-bootstrap/Button";

function Transaction() {
  const [isLoad, setIsLoad] = useState(false);
  const [data, setData] = useState([]);
  const [dataDetail, setDataDetail] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [modalProps, setModalProps] = useState([
    {
      title: "",
      fgMode: "",
      fgModal: "",
    },
  ]);
  const [columns, setColumns] = useState([
    {
      name: "Invoice Code",
      selector: (row) => row.invoice_code,
      sortable: true,
      filterable: false,
    },
    {
      name: "Table Name",
      selector: (row) => row.table_name,
      sortable: true,
      filterable: false,
    },
    {
      name: "Update Date",
      selector: (row) => row.upddate,
      sortable: true,
      filterable: false,
    },
    {
      name: "status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => <span>{getStatus(row.status)}</span>,
    },
    {
      name: "Detail",
      selector: (row) => row.invoice_id,
      cell: (row) => (
        <Button
          onClick={() => {
            setModalProps([
              {
                title: "Invoice",
                fgMode: "D",
                fgModal: "transaction",
              },
            ]);

            setSelectedRow(row);
            setModalShow(true);
          }}
          size="sm"
          variant="primary"
        >
          Detail
        </Button>
      ),
    },
  ]);

  useEffect(() => {
    (async function () {
      let myUser = await fetch(
        process.env.REACT_APP_BASE_URL + "/trans/transaction",
        { method: "get", credentials: "include" }
      );
      let myRes = await myUser.json();
      if (myRes.ECode !== 20) {
        setData(myRes.invoice);
        setDataDetail(myRes.invoiceDt);
        setIsLoad(false);
      } else {
        alert(myRes.EMsg);
      }
    })();
  }, []);

  function HandleFilter(e) {
    e.preventDefault();
    const cpData = [...columns].map((x, idx) => {
      x.filterable = !x.filterable;
      return x;
    });

    setColumns(cpData);
  }

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
          width: "70px",
          height: "21px",
          textAlign: "center",
          color: "white",
        }}
      >
        {status}
      </div>
    );
  }

  return (
    <div
      style={{ height: "100%", width: "100%", padding: "3%", overflow: "auto" }}
    >
      {isLoad ? (
        <Loading type={"spinningBubbles"} size={80} />
      ) : (
        <div>
          <Container>
            <Row>
              <Col>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#ffa206",
                      width: "40px",
                      height: "20px",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  ></span>
                  <span style={{ marginLeft: "5px" }}>Process</span>
                </div>
              </Col>
              <Col>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#00d636",
                      width: "40px",
                      height: "20px",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  ></span>
                  <span style={{ marginLeft: "5px" }}>Accepted</span>
                </div>
              </Col>
              <Col>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#ff0404",
                      width: "40px",
                      height: "20px",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  ></span>
                  <span style={{ marginLeft: "5px" }}>Rejected</span>
                </div>
              </Col>
              <Col>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      backgroundColor: "#0058ff",
                      width: "40px",
                      height: "20px",
                      borderRadius: "10px",
                      display: "inline-block",
                    }}
                  ></span>
                  <span style={{ marginLeft: "5px" }}>Done</span>
                </div>
              </Col>
              <Col></Col>
              <Col></Col>
              <Col></Col>
              <Col></Col>
            </Row>
            <Row>
              <Col>
                <TableComp
                  col={columns}
                  data={data}
                  setData={setData}
                  fgTable={"transaction"}
                  setDataEdit={setDataDetail}
                  setModalProps={setModalProps}
                  setModalShow={setModalShow}
                ></TableComp>
              </Col>
            </Row>
          </Container>

          <ModalComp
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalProps={modalProps}
            dataDetail={dataDetail.filter((x) => {
              return x.invoice_id === selectedRow.invoice_id;
            })}
            selectedRow={selectedRow}
          />
        </div>
      )}
    </div>
  );
}

export default Transaction;
