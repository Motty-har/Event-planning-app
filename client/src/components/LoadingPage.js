import React from "react";
import { css } from "@emotion/react";
import { ClipLoader } from "react-spinners";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const LoadingPage = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h2>Loading...</h2>
        <ClipLoader color={"#36D7B7"} loading={true} css={override} size={50} />
      </div>
    </div>
  );
};

export default LoadingPage;
