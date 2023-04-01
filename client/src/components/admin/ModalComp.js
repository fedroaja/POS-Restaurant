import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

function ModalComp(props) {
  const [validated, setValidated] = useState(false);

  async function submitHandler(event) {
    setValidated(true);
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      return;
    }

    switch (props.fgModal) {
      case "product":
        {
          const myData = {
            productId: props.fgMode == "I" ? 0 : props.productId,
            productCode: form.productCode.value,
            productName: form.productName.value,
            productCtg: form.productCtg.value,
            productPrice: form.productPrice.value,
            productActive: form.productActive.checked,
            fgMode: props.fgMode,
          };
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
            if (data.ECode !== 0) {
              alert(data.EMsg);
              return;
            }

            props.setData((prev) => [...prev, data.product[0]]);

            props.onHide(true);
          });
        }
        break;
      case "category":
        break;
      default:
        break;
    }
  }

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      title={props.title}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.title}
        </Modal.Title>
      </Modal.Header>
      {props.fgModal == "product" ? (
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
                disabled={props.fgMode === "E"}
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
              <Form.Select name="productCtg" required>
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
                defaultValue={0}
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
                disabled={props.fgMode === "I"}
                checked={true}
                name="productActive"
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="primary" type="submit" size="lg">
                Save
              </Button>
              <Button variant="danger" onClick={props.onHide} size="lg">
                Close
              </Button>
            </div>
          </Form>
        </Modal.Body>
      ) : (
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
                disabled={props.fgMode == "E"}
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
              <Button variant="primary" type="submit" size="lg">
                Save
              </Button>
              <Button variant="danger" onClick={props.onHide} size="lg">
                Close
              </Button>
            </div>
          </Form>
        </Modal.Body>
      )}
    </Modal>
  );
}

export default ModalComp;
