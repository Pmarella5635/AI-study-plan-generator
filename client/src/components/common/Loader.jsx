import React from "react";
import { Spinner } from "react-bootstrap";

const Loader = ({ size = "md", text = "" }) => {
  return (
    <div className="text-center">
      <Spinner
        animation="border"
        role="status"
        variant="primary"
        className={`spinner-${size}`}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
      {text && <p className="mt-2">{text}</p>}
    </div>
  );
};

export default Loader;
