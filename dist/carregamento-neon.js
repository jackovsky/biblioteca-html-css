import { jsxs as d, jsx as n } from "react/jsx-runtime";
import { useState as g, useRef as y, useEffect as T, useCallback as E } from "react";
function P({ atrasoTexto: e = 2e3 } = {}) {
  const [r, t] = g(!1), [o, s] = g(!1), [a, c] = g(0), [l, f] = g(null), i = y(!1), h = y(null), u = y(!0);
  T(() => (u.current = !0, () => {
    u.current = !1, clearTimeout(h.current);
  }), []);
  const p = E(async (N) => {
    if (!i.current) {
      i.current = !0, f(null), s(!1), c(0), t(!0), h.current = setTimeout(() => u.current && s(!0), e);
      try {
        return await N({ definirProgresso: c });
      } catch (b) {
        throw u.current && f(b), b;
      } finally {
        clearTimeout(h.current), i.current = !1, u.current && (t(!1), s(!1));
      }
    }
  }, [e]);
  return { carregando: r, demorou: o, progresso: a, definirProgresso: c, erro: l, executar: p };
}
function q(e, r = 2e3) {
  const [t, o] = g(!1);
  return T(() => {
    if (!e) {
      o(!1);
      return;
    }
    const s = setTimeout(() => o(!0), r);
    return () => clearTimeout(s);
  }, [e, r]), t;
}
const m = (...e) => e.filter(Boolean).join(" ");
function _({ tamanho: e = "m", rotulo: r = "Carregando", className: t, ...o }) {
  return /* @__PURE__ */ n(
    "span",
    {
      role: "status",
      className: m("cn-spinner", e !== "m" && `cn-spinner--${e}`, t),
      ...o,
      children: /* @__PURE__ */ n("span", { className: "cn-oculto", children: r })
    }
  );
}
function w({ tamanho: e = "m", rotulo: r = "Carregando", className: t, ...o }) {
  return /* @__PURE__ */ d(
    "span",
    {
      role: "status",
      className: m("cn-pontos", e === "p" && "cn-pontos--p", t),
      ...o,
      children: [
        /* @__PURE__ */ n("span", {}),
        /* @__PURE__ */ n("span", {}),
        /* @__PURE__ */ n("span", {}),
        /* @__PURE__ */ n("span", { className: "cn-oculto", children: r })
      ]
    }
  );
}
function C({ largura: e = "100%", altura: r = 14, circulo: t = !1, raio: o, style: s, className: a }) {
  return /* @__PURE__ */ n(
    "span",
    {
      "aria-hidden": "true",
      className: m("cn-esqueleto", t && "cn-esqueleto--circulo", a),
      style: { width: e, height: r, borderRadius: o, ...s }
    }
  );
}
function R({ linhas: e = 3, className: r }) {
  return /* @__PURE__ */ n("div", { className: m("cn-esqueleto-texto", r), role: "status", "aria-label": "Carregando conteúdo", children: Array.from({ length: e }, (t, o) => /* @__PURE__ */ n(C, { largura: o === e - 1 ? "60%" : "100%" }, o)) });
}
const v = ["85%", "60%", "75%", "45%", "90%", "55%"];
function B({ linhas: e = 5, colunas: r = 4, cabecalho: t = !0, className: o }) {
  return /* @__PURE__ */ d("table", { className: m("cn-esqueleto-tabela", o), role: "status", "aria-label": "Carregando tabela", children: [
    t && /* @__PURE__ */ n("thead", { children: /* @__PURE__ */ n("tr", { children: Array.from({ length: r }, (s, a) => /* @__PURE__ */ n("th", { children: /* @__PURE__ */ n(C, { largura: "50%", altura: 12 }) }, a)) }) }),
    /* @__PURE__ */ n("tbody", { children: Array.from({ length: e }, (s, a) => /* @__PURE__ */ n("tr", { children: Array.from({ length: r }, (c, l) => /* @__PURE__ */ n("td", { children: /* @__PURE__ */ n(C, { largura: v[(a + l) % v.length] }) }, l)) }, a)) })
  ] });
}
function D({ valor: e, etapas: r, etapaAtual: t = 0, rotulo: o, className: s }) {
  const a = e == null && !r, c = e != null ? Math.max(0, Math.min(100, e)) : r ? Math.round(t / r.length * 100) : 0, l = o ?? (r ? r[t] : void 0);
  return /* @__PURE__ */ d("div", { className: m("cn-progresso", a && "cn-progresso--indeterminado", s), children: [
    /* @__PURE__ */ n(
      "div",
      {
        className: "cn-progresso__trilho",
        role: "progressbar",
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        "aria-valuenow": a ? void 0 : c,
        "aria-valuetext": l,
        children: /* @__PURE__ */ n("div", { className: "cn-progresso__barra", style: { width: `${c}%` } })
      }
    ),
    (l || !a) && /* @__PURE__ */ d("div", { className: "cn-progresso__info", children: [
      /* @__PURE__ */ n("span", { children: l }),
      !a && /* @__PURE__ */ d("span", { children: [
        c,
        "%"
      ] })
    ] }),
    r && /* @__PURE__ */ n("ol", { className: "cn-progresso__etapas", children: r.map((f, i) => /* @__PURE__ */ n("li", { className: i < t ? "cn-feita" : i === t ? "cn-atual" : void 0, children: f }, f)) })
  ] });
}
function M({ ativo: e = !0, demorou: r, atraso: t = 2e3, texto: o = "Carregando dados...", indicador: s = "pontos" }) {
  const a = q(e && r == null, t);
  return e ? /* @__PURE__ */ d("span", { className: "cn-status", "aria-live": "polite", children: [
    s === "spinner" ? /* @__PURE__ */ n(_, { tamanho: "p" }) : /* @__PURE__ */ n(w, { tamanho: "p" }),
    (r ?? a) && /* @__PURE__ */ n("span", { children: o })
  ] }) : null;
}
function S({
  carregando: e,
  demorou: r,
  aoClicar: t,
  onClick: o,
  textoStatus: s = "Processando...",
  children: a,
  disabled: c,
  className: l,
  type: f = "button",
  ...i
}) {
  const h = P(), u = e == null && t, p = u ? h.carregando : !!e, N = u ? h.demorou : !!r, b = (x) => {
    p || (u ? h.executar(() => t(x)).catch(() => {
    }) : o?.(x));
  };
  return /* @__PURE__ */ d(
    "button",
    {
      type: f,
      className: m("cn-botao", l),
      disabled: c || p,
      "aria-busy": p,
      onClick: b,
      ...i,
      children: [
        p && /* @__PURE__ */ n(_, { tamanho: "p", rotulo: s }),
        /* @__PURE__ */ n("span", { children: p && N ? s : a })
      ]
    }
  );
}
function k({ ativo: e, texto: r = "Carregando...", atraso: t = 2e3, local: o = !1, indicador: s = "spinner" }) {
  const a = q(e, t);
  return e ? /* @__PURE__ */ d("div", { className: m("cn-sobreposicao", o && "cn-sobreposicao--local"), "aria-busy": "true", "aria-live": "polite", children: [
    s === "pontos" ? /* @__PURE__ */ n(w, {}) : /* @__PURE__ */ n(_, { tamanho: "g", rotulo: r }),
    a && /* @__PURE__ */ n("span", { className: "cn-status", children: r })
  ] }) : null;
}
export {
  D as BarraProgresso,
  S as BotaoCarregando,
  k as CarregadorPagina,
  C as Esqueleto,
  B as EsqueletoTabela,
  R as EsqueletoTexto,
  w as Pontos,
  _ as Spinner,
  M as StatusCarregamento,
  P as useCarregamento,
  q as useDemora
};
