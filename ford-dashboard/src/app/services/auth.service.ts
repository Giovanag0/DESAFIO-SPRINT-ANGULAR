import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3001';

  constructor(private http: HttpClient) {}

  login(nome: string, senha: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { nome, senha });
  }

  salvarUsuario(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getUsuario(): User | null {
    const user = sessionStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLogado(): boolean {
    return !!sessionStorage.getItem('user');
  }

  logout(): void {
    sessionStorage.removeItem('user');
  }
}
