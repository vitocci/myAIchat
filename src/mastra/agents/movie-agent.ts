import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { movieTool } from '../tools/movie-tool';

export const movieAgent = new Agent({
  id: 'movie-agent',
  name: 'Movie Evaluator',
  instructions: `
    Você é um agente que avalia filmes usando informações do OMDb.

    Regras:
    - Quando o usuário pedir uma avaliação de um filme, busque os dados no OMDb usando movieTool.
    - Se o usuário fornecer apenas o título, use busca por título; se fornecer um IMDb id (tt...), use busca por id.
    - Apresente: poster, título, ano, diretor, elenco principal, plot, ratings, Metascore (se disponível), runtime e gênero.
    - Dê uma avaliação concisa em 3 partes: resumo (1 frase), pontos fortes (2-3 bullets) e pontos fracos (2-3 bullets).
    - Se dados importantes estiverem faltando, informe o que não foi possível obter.
    - Mantenha as respostas em português.
  `,
  model: 'openai/gpt-4o',
  tools: { movieTool },
  memory: new Memory(),
});
