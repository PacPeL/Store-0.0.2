import { Link } from "react-router-dom";
import "./_drawer.scss";

export default function Drawer({
  isOpen,
  onClose,
  isCatalogOpen,
  onToggleCatalog,
}) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`drawerOverlay ${isOpen ? "is-open" : ""}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Drawer */}
      <aside
        className={`drawer ${isOpen ? "is-open" : ""}`}
        role="dialog"
        aria-label="Menu lateral"
        aria-hidden={!isOpen}
      >
        <div className="drawer__head">
          <div className="drawer__title">Menu</div>
          <button
            className="drawer__close"
            type="button"
            onClick={onClose}
            aria-label="Fechar menu"
          >
            ✕
          </button>
        </div>

        <nav className="drawer__nav" onClick={(e) => e.stopPropagation()}>
          {/* Catálogo */}
          <button
            className={`drawer__item drawer__item--toggle ${
              isCatalogOpen ? "is-open" : ""
            }`}
            type="button"
            onClick={onToggleCatalog}
            aria-expanded={isCatalogOpen}
          >
            <span>Catálogo</span>
            <span className="drawer__chev" aria-hidden="true">
              ▾
            </span>
          </button>

          <div className={`drawer__sub ${isCatalogOpen ? "is-open" : ""}`}>
            <Link className="drawer__subitem" to="/category/pants" onClick={onClose}>
              Pantalones
            </Link>
            <Link className="drawer__subitem" to="/category/products" onClick={onClose}>
              Produtos
            </Link>
            <Link className="drawer__subitem" to="/category/shirts" onClick={onClose}>
              Camisas
            </Link>
            <Link className="drawer__subitem" to="/category/shoes" onClick={onClose}>
              Zapatos
            </Link>
          </div>

          <div className="drawer__sep" />

          <Link className="drawer__item" to="/settings" onClick={onClose}>
            Settings
          </Link>
          <Link className="drawer__item" to="/profile" onClick={onClose}>
            Profiles
          </Link>
          <Link className="drawer__item" to="/wishlist" onClick={onClose}>
            Wishlist
          </Link>

          {/* Extras */}
          <Link className="drawer__item" to="/orders" onClick={onClose}>
            Orders
          </Link>
          <Link className="drawer__item" to="/support" onClick={onClose}>
            Support
          </Link>
        </nav>
      </aside>
    </>
  );
}
