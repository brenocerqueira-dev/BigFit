import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { Aluno } from '../../../models/aluno.model';
import { Treino } from '../../../models/treino.model';

@Component({
  selector: 'app-meu-treino',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './meu-treino.component.html',
  styleUrl: './meu-treino.component.css'
})
export class MeuTreinoComponent implements OnInit {
  alunoLogado: Aluno | null = null;
  treinosAtivos: Treino[] = [];


  menuEstaAberto = false;

  constructor(
    private authService: AuthService,
    private db: DatabaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.alunoLogado = this.authService.currentUserValue as Aluno;
    if (this.alunoLogado) {
      this.buscarTreino();
    }
  }


  abrirOuFecharMenu(): void {
    this.menuEstaAberto = !this.menuEstaAberto;
  }

  buscarTreino(): void {
    this.db.getAll<Treino>('treinos').subscribe(treinos => {
      this.treinosAtivos = treinos
        .filter(t => String(t.alunoId) === String(this.alunoLogado?.id) && t.exercicios && t.exercicios.length > 0)
        .sort((a, b) => new Date(a.dataAtualizacao).getTime() - new Date(b.dataAtualizacao).getTime());
    });
  }

  finalizarExercicio(treinoIndex: number, exIndex: number): void {
    const treino = this.treinosAtivos[treinoIndex];

    if (treino && treino.exercicios) {
      const nomeExercicio = treino.exercicios[exIndex].nome;

      treino.exercicios.splice(exIndex, 1);

      this.db.update<Treino>('treinos', treino.id, treino).subscribe({
        next: () => {
          alert(`Boa! Você concluiu e removeu o exercício: ${nomeExercicio} 💪`);

          if (treino.exercicios.length === 0) {
            this.treinosAtivos.splice(treinoIndex, 1);
          }
        },
        error: (err) => {
          console.error('Erro ao atualizar o treino no banco:', err);
          alert('Houve um erro ao salvar a conclusão do exercício.');
        }
      });
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}