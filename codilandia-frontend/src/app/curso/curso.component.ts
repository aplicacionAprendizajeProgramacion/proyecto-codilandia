import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';


export interface Curso {
  nombre_aula: string;
}

export interface Solicitud {
  nombre_nino: string;
}

@Component({
  selector: 'app-curso',
  imports: [CommonModule,FormsModule],
  templateUrl: './curso.component.html',
  styleUrls: ['./curso.component.css']
})
export class CursoComponent implements OnInit {
  codigoAula: any | null = null;
  curso: Curso | null = null; 
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
        this.http.get<Solicitud[]>(`https://proyecto-codilandia-backend.onrender.com/api/aulas/aula/${this.codigoAula}/solicitudes`).subscribe({
          next: (res) => {
            if (res.length > 0) {
              this.solicitudes = res; 
            } else {
              this.errorMessage = 'No tienes cursos asignados.';
            }
          },
          error: (err) => {
            console.error('Error al cargar el curso:', err);
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

  solictudes(curso: number) {
    this.router.navigate(['solicitudes',curso]);
  }

  clase(curso: number) {
    console.log('Curso clickeado:', curso);
    this.router.navigate(['curso', curso]);
  }

  alumnos(curso: number) {
    this.router.navigate(['alumnos', curso]);
  }

  estadisticas(curso: number) {
    this.router.navigate(['estadisticas', curso]);
  }
}
