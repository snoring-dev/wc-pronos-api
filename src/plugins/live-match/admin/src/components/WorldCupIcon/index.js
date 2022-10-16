import React from "react";

function Worldcup() {
  return (
    <div
      style={{
        padding: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 200,
        height: 200,
        margin: "auto",
      }}
    >
      <img
        src="https://res.cloudinary.com/dfvv4obnz/image/upload/v1665942273/2022_FIFA_World_Cup_yooqkp.svg"
        alt="qatar-world-cum-2022"
        style={{
          maxWidth: "100%",
          maxHeight: "100%",
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}

export default Worldcup;
