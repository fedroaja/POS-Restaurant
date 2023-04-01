import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import TableComp from "../../components/admin/TableComp";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import Form from "react-bootstrap/Form";
import ModalComp from "../../components/admin/ModalComp";

function Product() {
  const [columns, setColumns] = useState([
    {
      name: "Product Code",
      selector: (row) => row.product_code,
      sortable: true,
      filterable: false,
    },
    {
      name: "Product Name",
      selector: (row) => row.product_name,
      sortable: true,
      filterable: false,
    },
    {
      name: "Category",
      selector: (row) => row.ctg_name,
      sortable: true,
      filterable: false,
    },
    {
      name: "Price",
      selector: (row) => row.product_price,
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
      cell: (row) => (
        <Form>
          <Form.Check
            disabled
            type="switch"
            defaultChecked={row.active === "Y"}
            id="custom-switch"
            label=""
          />
        </Form>
      ),
      sortable: true,
    },
  ]);
  const [columnsCtg, setColumnsCtg] = useState([
    {
      name: "Category Code",
      selector: (row) => row.ctg_code,
      sortable: true,
      filterable: false,
    },
    {
      name: "Category Name",
      selector: (row) => row.ctg_name,
      sortable: true,
      filterable: false,
    },
    {
      name: "Update Date",
      selector: (row) => row.upddate,
      sortable: true,
      filterable: false,
    },
  ]);
  const [data, setData] = useState([]);
  const [dataCtg, setDataCtg] = useState([]);
  const [isLoad, setIsLoad] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [modalShowCtg, setModalShowCtg] = useState(false);

  useEffect(() => {
    (async function () {
      let myUser = await fetch(
        process.env.REACT_APP_BASE_URL + "/trans/product",
        { method: "get", credentials: "include" }
      );
      let myRes = await myUser.json();
      if (myRes.ECode !== 20) {
        setData(myRes.product);
        setDataCtg(myRes.category);
        setIsLoad(false);
      } else {
        alert(myRes.EMsg);
      }
    })();
  }, []);

  function HandleFilter(e) {
    e.preventDefault();
    const cpData = [...columns].map((x, idx) => {
      if (x.name !== "Active") x.filterable = !x.filterable;
      return x;
    });

    setColumns(cpData);
  }

  function HandleFilterCtg(e) {
    e.preventDefault();
    const cpData = [...columnsCtg].map((x, idx) => {
      x.filterable = !x.filterable;
      return x;
    });

    setColumnsCtg(cpData);
  }

  return (
    <div
      style={{ height: "100%", width: "100%", padding: "3%", overflow: "auto" }}
    >
      {isLoad ? (
        "Loading..."
      ) : (
        <div>
          <Container>
            <Row>
              <Col>
                <Button
                  variant="primary"
                  style={{ marginRight: "2%" }}
                  onClick={() => setModalShow(true)}
                >
                  <AddCircleOutlineIcon /> Add Product
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
                  dataSet={setData}
                  fgTable={"product"}
                ></TableComp>
              </Col>
            </Row>
            <hr></hr>
            <Row>
              <Col>
                <Button
                  variant="primary"
                  style={{ marginRight: "2%" }}
                  onClick={() => setModalShowCtg(true)}
                >
                  <AddCircleOutlineIcon /> Add Category
                </Button>
                <Button variant="warning" onClick={HandleFilterCtg}>
                  <FilterAltIcon /> Filter
                </Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <TableComp
                  col={columnsCtg}
                  data={dataCtg}
                  dataSet={setDataCtg}
                  fgTable={"ctg"}
                ></TableComp>
              </Col>
            </Row>
          </Container>
          <ModalComp
            show={modalShow}
            onHide={() => setModalShow(false)}
            title="Add Product"
            dataCtg={dataCtg}
            setData={setData}
            fgModal={"product"}
            fgMode={"I"}
          />
          <ModalComp
            show={modalShowCtg}
            onHide={() => setModalShowCtg(false)}
            title="Add Category"
            fgModal={"category"}
            fgMode={"I"}
          />
        </div>
      )}
    </div>
  );
}

export default Product;
