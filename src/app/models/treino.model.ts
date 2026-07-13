export interface Exercicio {
  nome: string;
  series: number;
  repeticoes: number;
  cargaRecomendada?: string; // Ex: "15kg de cada lado"
  carga?: string;
  dataExecucao?: string; // Ex: "2026-07-01" ou "Segunda-feira"
  concluido?: boolean;
}

export interface Treino {
  id: string;
  alunoId: string;
  professorId: string;
  titulo: string; // Ex: "Treino A - Peito e Tríceps"
  exercicios: Exercicio[];
  dataAtualizacao: Date | string;
}