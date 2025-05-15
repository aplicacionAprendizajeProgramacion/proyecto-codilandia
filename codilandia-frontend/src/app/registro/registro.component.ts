import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  nombre_usuario: string = '';
  correo_usuario: string = '';
  contrasena: string = '';
  tipoUsuario: string = 'nino';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient 
  ) {}

  volver(): void {
    this.router.navigate(['/']); 
  }

  onSubmit(): void {
    this.isLoading = true;

    if (!this.correo_usuario || !this.nombre_usuario || !this.contrasena) {
      this.errorMessage = 'Todos los campos son obligatorios';
      return;
    }
  
    const endpoint = this.tipoUsuario === 'adulto' 
      ? 'http://localhost:3000/api/users/adulto'
      : 'http://localhost:3000/api/users/nino';
  
    this.http.post(endpoint, {
      correo_usuario: this.correo_usuario,
      nombre_usuario: this.nombre_usuario,
      contrasena: this.contrasena
    }).subscribe({
      next: (res: any) => {
        console.log('Registro exitoso:', res);
        
        this.http.post<any>('http://localhost:3000/api/auth/login', {
          correo_usuario: this.correo_usuario,
          nombre_usuario: this.nombre_usuario,
          contrasena: this.contrasena
        }).subscribe({
          next: (loginRes) => {
            localStorage.setItem('auth_token', loginRes.token);
            const redirectRoute = this.tipoUsuario === 'adulto' 
              ? '/profesor' 
              : '/inicio-nino';
            this.isLoading = false;
            this.router.navigate([redirectRoute]);
          },
          error: (loginErr) => {
            this.isLoading = false;
            console.error('Error en autologin:', loginErr);
            this.errorMessage = 'Registro exitoso, pero falló el auto-login. Por favor inicia sesión manualmente.';
            this.router.navigate(['/login']);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error en registro:', err);
        
        if (err.status === 400) {
          this.errorMessage = err.error?.error || 'Datos inválidos';
        } else if (err.status === 409) {
          this.errorMessage = 'El correo electrónico ya está registrado';
        } else {
          this.errorMessage = 'Error del servidor. Intente nuevamente más tarde.';
        }
      }
    });
  }
}