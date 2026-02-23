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
  const [product, setProduct]   = useState(null);
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

    const pixText = formatBRL(pix);
    const pixNoCurrency = pixText.replace("R$", "").trim();

    return {
      originalText: formatBRL(original),
      pixValueNoCurrency: pixNoCurrency,
      installments: {
        n: INSTALLMENTS,
        per: formatBRL(perInstallment).replace("R$", "").trim(),
      },
      installmentsText: INSTALLMENTS > 0
        ? `${INSTALLMENTS}x de ${formatBRL(perInstallment)} sem juros`
        : formatBRL(base),
    };
  }, [product]);

  const openDrawer = () => navigate("/menu");
  const goSearch   = () => navigate("/search");

  const handleBuy = () => {
    alert(`Adicionar "${product?.title}" ao carrinho`);
  };

  if (loading) {
    return (
      <main className="productPage">
        <section className="productPage__wrap">
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
        <section className="productPage__wrap">
          <div className="productPage__notfound">
            <h1>Produto não encontrado</h1>
            <p>O item que você procura não existe ou foi removido.</p>
            <div className="pp__nfRow">
              <button className="pp__btn" type="button" onClick={() => navigate(-1)}>Voltar</button>
              <Link className="pp__btn ghost" to="/">Início</Link>
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
      <section className="productPage__wrap">
        {/* ICON BAR */}
        <aside className="iconbar" aria-label="Quick actions">
          <button className="iconbar__btn" type="button" onClick={openDrawer} aria-label="Abrir menu">
            <span className="iconbar__hamburger" aria-hidden="true" />
          </button>

          <Link className="iconbar__btn" to="/profile" aria-label="Profile">
            <img src="/icons/icon_profile.svg" alt="" />
          </Link>

          <Link className="iconbar__btn" to="/cart" aria-label="Cart">
            <img src="/icons/icon_cart.svg" alt="" />
          </Link>

          <button className="iconbar__btn" type="button" onClick={goSearch} aria-label="Buscar">
            <img src="/icons/icon_search.svg" alt="" />
          </button>
        </aside>

        {/* Layout “Figma-like” pero fluido */}
        <div className="pp__top">
          {/* Left */}
          <div className="pp__left">
            <div className="pp__maskTop">****************</div>

            <h1 className="pp__title">
              {product.title}
              {product.category ? <><br />{product.category}</> : null}
            </h1>

            <div className="pp__meta">
              <div className="pp__line1">{product.category || "Sem categoria"}</div>
              <Stars count={5} filled={5} />

              <div className="pp__priceBlock">
                <div className="pp__priceRow1">
                  <span className="pp__de">de </span>
                  <s className="pp__original">{derived?.originalText}</s>
                  <span className="pp__space"> </span>
                  <span className="pp__porApenas">por apenas</span>
                </div>

                <div className="pp__priceRow2">
                  <span className="pp__rs">R$</span>
                  <span className="pp__space"> </span>
                  <span className="pp__pix">{derived?.pixValueNoCurrency}</span>
                  <span className="pp__space"> </span>
                  <span className="pp__no">no </span>
                  <span className="pp__pixWord">PIX</span>
                </div>

                <div className="pp__priceRow3">
                  <span className="w400">ou</span>
                  <span className="w500"> </span>
                  <span className="w600">{derived?.installments?.n ?? INSTALLMENTS}x </span>
                  <span className="w400">de</span>
                  <span className="w500"> </span>
                  <span className="w600">{derived?.installments?.per ?? ""} </span>
                  <span className="w400">sem juros</span>
                </div>
              </div>

              <div className="pp__ctaRow">
                <button className="pp__buy" type="button" onClick={handleBuy}>
                  Comprar
                </button>

                <Link className="pp__cart" to="/cart" aria-label="Ir ao carrinho" title="Ir ao carrinho">
                  <img src="/icons/icon_cart.svg" alt="" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="pp__right">
            <div className="pp__imageBox">
              <img className="pp__image" src={product.image} alt={product.title} draggable="false" />
            </div>
          </div>
        </div>
      </section>

      {/* Secciones inferiores */}
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
