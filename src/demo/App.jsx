import { useEffect, useState } from 'react'
import {
  Spinner,
  Pontos,
  Esqueleto,
  EsqueletoTexto,
  EsqueletoTabela,
  BarraProgresso,
  StatusCarregamento,
  BotaoCarregando,
  CarregadorPagina,
  useCarregamento,
} from '../lib/index.js'

// Simula a espera de um servidor
const esperar = (ms) => new Promise((r) => setTimeout(r, ms))

const ALUNOS = [
  ['Ana Souza', 'Sala 12', '08:00', 'Colocado'],
  ['Bruno Lima', 'Lab 3', '09:30', 'Pendente'],
  ['Carla Dias', 'Auditório', '10:00', 'Retirado'],
  ['Diego Alves', 'Sala 7', '13:30', 'Pendente'],
  ['Elisa Rocha', 'Sala 21', '19:00', 'Colocado'],
]

export default function App() {
  const [paginaCarregando, setPaginaCarregando] = useState(true)

  // carregamento inicial da página
  useEffect(() => {
    const t = setTimeout(() => setPaginaCarregando(false), 1200)
    return () => clearTimeout(t)
  }, [])

  return (
    <>
      <CarregadorPagina ativo={paginaCarregando} texto="Carregando página..." />
      <main className="demo">
        <header>
          <h1>Carregamento <span>Neon</span></h1>
          <p>Indicadores de carregamento em CSS puro para React. Toda ação assíncrona dá resposta visual.</p>
        </header>

        <Secao titulo="Indicadores básicos">
          <div className="demo-linha">
            <Spinner tamanho="p" /><Spinner /><Spinner tamanho="g" />
            <Pontos tamanho="p" /><Pontos />
            <StatusCarregamento demorou texto="Carregando dados..." />
          </div>
        </Secao>

        <Secao titulo="Requisição AJAX (botão trava + texto após 2 s)">
          <DemoAjax />
        </Secao>

        <Secao titulo="Envio de formulário">
          <DemoFormulario />
        </Secao>

        <Secao titulo="Upload com etapas (barra de progresso)">
          <DemoUpload />
        </Secao>

        <Secao titulo="Listagem / tabela (skeleton screen)">
          <DemoTabela />
        </Secao>

        <Secao titulo="Cartão (skeleton)">
          <DemoCartao />
        </Secao>
      </main>
    </>
  )
}

function Secao({ titulo, children }) {
  return (
    <section className="demo-secao">
      <h2>{titulo}</h2>
      {children}
    </section>
  )
}

function DemoAjax() {
  const [resultado, setResultado] = useState(null)
  return (
    <div className="demo-linha">
      {/* modo automático: o botão controla tudo sozinho */}
      <BotaoCarregando
        textoStatus="Carregando dados..."
        aoClicar={async () => {
          setResultado(null)
          await esperar(3500)
          setResultado('12 agendamentos encontrados.')
        }}
      >
        Buscar agendamentos
      </BotaoCarregando>
      {resultado && <span className="demo-ok">✓ {resultado}</span>}
    </div>
  )
}

function DemoFormulario() {
  const { carregando, demorou, executar } = useCarregamento()
  const [salvo, setSalvo] = useState(false)

  const enviar = (ev) => {
    ev.preventDefault()
    setSalvo(false)
    executar(async () => {
      await esperar(2800)
      setSalvo(true)
    })
  }

  return (
    <form className="demo-form" onSubmit={enviar}>
      <fieldset disabled={carregando}>
        <input placeholder="Nome" defaultValue="Ana Souza" />
        <input placeholder="Sala" defaultValue="Sala 12" />
      </fieldset>
      <div className="demo-linha">
        <BotaoCarregando type="submit" carregando={carregando} demorou={demorou} textoStatus="Salvando...">
          Salvar
        </BotaoCarregando>
        {salvo && <span className="demo-ok">✓ Salvo</span>}
      </div>
    </form>
  )
}

const ETAPAS = ['Preparando', 'Enviando arquivo', 'Processando', 'Concluído']

function DemoUpload() {
  const { carregando, demorou, executar } = useCarregamento()
  const [etapa, setEtapa] = useState(-1)

  const enviar = () =>
    executar(async () => {
      for (let i = 0; i < ETAPAS.length; i++) {
        setEtapa(i)
        await esperar(1100)
      }
    })

  return (
    <div className="demo-coluna">
      <BotaoCarregando carregando={carregando} demorou={demorou} textoStatus="Enviando..." onClick={enviar}>
        Enviar arquivo
      </BotaoCarregando>
      {etapa >= 0 && (
        <BarraProgresso etapas={ETAPAS} etapaAtual={carregando ? etapa : ETAPAS.length - 1} valor={carregando ? undefined : 100} />
      )}
    </div>
  )
}

function DemoTabela() {
  const { carregando, executar } = useCarregamento()
  const [dados, setDados] = useState(null)

  const carregar = () =>
    executar(async () => {
      setDados(null)
      await esperar(2500)
      setDados(ALUNOS)
    })

  useEffect(() => { carregar() }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="demo-coluna">
      <BotaoCarregando carregando={carregando} textoStatus="Carregando dados..." onClick={carregar}>
        Recarregar lista
      </BotaoCarregando>
      {carregando || !dados ? (
        <EsqueletoTabela linhas={5} colunas={4} />
      ) : (
        <table className="demo-tabela">
          <thead>
            <tr><th>Professor</th><th>Local</th><th>Horário</th><th>Situação</th></tr>
          </thead>
          <tbody>
            {dados.map((l) => (
              <tr key={l[0]}>{l.map((c) => <td key={c}>{c}</td>)}</tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}

function DemoCartao() {
  const [pronto, setPronto] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setPronto(true), 3000)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="demo-cartao">
      {pronto ? (
        <>
          <div className="demo-avatar">J</div>
          <div>
            <strong>Jackão Alves</strong>
            <p>Games, humor e notícias. Conteúdo novo toda semana.</p>
          </div>
        </>
      ) : (
        <>
          <Esqueleto circulo largura={56} altura={56} />
          <div style={{ flex: 1 }}>
            <Esqueleto largura="40%" altura={16} style={{ marginBottom: 12 }} />
            <EsqueletoTexto linhas={2} />
          </div>
        </>
      )}
    </div>
  )
}
