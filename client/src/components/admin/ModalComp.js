import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loading from "../Loading";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PaidIcon from "@mui/icons-material/Paid";

function ModalComp(props) {
  const [validated, setValidated] = useState(false);
  const [isLoad, setLoad] = useState("N");

  const myStyle = {
    display: "flex",
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
  };

  const myStyle2 = {
    display: "flex",
    alignItems: "center",
  };

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
      <span
        style={{
          display: "inline-block",
          backgroundColor: bgColor,
          borderRadius: "10px",
          width: "70px",
          height: "21px",
          textAlign: "center",
          fontSize: "13px",
          color: "white",
        }}
      >
        {status}
      </span>
    );
  }

  async function submitHandler(event) {
    setValidated(true);
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      return;
    }

    switch (props.modalProps[0].fgModal) {
      case "product":
        {
          const myData = {
            productId:
              props.modalProps[0].fgMode == "I" ? 0 : props.dataEdit[0].id,
            productCode: form.productCode.value,
            productName: form.productName.value,
            productCtg: form.productCtg.value,
            productPrice: form.productPrice.value,
            productActive: form.productActive.checked,
            deliveryTime: form.deliveryTime.value,
            imgUrl: form.imgUrl.value,
            fgMode: props.modalProps[0].fgMode,
          };
          setLoad("Y");
          let result = await fetch(
            process.env.REACT_APP_BASE_URL + "/trans/addproduct",
            {
              method: "post",
              body: JSON.stringify(myData),
              headers: {
                "Content-type": "application/json;charset=UTF-8",
              },
              credentials: "include",
            }
          );
          result = await result.json().then((data) => {
            setLoad("N");
            if (data.ECode !== 0) {
              alert(data.EMsg);
              return;
            }

            props.setData((prev) => data.product);
            props.onHide(true);
          });
        }
        break;
      case "category":
        {
          const myData = {
            ctg_id:
              props.modalProps[0].fgMode == "I" ? 0 : props.dataEdit[0].ctg_id,
            ctg_code: form.ctgCode.value,
            ctg_name: form.ctgName.value,
            fgMode: props.modalProps[0].fgMode,
          };
          setLoad("Y");
          let result = await fetch(
            process.env.REACT_APP_BASE_URL + "/trans/addctg",
            {
              method: "post",
              body: JSON.stringify(myData),
              headers: {
                "Content-type": "application/json;charset=UTF-8",
              },
              credentials: "include",
            }
          );
          result = await result.json().then((data) => {
            setLoad("N");
            if (data.ECode !== 0) {
              alert(data.EMsg);
              return;
            }

            props.setDataCtg((prev) => data.category);
            props.onHide(true);
          });
        }
        break;
      case "table":
        {
          const myData = {
            tableId:
              props.modalProps[0].fgMode == "I"
                ? 0
                : props.dataEdit[0].table_id,
            tableCode: form.tableCode.value,
            tableName: form.tableName.value,
            tableActive: form.tableActive.checked,
            fgMode: props.modalProps[0].fgMode,
          };
          setLoad("Y");
          let result = await fetch(
            process.env.REACT_APP_BASE_URL + "/trans/addtable",
            {
              method: "post",
              body: JSON.stringify(myData),
              headers: {
                "Content-type": "application/json;charset=UTF-8",
              },
              credentials: "include",
            }
          );
          result = await result.json().then((data) => {
            setLoad("N");
            if (data.ECode !== 0) {
              alert(data.EMsg);
              return;
            }

            props.setData((prev) => data.table);
            props.onHide(true);
          });
        }
        break;
      case "user":
        {
          const myData = {
            userId:
              props.modalProps[0].fgMode == "I" ? 0 : props.dataEdit[0].ID,
            username: form.Username.value,
            password:
              props.modalProps[0].fgMode == "I" ? form.Password.value : 0,
            nickname: form.Nickname.value,
            role: form.Role.value,
            fgMode: props.modalProps[0].fgMode,
          };
          setLoad("Y");
          let result = await fetch(
            process.env.REACT_APP_BASE_URL + "/trans/adduser",
            {
              method: "post",
              body: JSON.stringify(myData),
              headers: {
                "Content-type": "application/json;charset=UTF-8",
              },
              credentials: "include",
            }
          );
          result = await result.json().then((data) => {
            setLoad("N");
            if (data.ECode !== 0) {
              alert(data.EMsg);
              return;
            }

            props.setData((prev) => data.user);
            props.onHide(true);
          });
        }
        break;
      case "reset":
        {
          const myData = {
            userId: props.dataEdit[0].ID,
            username: form.Username.value,
            password: form.Password.value,
          };
          setLoad("Y");
          let result = await fetch(
            process.env.REACT_APP_BASE_URL + "/trans/resetpassword",
            {
              method: "put",
              body: JSON.stringify(myData),
              headers: {
                "Content-type": "application/json;charset=UTF-8",
              },
              credentials: "include",
            }
          );
          result = await result.json().then((data) => {
            setLoad("N");
            if (data.ECode !== 0) {
              alert(data.EMsg);
              return;
            }
            props.onHide(true);
          });
        }
        break;
      default:
        break;
    }
  }

  function modalBody() {
    switch (props.modalProps[0].fgModal) {
      case "product":
        {
          return (
            <Modal.Body>
              <Form noValidate validated={validated} onSubmit={submitHandler}>
                <Form.Group
                  className="mb-3"
                  controlId="formProductCode"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Product Code</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Product Code"
                    maxLength={25}
                    name="productCode"
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].product_code
                        : ""
                    }
                    autoFocus={props.modalProps[0].fgMode === "I"}
                    disabled={props.modalProps[0].fgMode === "E"}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Product Code Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formProductName"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    placeholder="Product Name"
                    maxLength={255}
                    name="productName"
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].product_name
                        : ""
                    }
                    autoFocus={props.modalProps[0].fgMode === "E"}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Product Name Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formProductCtg"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    name="productCtg"
                    required
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].ctg_id
                        : ""
                    }
                  >
                    {props.dataCtg.map((x) => {
                      return (
                        <option key={x.ctg_id} value={x.ctg_id}>
                          {x.ctg_name}
                        </option>
                      );
                    })}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" tooltip>
                    Category Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formProductPrice"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    name="productPrice"
                    min={0}
                    pattern="[0-9]"
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].product_price.replace(",", "")
                        : ""
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Price Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formDeliveryTime"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Delivery Time (Minute)</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    name="deliveryTime"
                    min={1}
                    max={300}
                    pattern="[0-9]"
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].delivery_time
                        : ""
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Price Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formImgUrl"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Image URL</Form.Label>

                  <Form.Control
                    required
                    type="text"
                    placeholder="Image URL"
                    maxLength={255}
                    name="imgUrl"
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].img_url
                        : ""
                    }
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Image URL Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formProductDate"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString("id-ID")}
                    name="productDate"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formProductActive">
                  <Form.Label>Active</Form.Label>
                  <Form.Check
                    type="switch"
                    disabled={props.modalProps[0].fgMode === "I"}
                    defaultChecked={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].active === "Y"
                        : true
                    }
                    name="productActive"
                    onChange={() => {}}
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  {isLoad == "N" ? (
                    <div>
                      <Button variant="primary" type="submit" size="lg">
                        Save
                      </Button>
                      <Button variant="danger" onClick={props.onHide} size="lg">
                        Close
                      </Button>
                    </div>
                  ) : (
                    <Loading type={"spinningBubbles"} size={30} />
                  )}
                </div>
              </Form>
            </Modal.Body>
          );
        }
        break;
      case "category":
        {
          return (
            <Modal.Body>
              <Form noValidate validated={validated} onSubmit={submitHandler}>
                <Form.Group
                  className="mb-3"
                  controlId="formCtgCode"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Category Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="ctgCode"
                    placeholder="Category Code"
                    required
                    disabled={props.modalProps[0].fgMode == "E"}
                    autoFocus={props.modalProps[0].fgMode === "I"}
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].ctg_code
                        : ""
                    }
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Category Code Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formCtgName"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Category Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="ctgName"
                    placeholder="Category Name"
                    autoFocus={props.modalProps[0].fgMode === "E"}
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].ctg_name
                        : ""
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Category Name Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formProductDate"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString("id-ID")}
                    name="productDate"
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  {isLoad == "N" ? (
                    <div>
                      <Button variant="primary" type="submit" size="lg">
                        Save
                      </Button>
                      <Button variant="danger" onClick={props.onHide} size="lg">
                        Close
                      </Button>
                    </div>
                  ) : (
                    <Loading type={"spinningBubbles"} size={30} />
                  )}
                </div>
              </Form>
            </Modal.Body>
          );
        }
        break;
      case "table":
        {
          return (
            <Modal.Body>
              <Form noValidate validated={validated} onSubmit={submitHandler}>
                <Form.Group
                  className="mb-3"
                  controlId="formTableCode"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Table Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="tableCode"
                    placeholder="Table Code"
                    required
                    disabled={props.modalProps[0].fgMode == "E"}
                    autoFocus={props.modalProps[0].fgMode === "I"}
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].table_code
                        : ""
                    }
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Table Code Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formTableName"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Table Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="tableName"
                    placeholder="Table Name"
                    autoFocus={props.modalProps[0].fgMode === "E"}
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].table_name
                        : ""
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Table Name Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formTableDate"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString("id-ID")}
                    name="tableDate"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formTableActive">
                  <Form.Label>Active</Form.Label>
                  <Form.Check
                    type="switch"
                    disabled={props.modalProps[0].fgMode === "I"}
                    defaultChecked={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].active === "Y"
                        : true
                    }
                    name="tableActive"
                    onChange={() => {}}
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  {isLoad == "N" ? (
                    <div>
                      <Button variant="primary" type="submit" size="lg">
                        Save
                      </Button>
                      <Button variant="danger" onClick={props.onHide} size="lg">
                        Close
                      </Button>
                    </div>
                  ) : (
                    <Loading type={"spinningBubbles"} size={30} />
                  )}
                </div>
              </Form>
            </Modal.Body>
          );
        }
        break;
      case "transaction":
        {
          return (
            <Modal.Body>
              <Container>
                <Row>
                  <Col xs={12} md={7}>
                    {props.selectedRow.invoice_code}
                  </Col>
                  <Col xs={6} md={5}>
                    <div style={{ fontSize: "12px" }}>
                      <strong>Created at :</strong>{" "}
                      {props.selectedRow.trans_date}
                    </div>
                    <div style={{ fontSize: "12px" }}>
                      <strong>Last Update :</strong> {props.selectedRow.upddate}
                    </div>
                  </Col>
                </Row>
                <hr />
                {props.dataDetail.map((y, idx) => (
                  <Row key={idx}>
                    <Col>
                      <small>{y.product_name}</small>
                    </Col>
                    <Col style={myStyle}>
                      <small>x{y.trans_qty}</small>
                    </Col>
                    <Col style={myStyle}>
                      <small>{y.trans_amount}</small>
                    </Col>
                  </Row>
                ))}
                <hr />
                <Row>
                  <Col></Col>
                  <Col></Col>
                  <Col>
                    <small>
                      Total :{" "}
                      {props.dataDetail
                        .filter(
                          (x) =>
                            x.invoice_id == props.selectedRow.invoice_id &&
                            x.trans_id
                        )
                        .reduce((prev, { trans_qty }) => prev + trans_qty, 0)}
                    </small>
                  </Col>
                </Row>
                <Row>
                  <Col></Col>
                  <Col></Col>
                  <Col>
                    <small style={myStyle2}>
                      <PaidIcon fontSize="small" style={{ color: "#ffc602" }} />
                      {props.dataDetail
                        .filter(
                          (x) =>
                            x.invoice_id == props.selectedRow.invoice_id &&
                            x.trans_id
                        )
                        .reduce(
                          (prev, { trans_amount }) => prev + trans_amount,
                          0
                        )
                        .toLocaleString("id-ID")}
                    </small>
                  </Col>
                </Row>
              </Container>
            </Modal.Body>
          );
        }
        break;
      case "user":
        {
          return (
            <Modal.Body>
              <Form noValidate validated={validated} onSubmit={submitHandler}>
                <Form.Group
                  className="mb-3"
                  controlId="formUsername"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="Username"
                    placeholder="Username"
                    required
                    disabled={props.modalProps[0].fgMode === "E"}
                    autoFocus={props.modalProps[0].fgMode === "I"}
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].USERNAME
                        : ""
                    }
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Username Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>

                {props.modalProps[0].fgMode === "I" ? (
                  <Form.Group
                    className="mb-3"
                    controlId="formPassword"
                    style={{ position: "relative" }}
                  >
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="Password"
                      placeholder="Password"
                      maxLength={25}
                      minLength={5}
                    />
                    <Form.Control.Feedback type="invalid" tooltip>
                      Password Must Not Empty!
                    </Form.Control.Feedback>
                  </Form.Group>
                ) : (
                  ""
                )}

                <Form.Group
                  className="mb-3"
                  controlId="formNickname"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Nickname</Form.Label>
                  <Form.Control
                    type="text"
                    name="Nickname"
                    placeholder="Nickname"
                    autoFocus={props.modalProps[0].fgMode === "E"}
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].NICKNAME
                        : ""
                    }
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Nickname Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group
                  className="mb-3"
                  controlId="formRole"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="Role"
                    required
                    defaultValue={
                      props.modalProps[0].fgMode === "E"
                        ? props.dataEdit[0].ROLE
                        : 0
                    }
                  >
                    <option value={0}>Admin</option>
                    <option value={1}>Cashier</option>
                    <option value={2}>Kitchen</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid" tooltip>
                    Role Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formTableDate"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="text"
                    disabled
                    value={new Date().toLocaleDateString("id-ID")}
                    name="tableDate"
                  />
                </Form.Group>
                <div className="d-grid gap-2">
                  {isLoad == "N" ? (
                    <div>
                      <Button variant="primary" type="submit" size="lg">
                        Save
                      </Button>
                      <Button variant="danger" onClick={props.onHide} size="lg">
                        Close
                      </Button>
                    </div>
                  ) : (
                    <Loading type={"spinningBubbles"} size={30} />
                  )}
                </div>
              </Form>
            </Modal.Body>
          );
        }
        break;
      case "reset":
        {
          return (
            <Modal.Body>
              <Form noValidate validated={validated} onSubmit={submitHandler}>
                <Form.Group
                  className="mb-3"
                  controlId="formUsername"
                  style={{ position: "relative" }}
                >
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="Username"
                    placeholder="Username"
                    required
                    disabled
                    defaultValue={props.dataEdit[0].USERNAME}
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Username Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formPassword"
                  style={{ position: "relative" }}
                >
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="Password"
                    placeholder="New Password"
                    maxLength={25}
                    minLength={5}
                    autoFocus
                  />
                  <Form.Control.Feedback type="invalid" tooltip>
                    Password Must Not Empty!
                  </Form.Control.Feedback>
                </Form.Group>
                <div className="d-grid gap-2">
                  {isLoad == "N" ? (
                    <div>
                      <Button variant="primary" type="submit" size="lg">
                        Save
                      </Button>
                      <Button variant="danger" onClick={props.onHide} size="lg">
                        Close
                      </Button>
                    </div>
                  ) : (
                    <Loading type={"spinningBubbles"} size={30} />
                  )}
                </div>
              </Form>
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
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
        backdrop={isLoad == "Y" ? "static" : true}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <Row>
              <Col
                xs={12}
                md={props.modalProps[0].fgModal == "transaction" ? 6 : 12}
              >
                {props.modalProps[0].title}
              </Col>
              <Col xs={6} md={6}>
                {props.modalProps[0].fgModal == "transaction"
                  ? getStatus(props.selectedRow.status)
                  : ""}
              </Col>
            </Row>
          </Modal.Title>
        </Modal.Header>
        {modalBody()}
      </Modal>
    </div>
  );
}

export default ModalComp;
