import React from "react";
import ReactLoading from "react-loading";

function Loading(props) {
  return (
    <div className="loading">
      <ReactLoading
        type={props.type}
        color={"#674188"}
        height={props.size}
        width={props.size}
      />
    </div>
  );
}

export default Loading;
