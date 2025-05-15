import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Location } from '@angular/common';


export interface Curso {
  codigo_aula: number;
  nombre_aula: string;
}

@Component({
  selector: 'app-profesor',
  imports: [CommonModule,FormsModule],
  templateUrl: './profesor.component.html',
  styleUrls: ['./profesor.component.css']
})
export class ProfesorComponent implements OnInit{
  nombre_usuario: string = ''; 
  correo_usuario: string = ''; 
  cursos: Curso[] = []; 
  errorMessage: string = '';
  isCreateRoomModalOpen = false;
  nombreAula: string = '';
  isLoading: boolean = false;

  constructor(private router: Router,private http: HttpClient,private location: Location) {}

  ngOnInit(): void {
    this.getUserData();
    this.obtenerCursos();
  }

  openCreateRoomModal() {
    this.isCreateRoomModalOpen = true;
  }

  closeCreateRoomModal() {
    this.isCreateRoomModalOpen = false;
  }


  getUserData() {
    this.isLoading = true;
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

  generateCodigoAula(): number {
    return Math.floor(10000 + Math.random() * 90000); 
  }

  CreateAula() {
    this.isLoading = true;
    const codigoGenerado = this.generateCodigoAula();
        // Enviar la solicitud POST para incluir la solicitud
        this.http.post('http://localhost:3000/api/aulas/crear-aula', {
          codigo_aula: codigoGenerado,
          nombre_aula: this.nombreAula,
        }).subscribe({
          next: (res) => {
            alert('Aula creada con éxito.');
            this.CreateAulaVirtual(codigoGenerado);
            this.AnadirNiveles(codigoGenerado);
            this.closeCreateRoomModal();
          },
          error: (err) => {
            console.error('Error al unirse al grupo:', err);
          }
        });
  }

  AnadirNiveles(codigo: number) {
    let requestsCompleted = 0;
    const totalLevels = 15;
  
    for (let i = 1; i <= totalLevels; i++) {
      this.http.post('http://localhost:3000/api/aulas/niveles', {
        numero_nivel: i,
        codigo_aula: codigo,
        nombre_nivel: `Nivel - ${i}`,
      }).subscribe({
        next: (res) => {
          requestsCompleted++;
          if (requestsCompleted === totalLevels) {
            this.isLoading = false;
            this.closeCreateRoomModal();
            window.location.reload();
          }
        },
        error: (err) => {
          console.error(`Error al añadir el nivel ${i}:`, err);
        }
      });
    }
  }
  

  CreateAulaVirtual(codigo: number){
    this.http.post('http://localhost:3000/api/aulas/crear-aula-virtual', {
      codigo_aula: codigo,
      correo_adulto: this.correo_usuario,
      nombre_adulto: this.nombre_usuario,
    }).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.closeCreateRoomModal();
        window.location.reload();
      },
      error: (err) => {
        console.error('Error al unirse al grupo:', err);
      }
    });
  }


  obtenerCursos(): void {
    this.http.get<any>(`http://localhost:3000/api/aulas/adulto/${this.correo_usuario}/${this.nombre_usuario}`).subscribe({
      next: (res) => {
        if (res.length > 0) {
          this.isLoading = false;
          this.cursos = res; 
        } else {
          this.isLoading = false;
          this.errorMessage = 'No tienes cursos asignados.';
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error al obtener cursos', err);
        this.errorMessage = 'No se pudieron cargar los cursos.';
      }
    });
  }

  volver() {
    this.location.back();
  }

  clase(curso: number) {
    console.log('Curso clickeado:', curso);
    this.router.navigate(['curso', curso]);
  }
}
