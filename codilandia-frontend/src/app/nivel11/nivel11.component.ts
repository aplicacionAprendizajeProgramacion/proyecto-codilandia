import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nivel11',
  templateUrl: './nivel11.component.html',
  styleUrls: ['./nivel11.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Nivel11Component {

  correo_nino: string = '';
  nombre_nino: string = '';
  codigo_aula: string = '';
  num_nivel: number = 11;
  puntos_obtenidos: number = 0;
  puntos_minimos: number = 2;
  puntos_maximos: number = 3;
  puedeFinalizar = 0;

  respuestaFuncion = '';
  respuestaCorrectaFuncion = false;
  resueltoFuncion = false;

  respuestaLlamada = '';
  respuestaCorrectaLlamada = false;
  resueltoLlamada = false;

  respuestaParametros = '';
  respuestaCorrectaParametros = false;
  resueltoParametros = false;

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

  verificarFuncion() {
    this.resueltoFuncion = true;
    this.respuestaCorrectaFuncion = this.respuestaFuncion.trim().toLowerCase() === 'void';
    if (this.respuestaCorrectaFuncion) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarLlamada() {
    const textoNormalizado = this.respuestaLlamada.replace(/\s+/g, '').toLowerCase();
    this.resueltoLlamada = true;
    this.respuestaCorrectaLlamada = textoNormalizado === 'bienvenida();';
    if (this.respuestaCorrectaLlamada) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarParametros() {
    const entrada = this.respuestaParametros.trim().toLowerCase();
  
    const partes = entrada.split(',').map(p => p.trim());
  
    if (partes.length !== 2) {
      this.respuestaCorrectaParametros = false;
    } else {
      const esValido = partes.every(parte => {
        const match = parte.match(/^int\s+[a-zA-Z_][a-zA-Z0-9_]*$/);
        return !!match;
      });
      this.respuestaCorrectaParametros = esValido;
    }
  
    this.resueltoParametros = true;
    if (this.respuestaCorrectaParametros) this.puntos_obtenidos++;
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
