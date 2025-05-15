import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css'],
  imports: [CommonModule, FormsModule]
})
export class InicioSesionComponent {
  nombre_usuario: string = '';
  correo_usuario: string = '';
  contrasena: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  isResetPasswordModalOpen = false;
  resetCorreo = '';
  perfiles = [
    { nombre: 'Alumno', tipo: 'nino' },
    { nombre: 'Profesor', tipo: 'adulto' },
  ];
  selectedPerfil: string | null = null;
  usernames: string[] = [];  

  constructor(private router: Router, private http: HttpClient) {}

  onSubmit(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.http.post<any>('https://proyecto-codilandia-backend.onrender.com/api/auth/login', {
      nombre_usuario: this.nombre_usuario,
      correo_usuario: this.correo_usuario,
      contrasena: this.contrasena
    }).subscribe({
      next: (res) => {
        localStorage.setItem('auth_token', res.token);
        localStorage.setItem('user_tipo', res.tipo);
        // Redirigir según el tipo de usuario
        if (res.tipo === 'nino') {
          this.isLoading = false;
          this.router.navigate(['/inicio-nino']);
        } else if (res.tipo === 'adulto') {
          this.isLoading = false;
          this.router.navigate(['/profesor']);
        } else {
          this.errorMessage = 'Rol de usuario no reconocido';
        }
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Error en las credenciales';
        console.error('Error en login:', err);
      }
    });
  }
  openPasswordResetModal() {
    this.isResetPasswordModalOpen = true;
    this.resetCorreo = '';
    this.selectedPerfil = null;
    this.usernames = []; 
  }

  closePasswordResetModal() {
    this.isResetPasswordModalOpen = false;
  }

  selectPerfil(perfil: string) {
    this.selectedPerfil = perfil;
  }

  fetchUsernames() {
    this.errorMessage = '';
    this.usernames = [];
    this.selectedPerfil = null;

    if (!this.resetCorreo) {
      this.errorMessage = 'Por favor ingrese un correo válido';
      return;
    }

    this.isLoading = true;
    
    this.http.get<any>(`https://proyecto-codilandia-backend.onrender.com/api/users/get-usernames-by-email?email=${this.resetCorreo}`)
      .subscribe({
        next: (res) => {
          this.usernames = res.usernames;
          if (this.usernames.length === 0) {
            this.errorMessage = 'No se encontraron usuarios asociados a este correo';
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Error al buscar usuarios';
          this.isLoading = false;
        }
      });
  }

  sendResetEmail() {
    if (!this.selectedPerfil) {
      this.errorMessage = '¡Debe seleccionar un nombre de usuario!';
      return;
    }
  
    this.isLoading = true;
  
    this.http.get(`https://proyecto-codilandia-backend.onrender.com/api/users/send-reset-email?email=${this.resetCorreo}&username=${this.selectedPerfil}`)
      .subscribe({
        next: () => {
          alert('Correo enviado. Revise su bandeja de entrada');
          this.closePasswordResetModal();
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err.error?.error || 'Error al enviar el correo';
          this.isLoading = false;
        }
      });
  }
  

  navigateToRegister(): void {
    this.router.navigate(['/registro']);
  }

  volver(): void {
    this.router.navigate(['/']);
  }
}