import React, { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import TableComp from "../../components/admin/TableComp";
import ModalComp from "../../components/admin/ModalComp";

function User() {
  const [isLoad, setIsLoad] = useState(true);
  const [data, setData] = useState([]);
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
      name: "Username",
      selector: (row) => row.USERNAME,
      sortable: true,
      filterable: false,
    },
    {
      name: "Nickname",
      selector: (row) => row.NICKNAME,
      sortable: true,
      filterable: false,
    },
    {
      name: "ROLE",
      selector: (row) => row.ROLE,
      cell: (row) => <span>{getRole(row.ROLE)}</span>,
      sortable: true,
      filterable: false,
    },
    {
      name: "Crated At",
      selector: (row) => row.createdate,
      sortable: true,
      filterable: false,
    },
    {
      name: "Last Update",
      selector: (row) => row.upddate,
      sortable: true,
      filterable: false,
    },
  ]);
  const [dataEdit, setDataEdit] = useState([]);

  useEffect(() => {
    (async function () {
      setIsLoad(true);
      let myUser = await fetch(process.env.REACT_APP_BASE_URL + "/trans/user", {
        method: "get",
        credentials: "include",
      });
      let myRes = await myUser.json();
      if (myRes.ECode !== 20) {
        setIsLoad(false);
        setData(myRes.user);
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

  function getRole(role) {
    let myRole = "";
    switch (role) {
      case 0:
        myRole = "Admin";
        break;
      case 1:
        myRole = "Cashier";
        break;
      case 2:
        myRole = "Kitchen";
        break;
    }
    return myRole;
  }

  return (
    <div
      style={{ height: "100%", width: "100%", padding: "3%", overflow: "auto" }}
    >
      {isLoad ? (
        <Loading type={"spinningBubbles"} size={80} />
      ) : (
        <>
          {" "}
          <Container>
            <Row>
              <Col>
                <Button
                  variant="primary"
                  style={{ marginRight: "2%" }}
                  onClick={() => {
                    setModalProps([
                      {
                        title: "Add User",
                        fgMode: "I",
                        fgModal: "user",
                      },
                    ]);
                    setModalShow(true);
                  }}
                >
                  <AddCircleOutlineIcon /> Add User
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
                  fgTable={"user"}
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
        </>
      )}
    </div>
  );
}

export default User;
