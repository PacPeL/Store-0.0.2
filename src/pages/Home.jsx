import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Drawer from "../components/drawer/Drawer";
import HeaderSearch from "../components/header/HeaderSearch";
import "../styles/pages/_home.scss";

export default function Home() {
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCatalogOpen, setIsCatalogOpen] = useState(false);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [q, setQ] = useState("");

  const searchInputRef = useRef(null);

  const products = useMemo(
    () =>
      Array.from({ length: 8 }).map((_, i) => ({
        id: i + 1,
        name: "Chuteira Campo",
        price: "R$ 709,99",
        image: "/images/boots.png",
      })),
    []
  );

  const openDrawer = () => {
    setIsDrawerOpen(true);
    setIsSearchOpen(false);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setIsCatalogOpen(false);
  };

  const toggleCatalog = () => setIsCatalogOpen((v) => !v);

  const toggleSearch = () => {
    setIsSearchOpen((v) => !v);
    setIsDrawerOpen(false);
    setIsCatalogOpen(false);
  };

  const handleScrollToNews = () => {
    const el = document.getElementById("novidades");
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isSearchOpen]);

  // ESC closes overlays
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsSearchOpen(false);
        closeDrawer();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    const value = q.trim();
    if (!value) return;
    navigate(`/search?q=${encodeURIComponent(value)}`);
    setIsSearchOpen(false);
  };

  return (
    <main className="home">
      {/* HEADER SEARCH (component) */}
      <HeaderSearch
        isOpen={isSearchOpen}
        value={q}
        onChange={setQ}
        onSubmit={submitSearch}
        onClose={() => setIsSearchOpen(false)}
        inputRef={searchInputRef}
      />

      {/* DRAWER (component) */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        isCatalogOpen={isCatalogOpen}
        onToggleCatalog={toggleCatalog}
      />

      {/* HERO */}
      <section className="hero">
        <div className="hero__wrap">
          <div className="hero__left">
            <div className="hero__mask">****************</div>

            <h1 className="hero__title">GMA D’or</h1>

            <div className="hero__line hero__line--upper">****************</div>
            <div className="hero__line">****************</div>

            <button className="hero__cta" type="button" onClick={handleScrollToNews}>
              COMPRAR
            </button>
          </div>

          <div className="hero__right">
            <Link to="/product/1" className="hero__productLink" aria-label="Ver produto destaque">
              <img
                className="hero__product"
                src="/images/golden_boots.png"
                alt="Golden boots"
                draggable="false"
              />
            </Link>
          </div>

          {/* ICON BAR */}
          <aside className="iconbar" aria-label="Quick actions">
            {/* Drawer button */}
            <button
              className="iconbar__btn"
              type="button"
              onClick={openDrawer}
              aria-label="Abrir menu"
              aria-expanded={isDrawerOpen}
            >
              <span className="iconbar__hamburger" aria-hidden="true" />
            </button>

            <Link className="iconbar__btn" to="/profile" aria-label="Profile">
              <img src="/icons/icon_profile.svg" alt="" />
            </Link>

            <Link className="iconbar__btn" to="/cart" aria-label="Cart">
              <img src="/icons/icon_cart.svg" alt="" />
            </Link>

            {/* Search toggle */}
            <button
              className="iconbar__btn"
              type="button"
              onClick={toggleSearch}
              aria-label="Buscar"
              aria-expanded={isSearchOpen}
            >
              <img src="/icons/icon_search.svg" alt="" />
            </button>
          </aside>
        </div>
      </section>

      {/* NOVAS */}
      <section className="novas" id="novidades">
        <div className="novas__wrap">
          <div className="novas__perks">
            <p className="novas__perk">
              <strong>FRETE GRÁTIS</strong> para compras acima de <strong>R$ 200!</strong>
            </p>
            <p className="novas__perk">
              <strong>Envio rápido</strong> para todo o <strong>Brasil!</strong>
            </p>
            <p className="novas__perk">
              <strong>20% OFF</strong> na sua primeira <strong>compra!</strong>
            </p>
          </div>

          <div className="novas__titlebox">
            <h2 className="novas__title">Novidades</h2>
            <p className="novas__subtitle">Confira já!</p>
          </div>

          <div className="grid">
            {products.map((p) => (
              <Link
                key={p.id}
                to={`/product/${p.id}`}
                className="card cardLink"
                aria-label={`Ver ${p.name}`}
              >
                <img className="card__img" src={p.image} alt={p.name} draggable="false" />
                <div className="card__info">
                  <div className="card__name">{p.name}</div>
                  <div className="card__price">{p.price}</div>
                </div>
              </Link>
            ))}
          </div>

          <div className="banner">
            <img
              className="banner__img"
              src="/images/background_stadium.png"
              alt="Stadium"
              draggable="false"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
