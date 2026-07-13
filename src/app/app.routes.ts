import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent)
  },

  
  {
    path: 'admin',
    canActivate: [authGuard(['ADMIN'])],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'alunos',
        loadComponent: () => import('./pages/admin/alunos/alunos.component').then(m => m.AlunosComponent)
      },
      {
        path: 'treinos',
        loadComponent: () => import('./pages/admin/treinos/treinos.component').then(m => m.TreinosComponent)
      },
      {
        path: 'planos',
        loadComponent: () => import('./pages/admin/planos/planos.component').then(m => m.PlanosComponent)
      }
    ]
  },

  
  {
    path: 'student',
    canActivate: [authGuard(['ALUNO'])],
    children: [
      {
        path: 'meu-treino',
        loadComponent: () => import('./pages/student/meu-treino/meu-treino.component').then(m => m.MeuTreinoComponent)
      },
      
      
      
      {
        path: 'meu-perfil',
        loadComponent: () => import('./pages/student/meu-perfil/meu-perfil.component').then(m => m.MeuPerfilComponent)
      }
    ]
  },

  
  {
    path: '**',
    redirectTo: 'login'
  }
];