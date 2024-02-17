export const Modal = (e) => {
  return (
    <div className="modal">
      <h3>{e.data.motivation}</h3>
      <h2>
        <a href={e.data.link}>Link</a>
      </h2>
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
