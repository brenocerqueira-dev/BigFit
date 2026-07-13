import { Usuario } from './usuario.model';

export interface Aluno extends Usuario {
  peso: number; // em kg (ex: 80.5)
  altura: number; // em metros (ex: 1.75)
  imc?: number; // Calculado automaticamente
  meta: string; // Ex: "Hipertrofia", "Emagrecimento"
  planoId?: string; // Referência ao plano assinado
}