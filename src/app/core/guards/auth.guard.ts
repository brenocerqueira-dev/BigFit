import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/usuario.model';

export const authGuard = (allowedRoles?: Role[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const usuarioLogado = authService.currentUserValue;


    if (!usuarioLogado) {

      router.navigate(['/login']);
      return false;
    }


    if (allowedRoles && allowedRoles.length > 0) {
      const temPermissao = allowedRoles.includes(usuarioLogado.role);

      if (!temPermissao) {

        if (usuarioLogado.role === 'ADMIN') {
          router.navigate(['/admin/dashboard']);
        } else if (usuarioLogado.role === 'ALUNO') {
          router.navigate(['/student/meu-treino']);
        }
        return false;
      }
    }


    return true;
  };
};