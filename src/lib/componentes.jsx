import { useCarregamento, useDemora } from './useCarregamento.js'

const juntar = (...classes) => classes.filter(Boolean).join(' ')

/* ---------- Spinner ---------- */
export function Spinner({ tamanho = 'm', rotulo = 'Carregando', className, ...resto }) {
  return (
    <span
      role="status"
      className={juntar('cn-spinner', tamanho !== 'm' && `cn-spinner--${tamanho}`, className)}
      {...resto}
    >
      <span className="cn-oculto">{rotulo}</span>
    </span>
  )
}

/* ---------- Dots pulsantes ---------- */
export function Pontos({ tamanho = 'm', rotulo = 'Carregando', className, ...resto }) {
  return (
    <span
      role="status"
      className={juntar('cn-pontos', tamanho === 'p' && 'cn-pontos--p', className)}
      {...resto}
    >
      <span /><span /><span />
      <span className="cn-oculto">{rotulo}</span>
    </span>
  )
}

/* ---------- Skeleton screen ---------- */
export function Esqueleto({ largura = '100%', altura = 14, circulo = false, raio, style, className }) {
  return (
    <span
      aria-hidden="true"
      className={juntar('cn-esqueleto', circulo && 'cn-esqueleto--circulo', className)}
      style={{ width: largura, height: altura, borderRadius: raio, ...style }}
    />
  )
}

export function EsqueletoTexto({ linhas = 3, className }) {
  return (
    <div className={juntar('cn-esqueleto-texto', className)} role="status" aria-label="Carregando conteúdo">
      {Array.from({ length: linhas }, (_, i) => (
        <Esqueleto key={i} largura={i === linhas - 1 ? '60%' : '100%'} />
      ))}
    </div>
  )
}

/** Larguras variadas para parecer conteúdo real e não uma grade uniforme. */
const LARGURAS = ['85%', '60%', '75%', '45%', '90%', '55%']

export function EsqueletoTabela({ linhas = 5, colunas = 4, cabecalho = true, className }) {
  return (
    <table className={juntar('cn-esqueleto-tabela', className)} role="status" aria-label="Carregando tabela">
      {cabecalho && (
        <thead>
          <tr>
            {Array.from({ length: colunas }, (_, c) => (
              <th key={c}><Esqueleto largura="50%" altura={12} /></th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Array.from({ length: linhas }, (_, l) => (
          <tr key={l}>
            {Array.from({ length: colunas }, (_, c) => (
              <td key={c}><Esqueleto largura={LARGURAS[(l + c) % LARGURAS.length]} /></td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/* ---------- Barra de progresso ---------- */
/**
 * Com `valor` (0..100) mostra o andamento; sem valor fica indeterminada.
 * `etapas` = ['Enviando', 'Processando', 'Concluindo'] + `etapaAtual` (índice).
 */
export function BarraProgresso({ valor, etapas, etapaAtual = 0, rotulo, className }) {
  const indeterminado = valor == null && !etapas
  const pct = valor != null
    ? Math.max(0, Math.min(100, valor))
    : etapas ? Math.round((etapaAtual / etapas.length) * 100) : 0
  const texto = rotulo ?? (etapas ? etapas[etapaAtual] : undefined)

  return (
    <div className={juntar('cn-progresso', indeterminado && 'cn-progresso--indeterminado', className)}>
      <div
        className="cn-progresso__trilho"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={indeterminado ? undefined : pct}
        aria-valuetext={texto}
      >
        <div className="cn-progresso__barra" style={{ width: `${pct}%` }} />
      </div>
      {(texto || !indeterminado) && (
        <div className="cn-progresso__info">
          <span>{texto}</span>
          {!indeterminado && <span>{pct}%</span>}
        </div>
      )}
      {etapas && (
        <ol className="cn-progresso__etapas">
          {etapas.map((e, i) => (
            <li key={e} className={i < etapaAtual ? 'cn-feita' : i === etapaAtual ? 'cn-atual' : undefined}>{e}</li>
          ))}
        </ol>
      )}
    </div>
  )
}

/* ---------- Texto de status ---------- */
/** Mostra o indicador já e o texto só quando `demorou` (ou após `atraso` ms). */
export function StatusCarregamento({ ativo = true, demorou, atraso = 2000, texto = 'Carregando dados...', indicador = 'pontos' }) {
  const passou = useDemora(ativo && demorou == null, atraso)
  if (!ativo) return null
  const mostrarTexto = demorou ?? passou
  return (
    <span className="cn-status" aria-live="polite">
      {indicador === 'spinner' ? <Spinner tamanho="p" /> : <Pontos tamanho="p" />}
      {mostrarTexto && <span>{texto}</span>}
    </span>
  )
}

/* ---------- Botão ---------- */
/**
 * Modo controlado: passe `carregando` / `demorou` (vindos do useCarregamento).
 * Modo automático: passe só `aoClicar` assíncrono — o botão cuida de tudo.
 */
export function BotaoCarregando({
  carregando,
  demorou,
  aoClicar,
  onClick,
  textoStatus = 'Processando...',
  children,
  disabled,
  className,
  type = 'button',
  ...resto
}) {
  const interno = useCarregamento()
  const auto = carregando == null && aoClicar
  const ocupado = auto ? interno.carregando : !!carregando
  const lento = auto ? interno.demorou : !!demorou

  const clicar = (ev) => {
    if (ocupado) return
    if (auto) interno.executar(() => aoClicar(ev)).catch(() => {})
    else onClick?.(ev)
  }

  return (
    <button
      type={type}
      className={juntar('cn-botao', className)}
      disabled={disabled || ocupado}
      aria-busy={ocupado}
      onClick={clicar}
      {...resto}
    >
      {ocupado && <Spinner tamanho="p" rotulo={textoStatus} />}
      <span>{ocupado && lento ? textoStatus : children}</span>
    </button>
  )
}

/* ---------- Carregador de página / área ---------- */
/** Tela cheia por padrão; `local` cobre só o elemento pai (que precisa de position: relative). */
export function CarregadorPagina({ ativo, texto = 'Carregando...', atraso = 2000, local = false, indicador = 'spinner' }) {
  const demorou = useDemora(ativo, atraso)
  if (!ativo) return null
  return (
    <div className={juntar('cn-sobreposicao', local && 'cn-sobreposicao--local')} aria-busy="true" aria-live="polite">
      {indicador === 'pontos' ? <Pontos /> : <Spinner tamanho="g" rotulo={texto} />}
      {demorou && <span className="cn-status">{texto}</span>}
    </div>
  )
}
