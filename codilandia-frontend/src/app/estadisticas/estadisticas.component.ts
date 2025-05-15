import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartData, ChartOptions } from 'chart.js';

export interface Curso {
  nombre_aula: string;
}

export interface Alumno {
  nombre_nino: string;
  correo_nino: string;
  nivel_actual: number;
}

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule,FormsModule, NgChartsModule],
  templateUrl: './estadisticas.component.html',
  styleUrl: './estadisticas.component.css'
})
export class EstadisticasComponent implements OnInit {
    codigoAula: any | null = null;
    curso: Curso | null = null; 
    alumnos: any[] = [];
    nombre_usuario: string = ''; 
    correo_usuario: string = ''; 
    solicitudes: any[] = [];
    errorMessage: string = '';
    isLoading: boolean = true;
    nivel_medio: number | null = null;
    showPopup: boolean = false;
    selectedAlumno: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private location: Location
  ) {}

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white' 
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' 
        }
      },
      y: {
        ticks: {
          color: 'white',
          stepSize: 1, 
          precision: 0  
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)' 
        }
      }
    }
  };
  
  public barChartLabels: string[] = Array.from({ length: 11 }, (_, i) => `Nivel ${i + 1}`);
  public barChartData: ChartData<'bar'> = {
    labels: Array.from({ length: 11 }, (_, i) => `Nivel ${i + 1}`),
    datasets: [
      {
        data: Array(11).fill(0),
        label: 'Número de alumnos',
        backgroundColor: '#42A5F5'
      }
    ]
  };

  

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
            this.nivelMedio();
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

  nivelMedio() {
      if (this.alumnos.length === 0) {
        this.nivel_medio = null;
        return;
      }
    
      const sumaNiveles = this.alumnos.reduce((total, alumno) => total + alumno.nivel_actual, 0);
      this.nivel_medio = parseFloat((sumaNiveles / this.alumnos.length).toFixed(2));
    
      const niveles = Array(12).fill(0);
      this.alumnos.forEach(alumno => {
        if (alumno.nivel_actual >= 1 && alumno.nivel_actual <= 12) {
          niveles[alumno.nivel_actual - 1]++;
        }
      });
    
      this.barChartData = {
        labels: Array.from({ length: 12 }, (_, i) => `Nivel ${i + 1}`),
        datasets: [
          {
            data: niveles,
            label: 'Número de alumnos',
            backgroundColor: 'white'
          }
        ]
      };
  }  
  
  decodeToken(token: string) {
      const payload = token.split('.')[1];  
      const decoded = atob(payload);  
      return JSON.parse(decoded); 
  }
  
  volver() {
      this.location.back();
  }

  closePopup() {
      this.showPopup = false;
      this.selectedAlumno = null;
  }

  openAlumnoPopup(alumno: any) {
    this.selectedAlumno = { ...alumno, notas: [], nota_media: null };
    this.showPopup = true;
    this.getNotas(alumno);
    this.getNotaMedia(alumno);
  }
  
  getNotaMedia(alumno: any) {
    this.isLoading = true;
    const url = `https://proyecto-codilandia-backend.onrender.com/api/aulas/alumnos/nota-media/`
              + `${this.codigoAula}/`
              + `${encodeURIComponent(alumno.correo_nino)}/`
              + `${encodeURIComponent(alumno.nombre_nino)}`;

    this.http.get<{ nota_media: number }>(url)
      .subscribe({
        next: response => {
          // response.nota_media ya está tipado, no hay any
          this.selectedAlumno.nota_media = response.nota_media;
          this.isLoading = false;
        },
        error: err => {
          console.error('Error al cargar nota media:', err);
          this.selectedAlumno.nota_media = null;
          this.isLoading = false;
        }
      });
  }

  
  getNotas(alumno: any) {
    this.isLoading = true;
    this.http.get<any[]>(`https://proyecto-codilandia-backend.onrender.com/api/aulas/alumnos/notas/${this.codigoAula}/${alumno.correo_nino}/${alumno.nombre_nino}`).subscribe({
      next: (res) => {
        this.selectedAlumno.notas = res; 
        this.selectedAlumno.notasMap = {};
        res.forEach(nota => {
          this.selectedAlumno.notasMap[nota.numero_nivel] = nota.nota;
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar notas:', err);
        this.isLoading = false; 
      },
      complete: () => {
        this.isLoading = false; 
      }
    });
  }
}
