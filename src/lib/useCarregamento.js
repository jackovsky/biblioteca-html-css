import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Controla uma ação assíncrona (AJAX, envio de formulário, upload...).
 *
 *   const { carregando, demorou, executar } = useCarregamento()
 *   <BotaoCarregando carregando={carregando} demorou={demorou}
 *     onClick={() => executar(() => fetch('/api'))}>Buscar</BotaoCarregando>
 *
 * - carregando: true enquanto a ação roda
 * - demorou:    true quando passou de `atrasoTexto` ms (padrão 2 s) -> mostrar texto de status
 * - executar:   roda a função; ignora novos cliques enquanto a anterior não terminou
 * - progresso / definirProgresso: 0..100 para ações com etapas
 */
export function useCarregamento({ atrasoTexto = 2000 } = {}) {
  const [carregando, setCarregando] = useState(false)
  const [demorou, setDemorou] = useState(false)
  const [progresso, definirProgresso] = useState(0)
  const [erro, setErro] = useState(null)
  const emAndamento = useRef(false)
  const timer = useRef(null)
  const montado = useRef(true)

  useEffect(() => {
    montado.current = true
    return () => {
      montado.current = false
      clearTimeout(timer.current)
    }
  }, [])

  const executar = useCallback(async (acao) => {
    if (emAndamento.current) return undefined // trava o clique duplo
    emAndamento.current = true
    setErro(null)
    setDemorou(false)
    definirProgresso(0)
    setCarregando(true)
    timer.current = setTimeout(() => montado.current && setDemorou(true), atrasoTexto)

    try {
      return await acao({ definirProgresso })
    } catch (e) {
      if (montado.current) setErro(e)
      throw e
    } finally {
      clearTimeout(timer.current)
      emAndamento.current = false
      if (montado.current) {
        setCarregando(false)
        setDemorou(false)
      }
    }
  }, [atrasoTexto])

  return { carregando, demorou, progresso, definirProgresso, erro, executar }
}

/** Fica true só depois que `ativo` passou `atraso` ms ligado. */
export function useDemora(ativo, atraso = 2000) {
  const [demorou, setDemorou] = useState(false)
  useEffect(() => {
    if (!ativo) {
      setDemorou(false)
      return undefined
    }
    const t = setTimeout(() => setDemorou(true), atraso)
    return () => clearTimeout(t)
  }, [ativo, atraso])
  return demorou
}
