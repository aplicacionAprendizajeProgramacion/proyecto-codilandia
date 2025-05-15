import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nivel5',
  templateUrl: './nivel5.component.html',
  styleUrls: ['./nivel5.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Nivel5Component implements OnInit {
  correo_nino = '';
  nombre_nino = '';
  codigo_aula = '';
  num_nivel = 5;
  puntos_obtenidos = 0;
  puntos_minimos = 7;
  puntos_maximos = 10;
  puedeFinalizar = 0;

  correctos: any = {
    manzanas1: false,
    vacas1: false,
    pastel1: false,
    mayorIgual: false,
    menorIgual: false,
    distinto: false,
    igualGuardado: false,
    andTest: false,
    orTest: false,
    notTest: false
  };

  resueltos: any = {
    manzanas1: false,
    vacas1: false,
    pastel1: false,
    mayorIgual: false,
    menorIgual: false,
    distinto: false,
    igualGuardado: false,
    andTest: false,
    orTest: false,
    notTest: false
  };

  constructor(public router: Router, private http: HttpClient) {}

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
    return JSON.parse(atob(payload));
  }

  verificarComparacion(respuesta: string, prueba: string): void {
    const soluciones: any = {
      manzanas1: '>',
      vacas1: '==',
      pastel1: '<'
    };
    this.resueltos[prueba] = true;
    this.correctos[prueba] = respuesta === soluciones[prueba];
    if (this.correctos[prueba]) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarComparacionExtra(respuesta: boolean, prueba: string): void {
    const soluciones: any = {
      mayorIgual: false,
      menorIgual: true,
      distinto: true,
      igualGuardado: true,
      andTest: false,
      orTest: true,
      notTest: false
    };
    this.resueltos[prueba] = true;
    this.correctos[prueba] = respuesta === soluciones[prueba];
    if (this.correctos[prueba]) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  

  finishLevel(): void {
    if (this.puedeFinalizar < this.puntos_maximos) {
      alert('❌ Aún no has completado el nivel correctamente.');
      return;
    }

    this.http
      .put<any>('http://localhost:3000/api/niveles/actualizar', {
        correo_nino: this.correo_nino,
        nombre_nino: this.nombre_nino,
        codigo_aula: this.codigo_aula,
        nivel: this.num_nivel,
        puntos_obtenidos: this.puntos_obtenidos,
        puntos_minimos: this.puntos_minimos,
        puntos_maximos: this.puntos_maximos
      })
      .subscribe(() => {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        const decoded = this.decodeToken(token);
        const newToken = this.encodeToken({ ...decoded, codigo_aula: this.codigo_aula });
        localStorage.setItem('auth_token', newToken);
        this.router.navigate(['/nivelesNinos']);
      });
  }

  encodeToken(payload: any): string {
    const header = { alg: 'HS256', typ: 'JWT' };
    const encode = (obj: any) => btoa(JSON.stringify(obj)).replace(/=+$/, '');
    return `${encode(header)}.${encode(payload)}.fake-signature`;
  }
}
