const footer = () => {
  return (
    <div
      style={{
        verticalAlign: "bottom",
        backgroundColor: "#B9B9B9",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        position: "fixed",
        height: "40px",
        width: "100%",
        bottom: "0",
      }}
    >
      <a target="_blank" href="https://icons8.com/icon/9TDdgPZF0FNr/portfolio">
        Portfolio
      </a>{" "}
      icon by{" "}
      <a target="_blank" href="https://icons8.com">
        Icons8
      </a>
    </div>
  );
};

export default footer;
