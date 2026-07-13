export type Role = 'ADMIN' | 'ALUNO' | 'PROFESSOR';

export interface Usuario {
  id: string; 
  nome: string;
  email: string;
  senha?: string; 
  role: Role;
  dataCriacao: Date | string;
}