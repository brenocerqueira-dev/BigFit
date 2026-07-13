import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { DatabaseService } from '../../../services/database.service';
import { AuthService } from '../../../services/auth.service';
import { Aluno } from '../../../models/aluno.model';
import { Treino } from '../../../models/treino.model';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-treinos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './treinos.component.html',
  styleUrl: './treinos.component.css'
})
export class TreinosComponent implements OnInit {
  treinoForm: FormGroup;
  alunos: Aluno[] = [];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private db: DatabaseService,
    private authService: AuthService
  ) {

    this.treinoForm = this.fb.group({
      alunoId: ['', Validators.required],
      titulo: ['', Validators.required],
      exercicios: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.carregarAlunos();
    this.adicionarExercicio();
  }

  carregarAlunos(): void {
    this.db.getAll<Aluno>('usuarios').subscribe(usuarios => {

      this.alunos = usuarios.filter(u => u.role === 'ALUNO') as Aluno[];
    });
  }


  get exercicios() {
    return this.treinoForm.get('exercicios') as FormArray;
  }

  adicionarExercicio(): void {
    const exercicioForm = this.fb.group({
      nome: ['', Validators.required],
      series: [3, [Validators.required, Validators.min(1)]],
      repeticoes: [12, [Validators.required, Validators.min(1)]],
      cargaRecomendada: [''],

      dataExecucao: ['']
    });
    this.exercicios.push(exercicioForm);
  }

  removerExercicio(index: number): void {
    this.exercicios.removeAt(index);
  }

  onSubmit(): void {
    if (this.treinoForm.invalid) {
      this.treinoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const professorId = this.authService.currentUserValue?.id || '';


    const novoTreino: Partial<Treino> = {
      ...this.treinoForm.value,
      professorId,
      dataAtualizacao: new Date().toISOString()
    };


    this.db.create<Treino>('treinos', novoTreino as Treino).subscribe(() => {
      alert('Treino salvo com sucesso!');
      this.treinoForm.reset();
      this.exercicios.clear();
      this.adicionarExercicio();
      this.isLoading = false;
    });
  }
}