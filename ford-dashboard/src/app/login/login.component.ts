import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  errorMsg: string = '';
  showPassword: boolean = false;
  loginAutomatico: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (this.authService.isLogado()) {
      this.router.navigate(['/home']);
    }

    this.loginForm = this.fb.group({
      nome: ['', [Validators.required]],
      senha: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.errorMsg = 'Preencha todos os campos corretamente.';
      return;
    }

    const { nome, senha } = this.loginForm.value;

    this.authService.login(nome, senha).subscribe({
      next: (user) => {
        this.authService.salvarUsuario(user);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.errorMsg = err.error?.message || 'Erro ao realizar login.';
      }
    });
  }
}
