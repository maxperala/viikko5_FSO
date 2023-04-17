const Notification = ({ message, success, show }) => {
  const style = {
    color: success ? "green" : "red",
    background: "lightgrey",
    fontSize: 20,
    borderStyle: "solid",
    borderRadius: 5,
    padding: 10,
    fontWeight: "bold",
    display: show ? "" : "none",
  };
  return (
    <div style={style}>
      <h2>{message}</h2>
    </div>
  );
};

export default Notification;
