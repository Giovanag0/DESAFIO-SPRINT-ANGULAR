import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  usuario: User | null = null;
  menuAberto: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  irParaDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
