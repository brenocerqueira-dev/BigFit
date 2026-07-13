import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {



  private readonly SIMULATED_DELAY = 500;

  constructor() { }

  /**
   * gera um ID único simulado (semelhante ao UUID do backend)
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }

  /**
   * busca todos os registros de uma determinada tabela (key) no LocalStorage
   */
  getAll<T>(tableKey: string): Observable<T[]> {
    const data = localStorage.getItem(tableKey);
    const parsedData = data ? JSON.parse(data) : [];
    return of(parsedData).pipe(delay(this.SIMULATED_DELAY));
  }

  /**
   * busca um registro específico pelo ID
   */
  getById<T extends { id: string }>(tableKey: string, id: string): Observable<T | undefined> {
    const data = localStorage.getItem(tableKey);
    const parsedData: T[] = data ? JSON.parse(data) : [];
    const item = parsedData.find(i => i.id === id);
    return of(item).pipe(delay(this.SIMULATED_DELAY));
  }

  /**
   * cria um novo registro e salva no LocalStorage
   */
  create<T extends { id?: string }>(tableKey: string, item: T): Observable<T> {
    const data = localStorage.getItem(tableKey);
    const parsedData: T[] = data ? JSON.parse(data) : [];


    const newItem = { ...item, id: this.generateId() };

    parsedData.push(newItem);
    localStorage.setItem(tableKey, JSON.stringify(parsedData));

    return of(newItem).pipe(delay(this.SIMULATED_DELAY));
  }

  /**
   * atualiza um registro existente
   */
  update<T extends { id: string }>(tableKey: string, id: string, item: Partial<T>): Observable<T> {
    const data = localStorage.getItem(tableKey);
    const parsedData: T[] = data ? JSON.parse(data) : [];
    const index = parsedData.findIndex(i => i.id === id);

    if (index === -1) {
      return throwError(() => new Error('Registro não encontrado.'));
    }

    parsedData[index] = { ...parsedData[index], ...item };
    localStorage.setItem(tableKey, JSON.stringify(parsedData));

    return of(parsedData[index]).pipe(delay(this.SIMULATED_DELAY));
  }

  /**
   * deleta um registro pelo ID
   */
  delete(tableKey: string, id: string): Observable<boolean> {
    const data = localStorage.getItem(tableKey);
    const parsedData: any[] = data ? JSON.parse(data) : [];
    const filteredData = parsedData.filter(i => i.id !== id);

    localStorage.setItem(tableKey, JSON.stringify(filteredData));
    return of(true).pipe(delay(this.SIMULATED_DELAY));
  }
}