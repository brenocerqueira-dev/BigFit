import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { DatabaseService } from '../../../services/database.service';
import { Usuario } from '../../../models/usuario.model';
import { Treino } from '../../../models/treino.model';
import { Plano } from '../../../models/plano.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  adminNome: string = '';
  totalAlunos: number = 0;
  treinosAtivos: number = 0;
  receitaMes: number = 0;




  menuAberto: boolean = false;

  constructor(
    private authService: AuthService,
    private db: DatabaseService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user: Usuario | null = this.authService.currentUserValue;
    if (user) {
      this.adminNome = user.nome.split(' ')[0];
    }
    this.carregarEstatisticas();
  }




  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  carregarEstatisticas(): void {

    this.db.getAll<Usuario>('usuarios').subscribe(usuarios => {
      this.totalAlunos = usuarios.filter(u => u.role === 'ALUNO').length;
    });


    this.db.getAll<Treino>('treinos').subscribe(treinos => {
      this.treinosAtivos = treinos.length;
    });




    this.db.getAll<Plano>('planos').subscribe(planos => {

      this.receitaMes = planos.reduce((total, plano) => {
        return total + (plano.valor || 0);
      }, 0);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}