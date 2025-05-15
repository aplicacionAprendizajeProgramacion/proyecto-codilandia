import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

export interface Solicitud {
  nombre_nino: string;
  correo_nino: string;
}

export interface Curso {
  nombre_aula: string;
}

@Component({
  selector: 'app-solictudes',
  imports: [CommonModule,FormsModule],
  templateUrl: './solictudes.component.html',
  styleUrl: './solictudes.component.css'
})
export class SolictudesComponent implements OnInit {

  codigoAula: any | null = null;
  solicitudes: any[] = [];
  nombre_usuario: string = ''; 
  correo_usuario: string = ''; 
  curso: Curso | null = null; 
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
        this.http.get<Solicitud[]>(`http://localhost:3000/api/aulas/aula/${this.codigoAula}/solicitudes`).subscribe({
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

      if (this.codigoAula) {
        this.http.get<Curso[]>(`http://localhost:3000/api/aulas/aula?codigo=${this.codigoAula}`).subscribe({
          next: (res) => {
            this.curso = res[0];
            this.isLoading = false; 
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

  cancelar(solicitud: any) {
    this.isLoading = true;
    this.http.delete(`http://localhost:3000/api/aulas/aula/${this.codigoAula}/solicitudes/${solicitud.correo_nino}`).subscribe({
      next: () => {
        if (this.codigoAula) {
          this.http.get<Solicitud[]>(`http://localhost:3000/api/aulas/aula/${this.codigoAula}/solicitudes`).subscribe({
            next: (res) => {
              if (res.length > 0) {
                this.isLoading = false;
                this.solicitudes = res; 
              } else {
                this.isLoading = false;
                this.errorMessage = 'No tienes cursos asignados.';
              }
            },
            error: (err) => {
              console.error('Error al cargar el curso:', err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Error al eliminar las solicitudes:', err);
      }
    });
    window.location.reload();
  }

  aceptar(solicitud: any) {
    console.log('▶ aceptar()', solicitud);
    this.isLoading = true;
  
    // 1) Inserto al niño
    this.http
      .post(
        `http://localhost:3000/api/aulas/pertenece`,
        {
          correo_nino: solicitud.correo_nino,
          nombre_nino: solicitud.nombre_nino,
          codigo_aula: this.codigoAula,
          nivel_actual: 1,
        }
      )
      .subscribe({
        next: (res) => {
          console.log('✔ POST pertenece:', res);
  
          // 2) Cuando termine, borro la solicitud
          this.http
            .delete(
              `http://localhost:3000/api/aulas/aula/${this.codigoAula}/solicitudes/${solicitud.correo_nino}/${solicitud.nombre_nino}`
            )
            .subscribe({
              next: (delRes) => {
                console.log('✔ DELETE solicitud:', delRes);
  
                // 3) Quito de la lista local
                this.solicitudes = this.solicitudes.filter(s =>
                  !(s.correo_nino === solicitud.correo_nino &&
                    s.nombre_nino === solicitud.nombre_nino)
                );
                this.isLoading = false;
              },
              error: (errDel) => {
                console.error('✖ Error DELETE:', errDel);
                this.isLoading = false;
              },
            });
        },
        error: (errPost) => {
          console.error('✖ Error POST:', errPost);
          this.isLoading = false;
        },
      });
  }  
}
