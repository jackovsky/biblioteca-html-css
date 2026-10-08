# Carregamento Neon

Biblioteca React de indicadores de carregamento em **CSS puro**, sem bibliotecas externas de estilo, com as cores neon da identidade.
Serve de base para os próximos projetos: toda ação assíncrona tem que dar resposta visual.

## Rodar a demonstração

```bash
npm install
npm run dev
```

## Gerar a biblioteca

```bash
npm run build      # cria dist/carregamento-neon.js e dist/carregamento-neon.css
```

## Usar em outro projeto React

Direto do GitHub, em qualquer PC:

```bash
npm install github:jackovsky/biblioteca-html-css
```

Ou usando a pasta local, se ela estiver ao lado do projeto:

```bash
npm install "../Biblioteca de HTML e CSS"
```

Os dois jeitos instalam o pacote com o nome `carregamento-neon`. A pasta `dist/` fica no repositório de propósito, porque é ela que o projeto instala. Depois de mexer na biblioteca, rode `npm run build` antes do commit.

Importe também o `carregamento-neon/estilo.css`.

Para começar um projeto novo já com tudo configurado, use o **projeto-base-react**.

```jsx
import { BotaoCarregando, EsqueletoTabela, useCarregamento } from 'carregamento-neon'
import 'carregamento-neon/estilo.css'

function Lista() {
  const { carregando, demorou, executar } = useCarregamento()
  const [dados, setDados] = useState([])

  const buscar = () => executar(async () => {
    const r = await fetch('/api/itens')
    setDados(await r.json())
  })

  return (
    <>
      <BotaoCarregando carregando={carregando} demorou={demorou}
        textoStatus="Carregando dados..." onClick={buscar}>
        Buscar
      </BotaoCarregando>
      {carregando ? <EsqueletoTabela linhas={5} colunas={3} /> : <Tabela dados={dados} />}
    </>
  )
}
```

## Regras que a biblioteca aplica

| Situação | Componente |
|---|---|
| Qualquer espera | `Spinner`, `Pontos` |
| Botão que dispara a ação | `BotaoCarregando`: fica desabilitado, não aceita clique duplo e mostra spinner |
| Espera passou de 2 s | texto de status automático (`textoStatus`, `StatusCarregamento`) |
| Ação com etapas / upload | `BarraProgresso` com `etapas` + `etapaAtual`, ou com `valor` de 0 a 100 |
| Listagens e tabelas | `EsqueletoTabela`, `EsqueletoTexto`, `Esqueleto` (skeleton screen) |
| Carregamento da página | `CarregadorPagina` (tela cheia, ou `local` para cobrir só uma área) |

### Hooks

- `useCarregamento({ atrasoTexto = 2000 })` retorna `{ carregando, demorou, progresso, definirProgresso, erro, executar }`.
  O `executar(fn)` ignora novas chamadas enquanto a anterior está rodando.
- `useDemora(ativo, atraso = 2000)` fica `true` só depois que o tempo passou.

### BotaoCarregando: dois modos

- **Automático:** `<BotaoCarregando aoClicar={async () => {...}}>`. O botão controla o próprio carregamento.
- **Controlado:** `carregando` e `demorou` vêm do `useCarregamento`. Use esse modo quando outro lugar da tela também precisa saber que está carregando (skeleton, formulário desabilitado etc.).

## Trocar as cores do projeto

Sobrescreva as variáveis no CSS do projeto:

```css
:root {
  --cn-neon: #39ff14;     /* verde neon */
  --cn-neon-2: #ffea00;   /* amarelo neon */
  --cn-fundo: #050505;
}
```

| Variável | Para que serve |
|---|---|
| `--cn-neon`, `--cn-neon-2` | cores principais (brilho, spinner, barra) |
| `--cn-fundo`, `--cn-superficie` | fundo da sobreposição e das áreas |
| `--cn-esqueleto`, `--cn-esqueleto-brilho` | cores do skeleton |
| `--cn-texto`, `--cn-texto-suave` | textos de status |
| `--cn-velocidade` | velocidade das animações |

Quem ativou "reduzir movimento" no sistema continua vendo os indicadores, só que mais lentos.
