import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DatabaseService } from '../../../services/database.service';
import { Plano } from '../../../models/plano.model';
import { Aluno } from '../../../models/aluno.model';

@Component({
  selector: 'app-planos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './planos.component.html',
  styleUrl: './planos.component.css'
})
export class PlanosComponent implements OnInit {
  planoForm: FormGroup;
  planos: Plano[] = [];
  alunos: Aluno[] = [];


  tabelaPrecos = {
    'DIARIA': { nome: 'Diária', valor: 20, duracaoMeses: 0 },
    'MENSAL': { nome: 'Plano Mensal', valor: 100, duracaoMeses: 1 },
    'TRIMESTRAL': { nome: 'Plano Trimestral', valor: 300, duracaoMeses: 3 },
    'ANUAL': { nome: 'Plano Anual', valor: 1200, duracaoMeses: 12 }
  };

  constructor(
    private fb: FormBuilder,
    private db: DatabaseService
  ) {
    this.planoForm = this.fb.group({
      alunoId: ['', Validators.required],
      tipoPlano: ['', Validators.required],
      descricao: ['']
    });
  }

  ngOnInit(): void {
    this.carregarAlunos();
    this.carregarPlanos();
  }

  carregarAlunos(): void {
    this.db.getAll<Aluno>('usuarios').subscribe({
      next: (usuarios) => {
        this.alunos = usuarios.filter(u => u.role === 'ALUNO');
      },
      error: (err) => console.error('Erro ao buscar alunos:', err)
    });
  }

  carregarPlanos(): void {
    this.db.getAll<Plano>('planos').subscribe({
      next: (dados) => {
        this.planos = dados;
      },
      error: (err) => console.error('Erro ao buscar planos:', err)
    });
  }

  getNomeAluno(alunoId: string): string {
    const aluno = this.alunos.find(a => a.id === alunoId);
    return aluno ? aluno.nome : 'Aluno não encontrado';
  }

  onSubmit(): void {
    if (this.planoForm.valid) {
      const formValues = this.planoForm.value;
      const configPlano = this.tabelaPrecos[formValues.tipoPlano as keyof typeof this.tabelaPrecos];




      const dataAtual = new Date();
      const dataVencimento = new Date();

      if (configPlano.duracaoMeses === 0) {

        dataVencimento.setDate(dataVencimento.getDate() + 1);
      } else {

        dataVencimento.setMonth(dataVencimento.getMonth() + configPlano.duracaoMeses);
      }


      const novoPlano: Plano = {
        id: Date.now().toString(),
        alunoId: formValues.alunoId,
        nome: configPlano.nome,
        valor: configPlano.valor,
        duracaoMeses: configPlano.duracaoMeses,
        descricao: formValues.descricao,
        dataInicio: dataAtual.toISOString(),
        dataFim: dataVencimento.toISOString()
      };

      this.db.create<Plano>('planos', novoPlano).subscribe({
        next: () => {
          this.planoForm.reset({ alunoId: '', tipoPlano: '', descricao: '' });
          this.carregarPlanos();
          alert('Plano vinculado ao aluno com sucesso!');
        },
        error: (err) => console.error('Erro ao criar plano:', err)
      });
    }
  }

  excluirPlano(id: string): void {
    if (confirm('Tem certeza que deseja cancelar a matrícula deste aluno?')) {
      this.db.delete('planos', id).subscribe({
        next: () => {
          this.carregarPlanos();
        },
        error: (err) => console.error('Erro ao excluir plano:', err)
      });
    }
  }
}