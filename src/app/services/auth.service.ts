import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { DatabaseService } from './database.service';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private db: DatabaseService) {
    this.loadSession();
    this.seedDefaultAdmin();
  }


  private loadSession(): void {
    const sessionData = localStorage.getItem('bigfit_session');
    if (sessionData) {
      this.currentUserSubject.next(JSON.parse(sessionData));
    }
  }


  private seedDefaultAdmin(): void {
    this.db.getAll<Usuario>('usuarios').subscribe(usuarios => {
      if (usuarios.length === 0) {
        const admin: Usuario = {
          id: 'admin-master',
          nome: 'Administrador BigFit',
          email: 'admin@bigfit.com',
          senha: '123',
          role: 'ADMIN',
          dataCriacao: new Date()
        };
        this.db.create('usuarios', admin).subscribe();
      }
    });
  }


  login(email: string, senha: string): Observable<Usuario> {
    return this.db.getAll<Usuario>('usuarios').pipe(
      map(usuarios => {
        const user = usuarios.find(u => u.email === email && u.senha === senha);
        if (user) {
          return user;
        }
        throw new Error('E-mail ou senha inválidos.');
      }),
      tap(user => {

        localStorage.setItem('bigfit_session', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  /**
   * realiza o logout, limpando a sessão
   */
  logout(): void {
    localStorage.removeItem('bigfit_session');
    this.currentUserSubject.next(null);
  }

  /**
   * retorna o usuário logado no momento (útil para uso síncrono)
   */
  get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }
}