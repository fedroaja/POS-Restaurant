import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Loading from "../Loading";

function ModalComp(props) {
  const [validated, setValidated] = useState(false);
  const [isLoad, setLoad] = useState("N");

  console.log(props.dataEdit[0]);

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
      case "table": {
        const myData = {
          tableId:
            props.modalProps[0].fgMode == "I" ? 0 : props.dataEdit[0].table_id,
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
      default:
        break;
    }
  }

  function modalBody() {
    switch (props.modalProps[0].fgModal) {
      case "product":
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
        break;
      case "category":
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
        break;
      case "table":
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
        backdrop={isLoad == "Y" ? "static" : true}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {props.modalProps[0].title}
          </Modal.Title>
        </Modal.Header>
        {modalBody()}
      </Modal>
    </div>
  );
}

export default ModalComp;