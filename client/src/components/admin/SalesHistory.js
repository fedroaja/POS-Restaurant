import React, { useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PaidIcon from "@mui/icons-material/Paid";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const style = {
  boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
  transition: "0.3s",
  margin: 6,
  padding: 8,
  height: "auto",
  borderRadius: "5px",
  borderLeft: "10px solid rgb(0 255 109 / 79%)",
};

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

function SalesHistory(props) {
  const state = {
    items: props.data,
    hasMore: false,
  };

  const arrayUniqueByKey = [
    ...new Map(state.items.map((item) => [item["invoice_id"], item])).values(),
  ];

  //  function fetchMoreData(){
  //       if (state.items.length >= 500) {
  //         setState({ hasMore: false });
  //         return;
  //       }
  //       // a fake async api call like which sends
  //       // 20 more records in .5 secs
  //       setTimeout(() => {
  //         setState({
  //           items: state.items.concat(Array.from({ length: 20 }))
  //         });
  //       }, 500);
  //     };
  return (
    <div className="fullArea">
      {state.items.length > 0 ? (
        <InfiniteScroll
          dataLength={state.items.length}
          hasMore={state.hasMore}
          loader={<h6>Loading...</h6>}
          className="scrollbar"
          height={360}
        >
          {arrayUniqueByKey.map((i, index) => (
            <div style={style} key={index}>
              <Row style={{ marginTop: "5%" }}>
                <Col>
                  <h4>{i.invoice_code}</h4>
                </Col>
                <Col></Col>
                <Col>
                  <small>{new Date(i.upddate).toLocaleDateString()}</small>
                </Col>
              </Row>
              <hr></hr>
              {state.items
                .filter((x) => x.invoice_id == i.invoice_id && x.trans_id)
                .map((y, idx) => (
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
              <hr></hr>
              <Row>
                <Col></Col>
                <Col></Col>
                <Col>
                  <small>
                    Total :{" "}
                    {state.items
                      .filter((x) => x.invoice_id == i.invoice_id && x.trans_id)
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
                    {state.items
                      .filter((x) => x.invoice_id == i.invoice_id && x.trans_id)
                      .reduce(
                        (prev, { trans_amount }) => prev + trans_amount,
                        0
                      )
                      .toLocaleString("id-ID")}
                  </small>
                </Col>
              </Row>
              <br></br>
            </div>
          ))}
        </InfiniteScroll>
      ) : (
        <h3 className="centerEl">No Data</h3>
      )}
    </div>
  );
}

export default SalesHistory;
