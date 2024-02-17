export const Modal = (e) => {
  const toLink = () => {
    console.log(e);
    e.openBrowserAndLink(e.data.link);
  };
  return (
    <div className="modal">
      <h3>{e.data.motivation}</h3>
      <h2 onClick={toLink}>Link</h2>
      <button
        type="click"
        onClick={e.setIsModal}
        className="cross"
      >
        x
      </button>
    </div>
  );
};
