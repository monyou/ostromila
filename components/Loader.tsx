const GlobalLoader = () => {
  return (
    <div
      css={{
        position: "fixed",
        width: "100vw",
        height: "100vh",
        top: 0,
        left: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        zIndex: 9999,
      }}
    >
      <div
        css={{
          display: "inline-block",
          position: "absolute",
          width: 80,
          height: 80,
          top: " 50%",
          left: " 50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10000,

          "::after": {
            content: "''",
            position: "relative",
            display: "block",
            width: 64,
            height: 64,
            margin: 8,
            borderRadius: "50%",
            border: "6px solid #fff",
            borderColor: "#fff transparent #fff transparent",
            animation: "rotate 1.2s linear infinite",
          },
        }}
      />
    </div>
  );
};

export default GlobalLoader;
