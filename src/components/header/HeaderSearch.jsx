import "./_headerSearch.scss";

export default function HeaderSearch({
  isOpen,
  value,
  onChange,
  onSubmit,
  onClose,
  inputRef,
}) {
  return (
    <div
      className={`searchbar ${isOpen ? "is-open" : ""}`}
      role="dialog"
      aria-label="Search"
      aria-hidden={!isOpen}
    >
      <div className="searchbar__inner">
        <form className="searchbar__form" onSubmit={onSubmit}>
          <input
            ref={inputRef}
            className="searchbar__input"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos"
          />

          <button className="searchbar__submit" type="submit">
            Buscar
          </button>

          <button
            className="searchbar__close"
            type="button"
            onClick={onClose}
            aria-label="Fechar busca"
          >
            ✕
          </button>
        </form>
      </div>
    </div>
  );
}
