import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, transferArrayItem,moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-nivel9',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './nivel9.component.html',
  standalone: true,
  styleUrl: './nivel9.component.css'
})
export class Nivel9Component implements OnInit {
  correo_nino: string = '';
  nombre_nino: string = '';
  codigo_aula: string = '';
  num_nivel: number = 9;
  puntos_obtenidos: number = 0;
  puntos_minimos: number = 4;
  puntos_maximos: number = 6;
  puedeFinalizar = 0;
  numeroPasteles = 1;
  esEnteroCorrecto = false;
  // Inputs
  comentario1: string = '';
  comentario2: string = '';
  comentario3: string = '';
  comentario4: string = '';
  comentario5: string = '';
  comentario6: string = '';
  comentario7: string = '';

  var_int: string = '';
  var_float: string = '';
  var_bool: string = '';
  var_string: string = '';

  // Estados
  resueltos = {
    comentario1: false,
    comentario2: false,
    comentario3: false,
    comentario4: false,
    comentario5: false,
    comentario6: false,
    comentario7: false
  };

  correctos = {
    comentario1: false,
    comentario2: false,
    comentario3: false,
    comentario4: false,
    comentario5: false,
    comentario6: false,
    comentario7: false
  };

  opciones2: string[] = [
    'El bucle se detiene enseguida.',
    'El bucle sigue para siempre.',
    'El bucle se rompe solo.',
  ];

  opciones3: string[] = [
    '0',
    '5',
    'Hasta que me canse',
  ];

  opciones4: string[] = [
    'Mientras no esté limpia tu habitación, sigues ordenando.',
    'Comer solo una vez.',
    'Elegir a qué jugar.',
  ];

  constructor(
    public router: Router,
    private http: HttpClient
  ) {}

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

  verificarPrueba1(): void {
    const opciones = ['bailo();', 'baila();'];
  
    const entrada = this.comentario1.toLowerCase().replace(/\s/g, '');
  
    this.resueltos.comentario1 = true;
    this.correctos.comentario1 = opciones.some(op => 
      entrada === op.toLowerCase().replace(/\s/g, '')
    );
  
    if (this.correctos.comentario1) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  
  verificarPrueba2(): void {
    const opciones = ['terminado = false;'];
  
    const entrada = this.comentario2.toLowerCase().replace(/\s/g, '');
  
    this.resueltos.comentario2 = true;
    this.correctos.comentario2 = opciones.some(op =>
      entrada === op.toLowerCase().replace(/\s/g, '')
    );
  
    if (this.correctos.comentario2) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  
  verificarPrueba3(): void {
    const opciones = ['pasteles = pasteles - 1;', 'pasteles--;'];
  
    const entrada = this.comentario4.toLowerCase().replace(/\s/g, '');
  
    this.esEnteroCorrecto = this.numeroPasteles >= 1 && this.numeroPasteles <= 10;
  
    if (this.esEnteroCorrecto) {
      this.correctos.comentario3 = true;
      this.resueltos.comentario3 = true;
      this.resueltos.comentario4 = true;
      this.correctos.comentario4 = opciones.some(op =>
        entrada === op.toLowerCase().replace(/\s/g, '')
      );
    }
  
    if (this.correctos.comentario4 && this.esEnteroCorrecto) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  

  verificarPrueba4(): void {
    const correcto = 'El bucle sigue para siempre.';
    this.resueltos.comentario5 = true;
    this.correctos.comentario5 = this.comentario5.trim() === correcto;
    if (this.correctos.comentario5) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarPrueba5(): void {
    const correcto = '5';
    this.resueltos.comentario6 = true;
    this.correctos.comentario6 = this.comentario6.trim() === correcto;
    if (this.correctos.comentario6) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarPrueba6(): void {
    const correcto = 'Mientras no esté limpia tu habitación, sigues ordenando.';
    this.resueltos.comentario7 = true;
    this.correctos.comentario7 = this.comentario7.trim() === correcto;
    if (this.correctos.comentario7) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  finishLevel(): void {
    if (this.puedeFinalizar < this.puntos_maximos) {
      alert('❌ Aún no has completado el nivel correctamente.');
      return;
    }

    this.http
      .put<any>('https://proyecto-codilandia-backend.onrender.com/api/niveles/actualizar', {
        correo_nino: this.correo_nino,
        nombre_nino: this.nombre_nino,
        codigo_aula: this.codigo_aula,
        nivel: this.num_nivel,
        puntos_obtenidos: this.puntos_obtenidos,
        puntos_minimos: this.puntos_minimos,
        puntos_maximos: this.puntos_maximos
      })
      .subscribe({
        next: () => {
          const token = localStorage.getItem('auth_token');
          if (!token) return;
          const decoded = this.decodeToken(token);
          const updatedPayload = { ...decoded, codigo_aula: this.codigo_aula };
          const newToken = this.encodeToken(updatedPayload);
          localStorage.setItem('auth_token', newToken);
          this.router.navigate(['/nivelesNinos']);
        },
        error: (err) => {
          console.error('Error al actualizar el nivel', err);
        }
      });
  }
}
