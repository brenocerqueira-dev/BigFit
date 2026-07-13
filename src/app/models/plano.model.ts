export interface Plano {
  id: string;
  alunoId: string; 
  nome: string;
  valor: number;
  duracaoMeses: number;
  descricao: string;
  dataInicio?: string;
  dataFim?: string;
}