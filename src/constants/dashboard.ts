import { v4 } from 'uuid'

type Props = {
  id: string
  label: string
  subLabel: string
  description: string
}

export const DASHBOARD_CARDS: Props[] = [
  {
    id: v4(),
    label: 'Configurar Respostas Automáticas',
    subLabel: 'Envie uma linha de produtos através do DM do Instagram',
    description: 'Mostre seus produtos aos seguidores diretamente nas mensagens privadas e aumente o engajamento.'
  },
  {
    id: v4(),
    label: 'Exibir Produtos para Seguidores',
    subLabel: 'Mostre seus produtos em diversos locais no Instagram',
    description: 'Apresente seus produtos em comentários e mensagens diretas, alcançando mais pessoas de forma estratégica.'
  },
  {
    id: v4(),
    label: 'Responder Perguntas com IA',
    subLabel: 'Identifique e responda a perguntas com Inteligência Artificial',
    description: 'A IA detecta automaticamente a intenção da mensagem, proporcionando respostas rápidas e precisas.'
  },
  {
    id: v4(),
    label: 'Detecção Automática de Intenção',
    subLabel: 'Entenda automaticamente o que seu seguidor quer saber',
    description: 'A intenção da mensagem será identificada automaticamente, permitindo respostas mais inteligentes e personalizadas.'
  }
]
