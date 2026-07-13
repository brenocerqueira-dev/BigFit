import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { Aluno } from '../../../models/aluno.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alunos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './alunos.component.html',
  styleUrl: './alunos.component.css'
})
export class AlunosComponent implements OnInit {
  alunos: Aluno[] = [];
  alunoForm: FormGroup;
  isLoading: boolean = false;

  constructor(
    private db: DatabaseService,
    private fb: FormBuilder
  ) {

    this.alunoForm = this.fb.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['123456', Validators.required],
      peso: ['', [Validators.required, Validators.min(20)]],
      altura: ['', [Validators.required, Validators.min(1)]],
      meta: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.carregarAlunos();
  }

  carregarAlunos(): void {
    this.isLoading = true;
    this.db.getAll<Aluno>('usuarios').subscribe(usuarios => {

      this.alunos = usuarios.filter(u => u.role === 'ALUNO') as Aluno[];
      this.isLoading = false;
    });
  }

  onSubmit(): void {
    if (this.alunoForm.invalid) {
      this.alunoForm.markAllAsTouched();


      return;
    }

    this.isLoading = true;
    const formValues = this.alunoForm.value;


    const emailJaExiste = this.alunos.some(aluno => aluno.email === formValues.email);

    if (emailJaExiste) {
      alert('Erro: Este e-mail já está cadastrado no sistema! Por favor, utilize outro.');
      this.isLoading = false;
      return;
    }

    const pesoCorrigido = String(formValues.peso).replace(',', '.');
    const alturaCorrigida = String(formValues.altura).replace(',', '.');


    const pesoNum = parseFloat(pesoCorrigido);
    const alturaNum = parseFloat(alturaCorrigida);


    const imcCalculado = pesoNum / (alturaNum * alturaNum);


    const novoAluno: Partial<Aluno> = {
      ...formValues,
      role: 'ALUNO',

      imc: parseFloat(imcCalculado.toFixed(2)),
      dataCriacao: new Date().toISOString()
    };

    this.db.create<Aluno>('usuarios', novoAluno as Aluno).subscribe(() => {

      this.alunoForm.reset({ senha: '123456', meta: '' });
      this.carregarAlunos();
    });
  }

  deletarAluno(id: string): void {
    if (confirm('Tem certeza que deseja excluir este aluno?')) {
      this.isLoading = true;
      this.db.delete('usuarios', id).subscribe(() => {
        this.carregarAlunos();
      });
    }
  }
}