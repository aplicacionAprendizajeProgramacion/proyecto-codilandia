import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';

export interface Curso {
  nombre_aula: string;
}

export interface Alumno {
  nombre_nino: string;
  correo_nino: string;
}

@Component({
  selector: 'app-alumnos',
  imports: [CommonModule,FormsModule],
  templateUrl: './alumnos.component.html',
  styleUrl: './alumnos.component.css'
})
export class AlumnosComponent implements OnInit{
  codigoAula: any | null = null;
  curso: Curso | null = null; 
  alumnos: any[] = [];
  nombre_usuario: string = ''; 
  correo_usuario: string = ''; 
  solicitudes: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private location: Location
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.codigoAula = this.route.snapshot.paramMap.get('codigo'); 
    
    if (this.codigoAula) {
      this.http.get<Curso[]>(`https://proyecto-codilandia-backend.onrender.com/api/aulas/aula?codigo=${this.codigoAula}`).subscribe({
        next: (res) => {
          this.curso = res[0];
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al cargar el curso:', err);
        }
      });
    }

    if (this.codigoAula) {
      this.http.get<Alumno[]>(`https://proyecto-codilandia-backend.onrender.com/api/aulas/alumnos?codigo=${this.codigoAula}`).subscribe({
        next: (res) => {
          this.alumnos = res;
        },
        error: (err) => {
          console.error('Error al cargar alumnos:', err);
        }
      });
    }

    this.getUserData();
  }

  getUserData() {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const user = this.decodeToken(token);
      this.nombre_usuario = user?.nombre_usuario; 
      this.correo_usuario = user?.correo_usuario;  
    } else {
      this.router.navigate(['/login']); 
      this.isLoading = false;
    }
  }

  decodeToken(token: string) {
    const payload = token.split('.')[1];  
    const decoded = atob(payload);  
    return JSON.parse(decoded); 
  }

  volver() {
    this.location.back();
  }

  eliminar(alumno: any){
    console.log(alumno)
        this.isLoading = true;
        this.http.delete(`https://proyecto-codilandia-backend.onrender.com/api/aulas/aula/${this.codigoAula}/alumnos/${alumno.correo_nino}`).subscribe({
          next: () => {
            if (this.codigoAula) {
              this.http.get<Alumno[]>(`https://proyecto-codilandia-backend.onrender.com/api/aulas/alumnos?codigo=${this.codigoAula}`).subscribe({
                next: (res) => {
                  if (res.length > 0) {
                    this.isLoading = false;
                    this.alumnos = res; 
                  } else {
                    this.isLoading = false;
                    this.errorMessage = 'No tienes alumnos asignados.';
                  }
                },
                error: (err) => {
                  console.error('Error al cargar el curso:', err);
                }
              });
            }
          },
          error: (err) => {
            console.error('Error al eliminar los alumnos:', err);
          }
        });
        window.location.reload();
  }


}
