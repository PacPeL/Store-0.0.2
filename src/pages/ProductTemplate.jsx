import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// ⬇️ Usa SOLO UNA según tu estructura:
import { getProducts } from "../services/productService";        // A) si estás en src/pages/
// import { getProducts } from "../../services/productService";   // B) si estás en src/app/pages/

import "../styles/pages/_product.scss";                          // A)
// import "../../styles/pages/_product.scss";                    // B)

const ORIGINAL_MARKUP = 0.10;  // 10% “de R$ …”
const PIX_DISCOUNT   = 0.10;   // 10% “no PIX”
const INSTALLMENTS   = 10;     // 10x sem juros

function formatBRL(v) {
  try {
    return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v ?? 0);
  } catch {
    return `R$ ${(v ?? 0).toFixed(2).replace(".", ",")}`;
  }
}

/* ==========
   ICONOS DE ESTRELLA (SVG)
   - StarIcon: dibuja una estrella (filled=true la pinta, filled=false contorno)
   - Stars: rinde 'count' estrellas con 'filled' llenas y el texto "Sem avaliações"
========== */
function StarIcon({ filled = true, size = 23, title = "Estrela" }) {
  const h = Math.round(size * (24 / 23));
  return (
    <svg
      width={size}
      height={h}
      viewBox="0 0 24 24"
      aria-hidden="true"
      role="img"
      focusable="false"
    >
      <title>{title}</title>
      {filled ? (
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.86L18.18 22 12 18.77 5.82 22 7 14.13l-5-4.86 6.91-1.01L12 2z"
          fill="#000"
        />
      ) : (
        <path
          d="M12 3.84l-2.53 5.13-.28.57-.63.09-5.66.82 4.09 3.98.46.45-.11.64-.97 5.64 5.07-2.67.57-.3.57.3 5.07 2.67-.97-5.64-.11-.64.46-.45 4.09-3.98-5.66-.82-.63-.09-.28-.57L12 3.84zm0-1.84l3.09 6.26L22 9.27l-5 4.86L18.18 22 12 18.77 5.82 22 7 14.13l-5-4.86 6.91-1.01L12 2z"
          fill="none"
          stroke="#000"
          strokeWidth="1.5"
        />
      )}
    </svg>
  );
}

function Stars({ count = 5, filled = 5 }) {
  return (
    <div className="pp__stars" aria-label={`${filled} de ${count} estrelas`}>
      {Array.from({ length: count }).map((_, i) => (
        <StarIcon key={i} filled={i < filled} />
      ))}
      <span className="pp__noReviews">Sem avaliações</span>
    </div>
  );
}

export default function ProductTemplate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading]   = useState(true);
  const [product, setProduct]   = useState(null); // {id,title,price,description,category,image}
  const [error, setError]       = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);

        if (typeof getProducts !== "function") {
          throw new Error("getProducts não está disponível (import incorreto?)");
        }
        const list = await getProducts();
        if (!Array.isArray(list)) throw new Error("getProducts não retornou um array");

        const p = list.find((it) => String(it?.id) === String(id));
        if (!mounted) return;

        if (!p) {
          setError("Produto não encontrado");
        } else {
          setProduct({
            id: Number(p.id ?? 0),
            title: String(p.title ?? "Produto"),
            price: Number(p.price ?? 0),
            description: String(p.description ?? ""),
            category: String(p.category ?? ""),
            image: String(p.image ?? "/images/placeholder.png"),
          });
        }
      } catch (e) {
        console.error("[ProductTemplate] Erro carregando produto:", e);
        if (!mounted) return;
        setError("Erro ao carregar produto");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [id]);

  const derived = useMemo(() => {
    if (!product) return null;
    const base = Number(product.price || 0);
    const original = base * (1 + ORIGINAL_MARKUP);
    const pix = base * (1 - PIX_DISCOUNT);
    const perInstallment = INSTALLMENTS > 0 ? base / INSTALLMENTS : base;

    return {
      originalText: formatBRL(original),
      pixValueNoCurrency: formatBRL(pix).replace("R$", "").trim(),
      installmentsText: INSTALLMENTS > 0
        ? `${INSTALLMENTS}x de ${formatBRL(perInstallment)} sem juros`
        : formatBRL(base),
    };
  }, [product]);

  // Handlers de iconbar (en Home abre Drawer y Search overlay; aquí navegamos)
  const openDrawer = () => navigate("/menu");
  const goSearch   = () => navigate("/search");

  if (loading) {
    return (
      <main className="productPage">
        <section className="productPage__canvas">
          <div className="productPage__loading">Carregando…</div>
        </section>
        <section className="pp__green" aria-hidden="true" />
        <div className="pp__footerBar" aria-hidden="true" />
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="productPage">
        <section className="productPage__canvas">
          <div className="productPage__notfound">
            <h1>Produto não encontrado</h1>
            <p>O item que você procura não existe ou foi removido.</p>
            <div className="row" style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button className="btn" type="button" onClick={() => navigate(-1)}>Voltar</button>
              <Link className="btn ghost" to="/">Início</Link>
            </div>
          </div>
        </section>
        <section className="pp__green" aria-hidden="true" />
        <div className="pp__footerBar" aria-hidden="true" />
      </main>
    );
  }

  return (
    <main className="productPage">
      {/* ===== Canvas Figma 1920×1080 (posiciones absolutas) ===== */}
      <section className="productPage__canvas">
        {/* ICON BAR — MISMA QUE EN HOME */}
        <aside className="iconbar" aria-label="Quick actions">
          {/* Drawer/Menu */}
          <button
            className="iconbar__btn"
            type="button"
            onClick={openDrawer}
            aria-label="Abrir menu"
          >
            <span className="iconbar__hamburger" aria-hidden="true" />
          </button>

          {/* Perfil */}
          <Link className="iconbar__btn" to="/profile" aria-label="Profile">
            <img src="/icons/icon_profile.svg" alt="" />
          </Link>

          {/* Carrito */}
          <Link className="iconbar__btn" to="/cart" aria-label="Cart">
            <img src="/icons/icon_cart.svg" alt="" />
          </Link>

          {/* Buscar */}
          <button
            className="iconbar__btn"
            type="button"
            onClick={goSearch}
            aria-label="Buscar"
          >
            <img src="/icons/icon_search.svg" alt="" />
          </button>
        </aside>

        {/* Eyebrow superior */}
        <div className="pp__maskTop">****************</div>

        {/* Título (title + category en segunda línea) */}
        <h1 className="pp__title">
          {product.title}
          {product.category ? <><br />{product.category}</> : null}
        </h1>

        {/* Imagen principal (641×641) */}
        <div className="pp__imageBox">
          <img className="pp__image" src={product.image} alt={product.title} draggable="false" />
        </div>

        {/* Meta + Precios */}
        <div className="pp__meta">
          <div className="pp__line1">{product.category || "Sem categoria"}</div>

          {/* ⭐ Estrellas (SVG) */}
          <Stars count={5} filled={5} />

          <div className="pp__priceBlock">
            <div className="pp__priceRow1">
              de <s className="pp__original">{derived?.originalText}</s> por apenas
            </div>

            <div className="pp__priceRow2">
              <span className="pp__rs">R$</span>
              <span>&nbsp;</span>
              <span className="pp__pix">{derived?.pixValueNoCurrency}</span>
              <span>&nbsp;</span>
              <span className="pp__pixTag">no PIX</span>
            </div>

            <div className="pp__priceRow3">
              ou <span className="pp__installments">{derived?.installmentsText}</span>
            </div>
          </div>
        </div>

        {/* CTA Comprar + Carrito (estrecho al costado, como Figma) */}
        <div className="pp__ctaRow">
          <button
            className="pp__buy"
            type="button"
            onClick={() => alert(`Adicionar "${product.title}" ao carrinho`)}
          >
            Comprar
          </button>

          <Link
            className="pp__cart"
            to="/cart"
            aria-label="Ir ao carrinho"
            title="Ir ao carrinho"
          >
            <img src="/icons/icon_cart.svg" alt="" />
          </Link>
        </div>
      </section>

      {/* Secciones inferiores (placeholder + footer + descripción) */}
      <section className="pp__green" aria-hidden="true" />
      <div className="pp__footerBar" aria-hidden="true" />

      {product.description && (
        <section className="pp__desc">
          <div className="pp__descWrap">
            <h2>Descrição</h2>
            <p>{product.description}</p>
          </div>
        </section>
      )}
    </main>
  );
}