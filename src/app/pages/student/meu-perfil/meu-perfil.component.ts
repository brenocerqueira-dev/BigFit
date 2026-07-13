import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { Aluno } from '../../../models/aluno.model';

@Component({
  selector: 'app-meu-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './meu-perfil.component.html',
  styleUrl: './meu-perfil.component.css'
})
export class MeuPerfilComponent implements OnInit {
  alunoLogado: Aluno | null = null;
  imcResult: string = 'N/A';
  menuEstaAberto = false;


  modoEdicao = false;
  pesoEdit: number = 0;
  alturaEdit: number = 0;

  constructor(
    private authService: AuthService,
    private db: DatabaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.alunoLogado = this.authService.currentUserValue as Aluno;
    this.calcularIMC();
  }

  calcularIMC(): void {
    if (this.alunoLogado && this.alunoLogado.peso && this.alunoLogado.altura) {
      const peso = this.alunoLogado.peso;
      const altura = this.alunoLogado.altura;
      const imc = peso / (altura * altura);
      this.imcResult = imc.toFixed(2);
    }
  }

  abrirOuFecharMenu(): void {
    this.menuEstaAberto = !this.menuEstaAberto;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }





  iniciarEdicao(): void {
    this.modoEdicao = true;

    this.pesoEdit = this.alunoLogado?.peso || 0;
    this.alturaEdit = this.alunoLogado?.altura || 0;
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
  }

  salvarMetricas(): void {
    if (this.alunoLogado && this.alunoLogado.id) {

      const alunoAtualizado = {
        ...this.alunoLogado,
        peso: this.pesoEdit,
        altura: this.alturaEdit
      };


      this.db.update<Aluno>('usuarios', this.alunoLogado.id, alunoAtualizado).subscribe({
        next: () => {

          this.alunoLogado = alunoAtualizado;
          this.calcularIMC();
          this.modoEdicao = false;
          alert('Métricas atualizadas com sucesso! 💪');
        },
        error: (err) => {
          console.error('Erro ao atualizar perfil', err);
          alert('Houve um erro ao salvar as alterações.');
        }
      });
    }
  }
}