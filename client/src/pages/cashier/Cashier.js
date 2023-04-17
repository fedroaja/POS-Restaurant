import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import LogoutIcon from "@mui/icons-material/Logout";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import SearchIcon from "@mui/icons-material/Search";
import Card from "react-bootstrap/Card";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import { purple } from "@mui/material/colors";

import Orderlist from "../../components/cashier/Orderlist";
import ModalComponent from "../../components/cashier/ModalComponent";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Checkbox } from "@mui/material";

function Cashier() {
  const navigate = useNavigate();
  const [isLoad, setIsLoad] = useState(true);
  const [isTblLoad, setIsTblLoad] = useState(false);
  const [isOrderLoad, setIsOrderLoad] = useState(false);
  const [ctgSelected, setCtgSelected] = useState(0);
  const [searchVal, setSearchVal] = useState("");

  const [product, setProduct] = useState([]);
  const [productFilter, setProductFilter] = useState([]);

  const [category, setCategory] = useState([]);

  const [modalShow, setModalShow] = useState(false);
  const [modalProps, setModalProps] = useState([
    {
      title: "",
      fgMode: "",
      fgModal: "",
    },
  ]);

  const [dataTable, setDataTable] = useState([]);
  const [selectedTable, setSelectedTable] = useState([
    {
      table_id: 0,
      table_code: "",
      table_name: "Select Table",
    },
  ]);

  const [currOrderList, setCurrOrderList] = useState([]);

  const [paymentSelected, setPaymentSelected] = useState("");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [realtime, setRealtime] = useState(false);

  const cardStyle = {
    border: "none",
    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.2)",
    background: "white",
    cursor: "pointer",
  };

  const cardStyleOrder = {
    border: "none",
    boxShadow: "0 1px 4px 0 rgba(0,0,0,0.2)",
    background: "white",
    marginTop: "10px",
    width: "97%",
  };

  // const category = [
  //   { name: "Semua", value: "1" },
  //   { name: "Makanan", value: "2" },
  //   { name: "Minuman", value: "3" },
  //   { name: "Desert", value: "4" },
  //   { name: "Snack", value: "5" },
  //   { name: "Extra", value: "6" },
  // ];

  // const [dataDummy, setDataDummy] = useState([
  //   {
  //     name: "Gado-Gado",
  //     code: "P001",
  //     ctg: "2",
  //     time: "5",
  //     price: "12.500",
  //   },
  //   {
  //     name: "Ketoprak",
  //     code: "P002",
  //     ctg: "2",
  //     time: "5",
  //     price: "22.500",
  //   },
  //   {
  //     name: "Es Cendol",
  //     code: "P003",
  //     ctg: "3",
  //     time: "1",
  //     price: "10.500",
  //   },
  //   {
  //     name: "Puding",
  //     code: "P004",
  //     ctg: "4",
  //     time: "1",
  //     price: "5.500",
  //   },
  //   {
  //     name: "Soto Ayam",
  //     code: "P005",
  //     ctg: "2",
  //     time: "5",
  //     price: "25.500",
  //   },
  //   {
  //     name: "Ketoprak",
  //     code: "P006",
  //     ctg: "2",
  //     time: "1",
  //     price: "9.500",
  //   },
  //   {
  //     name: "Es Dawet",
  //     code: "P007",
  //     ctg: "5",
  //     time: "5",
  //     price: "8.500",
  //   },
  // ]);

  const [dataWaitingList, setDataWaitingList] = useState([]);
  const timeOutRef = useRef();

  async function getTable() {
    setIsTblLoad(true);
    let myUser = await fetch(
      process.env.REACT_APP_BASE_URL + "/cashier/table",
      { method: "get", credentials: "include" }
    );
    let myRes = await myUser.json();
    setIsTblLoad(false);
    if (myRes.ECode !== 20) {
      setDataTable(myRes.table);
      setModalProps([
        {
          title: "Select Table",
          fgMode: "I",
          fgModal: "table",
        },
      ]);
      setModalShow(true);
    } else {
      alert(myRes.EMsg);
    }
  }

  async function makeOrder(e) {
    e.preventDefault();
    if (currOrderList.length == 0) {
      alert("Order Must Not Empty");
      return;
    }
    if (selectedTable[0].table_id == 0) {
      alert("Please Select Table");
      return;
    }
    if (paymentSelected == "") {
      alert("Please Select Payment");
      return;
    }

    setIsOrderLoad(true);

    const dataSave = {
      invoiceHd: {
        tableCode: selectedTable[0].table_code,
        tableName: selectedTable[0].table_name,
        totalPrice:
          currOrderList.reduce((n, { trans_amount }) => n + trans_amount, 0) +
          parseInt(
            (currOrderList.reduce(
              (n, { trans_amount }) => n + trans_amount,
              0
            ) *
              10) /
              100
          ),
        deliveryTime: currOrderList.reduce(
          (n, { delivery_time }) => n + delivery_time,
          0
        ),
        paymentMethod: paymentSelected,
        fgStatus: "P",
      },
      invoiceDt: currOrderList,
    };

    let result = await fetch(
      process.env.REACT_APP_BASE_URL + "/cashier/addorder",
      {
        method: "post",
        body: JSON.stringify(dataSave),
        headers: {
          "Content-type": "application/json;charset=UTF-8",
        },
        credentials: "include",
      }
    );
    result = await result.json().then((data) => {
      setIsOrderLoad(false);
      if (data.ECode !== 0) {
        alert(data.EMsg);
        return;
      }
      setDataWaitingList(data.invoice);
      setCurrOrderList([]);
      setSelectedTable([
        {
          table_id: 0,
          table_code: "",
          table_name: "Select Table",
        },
      ]);
      setPaymentSelected("");
      setOpenSnackBar(true);
    });
  }

  function handleOnLogout(e) {
    e.preventDefault();
    (async function () {
      let myUser = await fetch(
        process.env.REACT_APP_BASE_URL + "/auth/logout",
        { method: "delete", credentials: "include" }
      );
      let myRes = await myUser.json();

      if (myRes.ECode === 0) {
        localStorage.clear();
        navigate("/login");
      }
    })();
  }

  function handleOrderRefresh(e) {
    e.preventDefault();
    (async function () {
      let myOrder = await fetch(
        process.env.REACT_APP_BASE_URL + "/cashier/orderslist",
        { method: "get", credentials: "include" }
      );
      let myRes = await myOrder.json();

      if (myRes.ECode !== 0) {
        alert(myRes.EMsg);
        return;
      }
      setDataWaitingList(myRes.invoice);
    })();
  }

  function refreshOrder() {
    (async function () {
      let myOrder = await fetch(
        process.env.REACT_APP_BASE_URL + "/cashier/orderslist",
        { method: "get", credentials: "include" }
      );
      let myRes = await myOrder.json();

      if (myRes.ECode !== 0) {
        alert(myRes.EMsg);
        return;
      }
      setDataWaitingList(myRes.invoice);
      timeOutRef.current = setTimeout(refreshOrder, 1000);
    })();
  }

  useEffect(() => {
    (async function () {
      setIsLoad(true);
      let myUser = await fetch(process.env.REACT_APP_BASE_URL + "/auth", {
        method: "get",
        credentials: "include",
      });
      let myRes = await myUser.json();
      if (myRes.ECode === 0) {
        if (myRes.role !== 1) {
          navigate("/notfound");
        }
      } else {
        navigate("/login");
      }

      let myData = await fetch(
        process.env.REACT_APP_BASE_URL + "/cashier/product",
        {
          method: "get",
          credentials: "include",
        }
      );

      let myResData = await myData.json();
      setIsLoad(false);

      setProduct(myResData.product);
      setProductFilter(myResData.product);
      setCategory(myResData.category);
      setDataWaitingList(myResData.invoice);
      setCtgSelected(0);
    })();
  }, []);

  return (
    <>
      {isLoad ? (
        <Loading type={"bubbles"} size={150} />
      ) : (
        <div style={{ margin: "1%" }} className="scrollbar">
          <Container>
            <Row>
              {/* Left Content */}
              <Col
                xs={12}
                md={8}
                style={{ borderRight: "2px solid rgb(156 108 197 / 64%)" }}
              >
                {/* Header */}
                <Row>
                  <Row>
                    <Col style={{ height: "34px", color: "#674188" }}>
                      <h3>POSR</h3>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      xs={8}
                      md={8}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#674188",
                      }}
                    >
                      <span>Welcome, Fedro</span>
                    </Col>
                    <Col></Col>
                    <Col xs={2} md={2}>
                      <Button
                        style={{
                          backgroundColor: "#674188",
                          border: "none",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={(e) => handleOnLogout(e)}
                      >
                        <LogoutIcon style={{ fontSize: "20px" }}></LogoutIcon>{" "}
                        Logout
                      </Button>
                    </Col>
                  </Row>
                </Row>
                <hr />
                {/* Header */}
                {/* Category */}
                <Row
                  className="inner"
                  style={{
                    overflowY: "auto",
                    marginRight: "5%",
                    marginBottom: "2%",
                  }}
                >
                  <Col>
                    <ButtonGroup>
                      {category.map((x, idx) => (
                        <ToggleButton
                          key={idx}
                          id={`ctg-${idx}`}
                          type="radio"
                          variant={"outline-secondary"}
                          name="radio"
                          style={{
                            borderRadius: "20px",
                            marginRight: "10px",
                            backgroundColor:
                              ctgSelected.toString() === x.ctg_id.toString()
                                ? "#674188"
                                : "white",
                          }}
                          value={x.ctg_id.toString()}
                          checked={
                            ctgSelected.toString() === x.ctg_id.toString()
                          }
                          onChange={(e) => {
                            setCtgSelected(e.currentTarget.value);
                            if (e.currentTarget.value === "0") {
                              setProductFilter(
                                product.filter((x) => {
                                  return x.product_name
                                    .toLowerCase()
                                    .includes(searchVal.toLowerCase());
                                })
                              );
                              return;
                            }
                            setProductFilter(
                              product.filter((x) => {
                                return (
                                  x.ctg_id.toString() ===
                                    e.currentTarget.value &&
                                  x.product_name
                                    .toLowerCase()
                                    .includes(searchVal.toLowerCase())
                                );
                              })
                            );
                          }}
                        >
                          {x.ctg_name}
                        </ToggleButton>
                      ))}
                    </ButtonGroup>
                  </Col>
                </Row>
                {/* Category */}
                {/* Product */}
                <Row>
                  {/* Search */}
                  <Row>
                    <Col>
                      <InputGroup>
                        <InputGroup.Text
                          style={{ height: "100%", backgroundColor: "white" }}
                        >
                          <SearchIcon />
                        </InputGroup.Text>
                        <Form.Control
                          type="search"
                          placeholder="Search"
                          aria-label="Search"
                          aria-describedby="basic-addon1"
                          style={{ borderLeft: "none" }}
                          onChange={(e) => {
                            setSearchVal(e.currentTarget.value);
                            setProductFilter(
                              product.filter((x) => {
                                return (
                                  (x.ctg_id.toString() ===
                                    ctgSelected.toString() ||
                                    ctgSelected.toString() === "0") &&
                                  x.product_name
                                    .toLowerCase()
                                    .includes(
                                      e.currentTarget.value.toLowerCase()
                                    )
                                );
                              })
                            );
                          }}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                  {/* Search */}
                  {/* Body */}
                  <Row
                    className="scrollbar"
                    style={{
                      height: "52vh",
                      overflowX: "auto",
                    }}
                  >
                    {productFilter.map((x, idx) => (
                      <Col
                        key={x.id}
                        xs="6"
                        md="4"
                        style={{ marginBottom: "8px" }}
                      >
                        <Card
                          style={cardStyle}
                          onClick={(e) => {
                            if (isOrderLoad) return;

                            const isExists = currOrderList.find(
                              (order) => order.id === x.id
                            );
                            if (!isExists) {
                              const tmp = { ...x };
                              tmp.product_qty = 1;
                              setCurrOrderList((prev) => [...prev, tmp]);
                            } else {
                              setCurrOrderList(
                                currOrderList.map((curr) => {
                                  if (curr.id === x.id) {
                                    return {
                                      ...curr,
                                      product_qty: curr.product_qty + 1,
                                      trans_amount:
                                        (curr.product_qty + 1) *
                                        curr.product_price,
                                    };
                                  } else {
                                    return curr;
                                  }
                                })
                              );
                            }
                          }}
                        >
                          <Card.Body>
                            <Container>
                              <Row>
                                <Col
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "18px",
                                  }}
                                >
                                  {x.product_name}
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  style={{
                                    fontWeight: "100",
                                    fontSize: "12px",
                                  }}
                                >
                                  {x.product_code}
                                </Col>
                              </Row>
                              <Row>
                                <Col
                                  style={{
                                    fontWeight: "700",
                                    fontSize: "18px",
                                    color: "#674188",
                                    display: "flex",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-end",
                                  }}
                                  xs={12}
                                  md={8}
                                >
                                  Rp. {x.product_price.toLocaleString("id-ID")}
                                </Col>
                                <Col
                                  xs={12}
                                  md={4}
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  <img
                                    style={{ borderRadius: "10px" }}
                                    width={"70px"}
                                    height={"70px"}
                                    src={x.img_url}
                                  ></img>
                                </Col>
                              </Row>
                            </Container>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  {/* Body */}
                </Row>
                <hr />
                {/* Product */}
                {/* Order */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                  }}
                >
                  <div
                    style={{
                      borderRight: "1px solid #67418838",
                      paddingRight: "10px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <Button
                        size="sm"
                        onClick={(e) => {
                          handleOrderRefresh(e);
                        }}
                      >
                        <RefreshIcon />
                      </Button>
                    </div>
                    <div
                      style={{
                        fontSize: "12px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Checkbox
                        size="small"
                        checked={realtime}
                        onChange={(e) => {
                          let val = e.currentTarget.checked;
                          setRealtime(val);

                          if (val)
                            timeOutRef.current = setTimeout(refreshOrder, 1000);
                          else clearTimeout(timeOutRef.current);
                        }}
                        inputProps={{ "aria-label": "controlled" }}
                      />
                      <span>Realtime</span>
                    </div>
                  </div>
                  <div
                    style={{
                      overflow: "auto",
                      overflowY: "hidden",
                      marginTop: "-20px",
                      height: "12%",
                    }}
                    className="inner"
                  >
                    <div
                      style={{
                        marginTop: "2%",
                        marginLeft: "0px",
                        whiteSpace: "nowrap",
                        paddingBottom: "8px",
                      }}
                    >
                      {dataWaitingList.map((x, idx) => (
                        <Orderlist
                          data={x}
                          setDataWaitingList={setDataWaitingList}
                          key={idx}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Order */}
              </Col>
              {/* Right Content */}
              <Col xs={12} md={4}>
                {/* invoice Head */}
                <Row
                  style={{
                    display: "flex",
                    paddingTop: "3%",
                    color: "#674188",
                  }}
                >
                  <Col
                    xs={10}
                    md={8}
                    style={{
                      display: "flex",
                      justifyContent: "flex-start",
                      alignItems: "flex-end",
                    }}
                  >
                    <Button
                      variant="outline-primary"
                      style={{ borderRadius: "10px" }}
                      onClick={(e) => {
                        if (isOrderLoad) return;
                        getTable();
                      }}
                    >
                      {isTblLoad ? (
                        <Loading type={"spinningBubbles"} size={20} />
                      ) : (
                        selectedTable[0].table_name
                      )}
                    </Button>
                  </Col>
                  <Col xs={2} md={4}>
                    <Button
                      style={{ backgroundColor: "#f74e4ed6", border: "none" }}
                      onClick={(e) => {
                        if (isOrderLoad) return;
                        setCurrOrderList([]);
                      }}
                    >
                      Clear All
                    </Button>
                  </Col>
                </Row>
                <hr />
                {/* invoice Head */}
                {/* Invoice Body */}
                <Row
                  className="scrollbar"
                  style={{
                    height: "35vh",
                    overflow: "auto",
                    display: "flex",
                    flexDirection: "column",
                    paddingLeft: "12px",
                    flexWrap: "nowrap",
                  }}
                >
                  {currOrderList.length == 0 ? (
                    <Col
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      Empty Order
                    </Col>
                  ) : (
                    currOrderList.map((order, idx) => {
                      return (
                        <Card style={cardStyleOrder} key={idx}>
                          <Card.Body>
                            <Row>
                              <Col
                                md={2}
                                style={{
                                  background:
                                    "url('" +
                                    order.img_url +
                                    "') center center / contain no-repeat",
                                  borderRadius: "8px",
                                }}
                              ></Col>
                              <Col md={10}>
                                <Row>
                                  <Col
                                    md={10}
                                    style={{
                                      fontWeight: "500",
                                      fontSize: "18px",
                                    }}
                                  >
                                    {order.product_name}
                                  </Col>
                                </Row>
                                <Row xs={12} md={12}>
                                  <Col
                                    xs={12}
                                    md={6}
                                    style={{
                                      fontWeight: "700",
                                      fontSize: "14px",
                                      color: "#674188",
                                      display: "flex",
                                      justifyContent: "flex-start",
                                      alignItems: "flex-end",
                                    }}
                                  >
                                    Rp.{" "}
                                    {order.trans_amount.toLocaleString("id-ID")}
                                  </Col>
                                  <Col
                                    xs={12}
                                    md={6}
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "baseline",
                                    }}
                                  >
                                    <Button
                                      size="sm"
                                      style={{
                                        width: "40px",
                                        backgroundColor: purple[500],
                                        border: "none",
                                        fontWeight: "700",
                                        paddingLeft: "10px",
                                        paddingRight: "10px",
                                      }}
                                      onClick={(e) => {
                                        if (isOrderLoad) return;
                                        if (order.product_qty <= 1) return;

                                        setCurrOrderList(
                                          currOrderList.map((curr) => {
                                            if (curr.id === order.id) {
                                              return {
                                                ...curr,
                                                product_qty:
                                                  curr.product_qty - 1,
                                                trans_amount:
                                                  (curr.product_qty - 1) *
                                                  curr.product_price,
                                              };
                                            } else {
                                              return curr;
                                            }
                                          })
                                        );
                                      }}
                                    >
                                      -
                                    </Button>
                                    <Form.Control
                                      type="text"
                                      disabled
                                      value={order.product_qty}
                                      style={{
                                        marginLeft: "5px",
                                        marginRight: "5px",
                                        height: "30px",
                                        width: "52px",
                                      }}
                                    ></Form.Control>
                                    <Button
                                      size="sm"
                                      style={{
                                        width: "40px",
                                        backgroundColor: purple[500],
                                        border: "none",
                                        fontWeight: "700",
                                      }}
                                      onClick={(e) => {
                                        if (isOrderLoad) return;
                                        setCurrOrderList(
                                          currOrderList.map((curr) => {
                                            if (curr.id === order.id) {
                                              return {
                                                ...curr,
                                                product_qty:
                                                  curr.product_qty + 1,
                                                trans_amount:
                                                  (curr.product_qty + 1) *
                                                  curr.product_price,
                                              };
                                            } else {
                                              return curr;
                                            }
                                          })
                                        );
                                      }}
                                    >
                                      +
                                    </Button>
                                    <Button
                                      size="sm"
                                      style={{
                                        width: "40px",
                                        marginLeft: "10px",
                                        backgroundColor: "#f86a6a",
                                        border: "none",
                                        fontWeight: "700",
                                      }}
                                      onClick={(e) => {
                                        if (isOrderLoad) return;
                                        setCurrOrderList((prev) => {
                                          return prev.filter(
                                            (x) => x.id !== order.id
                                          );
                                        });
                                      }}
                                    >
                                      X
                                    </Button>
                                  </Col>
                                </Row>
                              </Col>
                            </Row>
                            <Row
                              style={{ marginTop: "8px", fontWeight: "700" }}
                            >
                              <small>Notes</small>
                              <Form.Control
                                type="text"
                                maxLength={255}
                                style={{ width: "96%", marginLeft: "10px" }}
                                onChange={(e) => {
                                  if (isOrderLoad) return;
                                  setCurrOrderList(
                                    currOrderList.map((curr) => {
                                      if (curr.id === order.id) {
                                        return {
                                          ...curr,
                                          note: e.currentTarget.value,
                                        };
                                      } else {
                                        return curr;
                                      }
                                    })
                                  );
                                }}
                              ></Form.Control>
                            </Row>
                          </Card.Body>
                        </Card>
                      );
                    })
                  )}
                </Row>
                {/* Invoice Body */}
                {/* Invoice Footer */}
                <Row
                  style={{
                    marginTop: "10px",
                    paddingLeft: "12px",
                    height: "47vh",
                  }}
                >
                  <Card style={cardStyleOrder}>
                    <Card.Body>
                      <Row>
                        <Col md="6" style={{ fontWeight: "200" }}>
                          Subtotal
                        </Col>
                        <Col
                          md="6"
                          style={{
                            fontWeight: "500",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          Rp.{" "}
                          {currOrderList
                            .reduce(
                              (n, { trans_amount }) => n + trans_amount,
                              0
                            )
                            .toLocaleString("id-ID")}
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "8px" }}>
                        <Col md="6" style={{ fontWeight: "200" }}>
                          Tax(10%)
                        </Col>
                        <Col
                          md="6"
                          style={{
                            fontWeight: "500",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          Rp.{" "}
                          {parseInt(
                            (currOrderList.reduce(
                              (n, { trans_amount }) => n + trans_amount,
                              0
                            ) *
                              10) /
                              100
                          ).toLocaleString("id-ID")}
                        </Col>
                      </Row>
                      <hr style={{ borderTop: "2px dashed black" }} />
                      <Row style={{ marginTop: "8px" }}>
                        <Col
                          md="6"
                          style={{ fontWeight: "200", fontSize: "20px" }}
                        >
                          Total
                        </Col>
                        <Col
                          md="6"
                          style={{
                            fontWeight: "500",
                            fontSize: "20px",
                            display: "flex",
                            justifyContent: "flex-end",
                          }}
                        >
                          Rp.{" "}
                          {(
                            currOrderList.reduce(
                              (n, { trans_amount }) => n + trans_amount,
                              0
                            ) +
                            parseInt(
                              (currOrderList.reduce(
                                (n, { trans_amount }) => n + trans_amount,
                                0
                              ) *
                                10) /
                                100
                            )
                          ).toLocaleString("id-ID")}
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "30px" }}>
                        <Col
                          md="6"
                          style={{ fontWeight: "200", fontSize: "14px" }}
                        >
                          Payment Method
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "4px" }}>
                        <Col>
                          <Card
                            style={{
                              border: "none",
                              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.2)",
                              background:
                                paymentSelected == "cash"
                                  ? purple[500]
                                  : "white",
                              marginTop: "10px",
                              width: "97%",
                            }}
                            onClick={(e) => {
                              if (isOrderLoad) return;
                              setPaymentSelected("cash");
                            }}
                          >
                            <Card.Body
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                cursor: "pointer",
                              }}
                            >
                              <MonetizationOnIcon
                                sx={{
                                  fontSize: 30,
                                  color:
                                    paymentSelected == "cash"
                                      ? "white"
                                      : purple[500],
                                }}
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col>
                          <Card
                            style={{
                              border: "none",
                              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.2)",
                              background:
                                paymentSelected == "credit"
                                  ? purple[500]
                                  : "white",
                              marginTop: "10px",
                              width: "97%",
                            }}
                            onClick={(e) => {
                              if (isOrderLoad) return;
                              setPaymentSelected("credit");
                            }}
                          >
                            <Card.Body
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                cursor: "pointer",
                              }}
                            >
                              <CreditCardIcon
                                sx={{
                                  fontSize: 30,
                                  color:
                                    paymentSelected == "credit"
                                      ? "white"
                                      : purple[500],
                                }}
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                        <Col>
                          <Card
                            style={{
                              border: "none",
                              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.2)",
                              background:
                                paymentSelected == "qrcode"
                                  ? purple[500]
                                  : "white",
                              marginTop: "10px",
                              width: "97%",
                            }}
                            onClick={(e) => {
                              if (isOrderLoad) return;
                              setPaymentSelected("qrcode");
                            }}
                          >
                            <Card.Body
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                paddingTop: "10px",
                                paddingBottom: "10px",
                                cursor: "pointer",
                              }}
                            >
                              <QrCodeScannerIcon
                                sx={{
                                  fontSize: 30,
                                  color:
                                    paymentSelected == "qrcode"
                                      ? "white"
                                      : purple[500],
                                }}
                              />
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                      <Row style={{ marginTop: "20px" }}>
                        <Button
                          size="lg"
                          style={{
                            backgroundColor: purple[500],
                            border: "none",
                          }}
                          onClick={(e) => {
                            if (isOrderLoad) return;
                            makeOrder(e);
                          }}
                        >
                          Order
                        </Button>
                      </Row>
                    </Card.Body>
                  </Card>
                </Row>
                {/* Invoice Footer */}
              </Col>
            </Row>
          </Container>
          <ModalComponent
            show={modalShow}
            onHide={() => setModalShow(false)}
            modalProps={modalProps}
            dataTable={dataTable}
            setSelectedTable={setSelectedTable}
          />
          <Snackbar
            ContentProps={{
              sx: {
                background: "green",
              },
            }}
            open={openSnackBar}
            onClose={() => setOpenSnackBar(false)}
            autoHideDuration={4000}
          >
            <Alert icon={<CheckCircleOutlineIcon />}>
              {dataWaitingList.length > 0
                ? dataWaitingList[dataWaitingList.length - 1].invoice_code
                : ""}{" "}
              Succesfuly Submited
            </Alert>
          </Snackbar>
        </div>
      )}
    </>
  );
}

export default Cashier;
