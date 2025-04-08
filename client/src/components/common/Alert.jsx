import React from "react";
import { Alert as BootstrapAlert } from "react-bootstrap";

const Alert = ({ variant = "info", children }) => {
  return (
    <BootstrapAlert variant={variant} className="mb-4">
      {children}
    </BootstrapAlert>
  );
};

export default Alert;
