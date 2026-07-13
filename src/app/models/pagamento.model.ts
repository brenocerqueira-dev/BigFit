export type StatusPagamento = 'PAGO' | 'PENDENTE' | 'ATRASADO';

export interface Pagamento {
  id: string;
  alunoId: string;
  planoId: string;
  valorPago: number;
  dataVencimento: Date | string;
  dataPagamento?: Date | string;
  status: StatusPagamento;
}