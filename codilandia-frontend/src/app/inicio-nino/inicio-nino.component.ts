import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-inicio-nino',
  templateUrl: './inicio-nino.component.html',
  styleUrls: ['./inicio-nino.component.css'],
  imports: [CommonModule, FormsModule]
})
export class InicioNinoComponent implements OnInit {

  nombre: string = ''; 
  correo: string = ''; 
  codigo_aula: string = '';
  cursos: any[] = []; 
  errorMessage: string = '';
  isJoinGroupModalOpen = false;
  groupCode: string = '';
  successMessage: string = '';
  isLoading = false;

  constructor(public router: Router, private http: HttpClient) { } 

  ngOnInit(): void {
    this.isLoading = true;
    this.getUserData();
    this.obtenerCursos();
  }


  getUserData() {
  const token = localStorage.getItem('auth_token');
  if (token) {
    const user = this.decodeToken(token);
    this.codigo_aula = user?.codigo_aula;
    this.correo = user?.correo_usuario;
    this.nombre = user?.nombre_usuario;
    } else {
      this.router.navigate(['/login']); 
    }
  }

  encodeToken(payload: any): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encode = (obj: any) => btoa(JSON.stringify(obj)).replace(/=+$/, '');
    return `${encode(header)}.${encode(payload)}.fake-signature`;
  }
  
  decodeToken(token: string) {
    const payload = token.split('.')[1];  
    const decoded = atob(payload);  
    return JSON.parse(decoded); 
  }

  obtenerCursos(): void {
    this.isLoading = true;
    this.http.get<any>(`https://proyecto-codilandia-backend.onrender.com/api/aulas/${this.correo}/${this.nombre}`).subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.cursos = res; 
        } else {
          this.errorMessage = 'No tienes cursos asignados.';
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al obtener cursos', err);
        this.errorMessage = 'No se pudieron cargar los cursos.';
        this.isLoading = false;
      }
    });
  }

  openJoinGroupModal() {
    this.isJoinGroupModalOpen = true;
  }

  closeJoinGroupModal() {
    this.isJoinGroupModalOpen = false;
  }

  // Método para unirse a un grupo
  joinGroup() {
    if (!this.groupCode) {
      return; // Si no se ha ingresado un código de grupo, no se envía la solicitud
    }

    // Comprobación de grupos a los que está unido
    this.http.get<any[]>(`https://proyecto-codilandia-backend.onrender.com/api/aulas/${this.correo}/${this.nombre}`).subscribe({
      next: (res) => {
        console.log(res.length);
        if (res.length >= 3) {
          alert('Solicitud denegada. No se puede pertenecer a más de 3 grupos.');
          this.errorMessage = 'Lo siento, perteneces al máximo número de grupos permitidos';
          this.closeJoinGroupModal(); 
          return;
        }

        const today = new Date().toISOString(); 
              
        // Enviar la solicitud POST para incluir la solicitud
        this.http.post('https://proyecto-codilandia-backend.onrender.com/api/aulas/unirse', {
          correo: this.correo,
          nombre: this.nombre,
          codigo: this.groupCode,
          fecha_solicitud: today
        }).subscribe({
          next: (res) => {
            alert('Solicitud enviada con éxito. A la espera de ser aceptad@.');
            this.closeJoinGroupModal();
          },
          error: (err) => {
            console.error('Error al unirse al grupo:', err);
            this.successMessage = 'Error al enviar la solicitud';
          }
        });
      },
      error: (err) => {
        console.error('Error al obtener cursos', err);
        this.errorMessage = 'No se pudieron cargar los cursos.';
      }
    }); 
  }

  navigateToNivelesFromCurso(curso: any): void {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
  
    const decoded = this.decodeToken(token);
    const updatedPayload = {
      ...decoded,
      codigo_aula: curso.codigo_aula
    };
  
    const newToken = this.encodeToken(updatedPayload);
    localStorage.setItem('auth_token', newToken);
  
    this.router.navigate(['/nivelesNinos']);
  }
  

  navigateToNiveles(): void {
    this.http.get<any>(`https://proyecto-codilandia-backend.onrender.com/api/aulas/individual/${this.correo}/${this.nombre}`)
      .subscribe({
        next: (res) => {
          const codigo_aula = res.codigo_aula;
          const token = localStorage.getItem('auth_token');
          if (!token) return;
  
          const decoded = this.decodeToken(token);
          const updatedPayload = {
            ...decoded,
            codigo_aula: codigo_aula
          };
  
          const newToken = this.encodeToken(updatedPayload);
          localStorage.setItem('auth_token', newToken);
  
          this.router.navigate(['/nivelesNinos']);
        },
        error: (err) => {
          console.error('Error al obtener el aula individual:', err);
          this.errorMessage = 'Error al obtener el aula individual.';
        }
      });
  }
  
}