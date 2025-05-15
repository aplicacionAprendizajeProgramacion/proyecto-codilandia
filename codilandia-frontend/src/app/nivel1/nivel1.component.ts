import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-nivel1',
  templateUrl: './nivel1.component.html',
  styleUrls: ['./nivel1.component.css'],
  imports: [CommonModule] 
})
export class Nivel1Component implements OnInit {
  correo_nino: string = '';  
  nombre_nino: string = '';
  codigo_aula: string = '';
  num_nivel: number = 1;  
  puntos_minimos: number = 10;
  puntos_obtenidos: number = 10; 
  puntos_maximos: number = 10;
  nivel_info: string = 'Nivel 1: Introducción a los Programas';

  constructor(
    public router: Router,
    private http: HttpClient,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const user = this.decodeToken(token);
      this.correo_nino = user?.correo_usuario;
      this.nombre_nino = user?.nombre_usuario;
      this.codigo_aula = user?.codigo_aula;
    } else {
      this.router.navigate(['/login']);
    }
  }

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
  

  finishLevel(): void {
    this.http.put<any>(`http://localhost:3000/api/niveles/actualizar`, {
      correo_nino: this.correo_nino,
      nombre_nino: this.nombre_nino,
      codigo_aula: this.codigo_aula,
      nivel: this.num_nivel,
      puntos_obtenidos: this.puntos_obtenidos,
      puntos_minimos: this.puntos_minimos,
      puntos_maximos: this.puntos_maximos
    }).subscribe({
      next: (res) => {
        console.log('Nivel actualizado', res);
  
        const oldToken = localStorage.getItem('auth_token');
        if (!oldToken) return;
  
        const decoded = this.decodeToken(oldToken);
        const updatedPayload = {
          ...decoded,
          codigo_aula: this.codigo_aula
        };
        const newToken = this.encodeToken(updatedPayload);
        localStorage.setItem('auth_token', newToken);
  
        console.log('Redirigiendo a nivelesNinos...');
        this.router.navigate(['/nivelesNinos']);
        console.log('¿Llegó después del navigate?');
      },
      error: (err) => {
        console.error('Error al actualizar el nivel', err);
      }
    });
  }  
}
