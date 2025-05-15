import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nivelesNinos',
  templateUrl: './nivelesNinos.component.html',
  styleUrls: ['./nivelesNinos.component.css'],
  imports: [CommonModule]
})
export class NivelesNinosComponent implements OnInit {
  codigo_aula: string = '';
  correo: string = '';
  nombre: string = '';
  nivel_actual: number = 1;
  isLoading: boolean = false;
  nombreAula: string = '';
  notaMedia: number | null = null;
  notasPorNivel: { numero_nivel: number, nota: number }[] = [];

  titulos = [
    'INTRODUCCIÓN',
    'VARIABLES Y TIPOS DE DATOS',
    'IMPRESIÓN POR PANTALLA',
    'OPERACIONES ARITMÉTICAS',
    'COMPARACIONES Y OPERADORES',
    'OPERACIONES CON STRINGS',
    'COMENTARIOS',
    'IF, ELSE, ELSE IF',
    'BUCLE WHILE',
    'BUCLE FOR',
    'FUNCIONES'
  ];

  constructor(private route: ActivatedRoute, public router: Router) {}

  decodeToken(token: string) {
    const payload = token.split('.')[1];
    const decoded = atob(payload);
    return JSON.parse(decoded);
  }

  encodeToken(payload: any): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encode = (obj: any) => btoa(JSON.stringify(obj)).replace(/=+$/, '');
    return `${encode(header)}.${encode(payload)}.fake-signature`;
  }
  
  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const user = this.decodeToken(token);
      this.codigo_aula = user?.codigo_aula;
      this.correo = user?.correo_usuario;
      this.nombre = user?.nombre_usuario;

      this.getNivelActual(); 
      console.log('Código aula:', this.codigo_aula);
      console.log('Correo:', this.correo);
      console.log('Nombre:', this.nombre);

      this.getNombreAula();
      this.fetchNotasYMedia();

    } else {
      this.router.navigate(['/login']);
    }
  }

  getNombreAula():void{
    this.isLoading = true;
    fetch(`https://proyecto-codilandia-backend.onrender.com/api/aulas/aula/nombre/${this.codigo_aula}`)
      .then(r => r.json())
      .then(json => this.nombreAula = json.nombre_aula)
      .catch(() => this.nombreAula = '')
      .finally(() => {
        this.isLoading = false;
      });
  }


  getNivelActual(): void {
    this.isLoading = true;
    fetch(`https://proyecto-codilandia-backend.onrender.com/api/aulas/nivel-actual/${this.correo}/${this.nombre}/${this.codigo_aula}`)
      .then(res => res.json())
      .then(data => {
        if (data.nivel_actual && !isNaN(Number(data.nivel_actual))) {
          this.nivel_actual = Number(data.nivel_actual);
        } else {
          console.warn('Nivel actual inválido:', data.nivel_actual);
          this.nivel_actual = 1; // valor por defecto si no viene nada
        }
      })
      .catch(err => {
        console.error('Error al obtener nivel actual:', err);
        this.nivel_actual = 1;
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  fetchNotasYMedia() {
    const base = `https://proyecto-codilandia-backend.onrender.com/api/aulas/alumnos/nota-media/${this.codigo_aula}/`
               + `${encodeURIComponent(this.correo)}/`
               + `${encodeURIComponent(this.nombre)}`;
    // Nota media
    fetch(base)
      .then(r => r.json())
      .then(json => this.notaMedia = json.nota_media)
      .catch(() => this.notaMedia = null);

    // Listado de notas por nivel
    const urlNotas = `https://proyecto-codilandia-backend.onrender.com/api/aulas/alumnos/notas/${this.codigo_aula}/`
                   + `${encodeURIComponent(this.correo)}/`
                   + `${encodeURIComponent(this.nombre)}`;
    fetch(urlNotas)
      .then(r => r.json())
      .then(rows => this.notasPorNivel = rows)
      .catch(() => this.notasPorNivel = []);
  }


  navigateToNivel(nivel: number): void {
    const token = localStorage.getItem('auth_token');
    if (!token) return;
  
    const decoded = this.decodeToken(token);
    const updatedPayload = {
      ...decoded,
      codigo_aula: this.codigo_aula
    };
  
    const newToken = this.encodeToken(updatedPayload);
    localStorage.setItem('auth_token', newToken);
  
    const path = `/nivel${nivel}`;
    this.router.navigate([path]);  // sin queryParams
  }  
}
