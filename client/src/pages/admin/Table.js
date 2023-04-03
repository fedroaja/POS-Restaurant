import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Loading from "../../components/Loading";
import Button from "react-bootstrap/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TableComp from "../../components/admin/TableComp";
import Form from "react-bootstrap/Form";
import ModalComp from "../../components/admin/ModalComp";

function Table() {
  const [isLoad, setIsLoad] = useState(true);
  const [data, setData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [modalProps, setModalProps] = useState([
    {
      title: "",
      fgMode: "",
      fgModal: "",
      modalShow: false,
    },
  ]);

  const [columns, setColumns] = useState([
    {
      name: "Table Code",
      selector: (row) => row.table_code,
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
      name: "Active",
      selector: (row) => row.active,
      cell: (row) => (
        <Form>
          <Form.Check
            disabled
            type="switch"
            checked={row.active === "Y"}
            id="custom-switch"
            label=""
            readOnly
          />
        </Form>
      ),
    },
  ]);
  const [dataEdit, setDataEdit] = useState([]);

  useEffect(() => {
    (async function () {
      let myUser = await fetch(
        process.env.REACT_APP_BASE_URL + "/trans/table",
        { method: "get", credentials: "include" }
      );
      let myRes = await myUser.json();
      if (myRes.ECode !== 20) {
        setData(myRes.table);
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
                <Button
                  variant="primary"
                  style={{ marginRight: "2%" }}
                  onClick={() => {
                    setModalProps([
                      {
                        title: "Add Table",
                        fgMode: "I",
                        fgModal: "table",
                        modalShow: true,
                      },
                    ]);
                    setModalShow(true);
                  }}
                >
                  <AddCircleOutlineIcon /> Add Table
                </Button>
                <Button variant="warning" onClick={HandleFilter}>
                  <FilterAltIcon /> Filter
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <TableComp
                  col={columns}
                  data={data}
                  setData={setData}
                  fgTable={"table"}
                  setDataEdit={setDataEdit}
                  setModalProps={setModalProps}
                  setModalShow={setModalShow}
                ></TableComp>
              </Col>
            </Row>
          </Container>
          <ModalComp
            show={modalShow}
            onHide={() => setModalShow(false)}
            setData={setData}
            modalProps={modalProps}
            dataEdit={dataEdit}
          />
        </div>
      )}
    </div>
  );
}

export default Table;
