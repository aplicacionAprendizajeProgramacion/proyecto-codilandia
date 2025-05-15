import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
    CdkDragDrop,
    moveItemInArray,
    transferArrayItem
  } from '@angular/cdk/drag-drop';

interface Bloque {
  id: string;
  texto: string;
}

@Component({
  selector: 'app-nivel6',
  templateUrl: './nivel6.component.html',
  styleUrls: ['./nivel6.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule]
})
export class Nivel6Component implements OnInit {
    
  correo_nino = '';
  nombre_nino = '';
  codigo_aula = '';
  num_nivel = 6;
  puntos_obtenidos = 0;
  puntos_minimos = 7;
  puntos_maximos = 9;
  puedeFinalizar = 0;

  bloquesDisponibles: string[] = ['string', '"Mundo"', ';' , '+', '"Hola"', 'frase', '='];
  bloquesSeleccionados: (string | null)[] = Array(7).fill(null);
  idsHuecos = ['hueco0', 'hueco1', 'hueco2', 'hueco3', 'hueco4', 'hueco5', 'hueco6'];
  connectedDropLists: string[] = [];
  
  bloquesFormateoExtra: Bloque[] = [
    { id: 'b1', texto: '"Soy"' },
    { id: 'b2', texto: '+' },
    { id: 'b3', texto: '" "' },
    { id: 'b4', texto: '+' },
    { id: 'b5', texto: 'nombre' },
    { id: 'b6', texto: '+' },
    { id: 'b7', texto: '" y tengo "' },
    { id: 'b8', texto: '+' },
    { id: 'b9', texto: 'edad' },
    { id: 'b10', texto: '+' },
    { id: 'b11', texto: '" años."' }
  ];
  bloquesSeleccionadosFormateoExtra: (Bloque | null)[] = Array(11).fill(null);
  idsHuecosFormateoExtra = Array.from({ length: 11 }, (_, i) => `huecoFormateoExtra${i}`);

  respuestas: Record<string, string> = {
    concatenacion: '',
    concatVariables: '',
    sumaFinal: '',
    longitud: '',
    lengthExtra: '',
    primerLetra: '',
    charAccess: '',
    formateo: '',
    formateoExtra: '',
    division: ''
  };

  correctas: Record<string, string> = {
    concatenacion: 'Hola mundo',
    concatVariables: 'Hola Leo',
    sumaFinal: '8 años',
    longitud: '5',
    lengthExtra: '4',
    primerLetra: 'C',
    charAccess: 'r',
    formateo: 'Mi nombre es Ana y tengo 8 años.',
    formateoExtra: 'Hola, soy Luis y tengo 10 años.',
    division: '¿cómo'
  };

  correcto: Record<string, boolean> = {};
  resuelto: Record<string, boolean> = {};

  constructor(public router: Router, private http: HttpClient) {
    for (let key in this.correctas) {
      this.correcto[key] = false;
      this.resuelto[key] = false;
    }
  }

  ngOnInit(): void {
    const token = localStorage.getItem('auth_token');
    if (token) {
      const user = this.decodeToken(token);
      this.correo_nino = user?.correo_usuario;
      this.nombre_nino = user?.nombre_usuario;
      this.codigo_aula = user?.codigo_aula;
      this.connectedDropLists = ['disponiblesList', ...this.idsHuecos, 'formateoExtraList', ...this.idsHuecosFormateoExtra];
    } else {
      this.router.navigate(['/login']);
    }
  }

  dropEnHueco(event: CdkDragDrop<(string | null)[]>, index: number) {
    const item = event.item.data;

    const anterior = this.bloquesSeleccionados[index];
    if (anterior) {
      this.bloquesDisponibles.push(anterior);
    }

    this.bloquesSeleccionados[index] = item;

    if (event.previousContainer.id === 'disponiblesList') {
      this.bloquesDisponibles = this.bloquesDisponibles.filter(b => b !== item);
    } else {
      const fromIndex = this.idsHuecos.indexOf(event.previousContainer.id);
      if (fromIndex !== -1) {
        this.bloquesSeleccionados[fromIndex] = null;
      }
    }
  }

  dropEnDisponibles(event: CdkDragDrop<string[]>) {
    const item = event.item.data;

    const fromIndex = this.idsHuecos.indexOf(event.previousContainer.id);
    if (fromIndex !== -1) {
      this.bloquesSeleccionados[fromIndex] = null;
    }

    if (!this.bloquesDisponibles.includes(item)) {
      this.bloquesDisponibles.push(item);
    }
  }

  verificarBloques() {
    const respuestaUsuario = this.bloquesSeleccionados.join(' ').trim();
    const respuestaCorrecta = 'string frase = "Hola" + "Mundo" ;';

    this.resuelto['concatenacion'] = true;
    this.correcto['concatenacion'] = respuestaUsuario === respuestaCorrecta;

    if (this.correcto['concatenacion']) this.puntos_obtenidos++;
    this.puedeFinalizar++;
    console.log(this.puedeFinalizar);
  }

  dropEnHuecoFormateoExtra(event: CdkDragDrop<(Bloque | null)[]>, index: number) {
    const item = event.item.data as Bloque;

    const anterior = this.bloquesSeleccionadosFormateoExtra[index];
    if (anterior) {
      this.bloquesFormateoExtra.push(anterior);
    }

    this.bloquesSeleccionadosFormateoExtra[index] = item;

    if (event.previousContainer.id === 'formateoExtraList') {
      this.bloquesFormateoExtra = this.bloquesFormateoExtra.filter(b => b.id !== item.id);
    } else {
      const fromIndex = this.idsHuecosFormateoExtra.indexOf(event.previousContainer.id);
      if (fromIndex !== -1) {
        this.bloquesSeleccionadosFormateoExtra[fromIndex] = null;
      }
    }
  }

  dropEnFormateoExtra(event: CdkDragDrop<Bloque[]>) {
    const item = event.item.data as Bloque;
    const fromIndex = this.idsHuecosFormateoExtra.indexOf(event.previousContainer.id);
    if (fromIndex !== -1) {
      this.bloquesSeleccionadosFormateoExtra[fromIndex] = null;
    }
    if (!this.bloquesFormateoExtra.find(b => b.id === item.id)) {
      this.bloquesFormateoExtra.push(item);
    }
  }

  verificarFormateoExtra() {
    const respuestaUsuario = this.bloquesSeleccionadosFormateoExtra
      .map(b => b?.texto ?? '')
      .join(' ')
      .trim();

    const respuestaCorrecta =
      '"Soy" + " " + nombre + " y tengo " + edad + " años."';

    this.resuelto['formateoExtra'] = true;
    this.correcto['formateoExtra'] = respuestaUsuario === respuestaCorrecta;

    if (this.correcto['formateoExtra']) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }


  decodeToken(token: string) {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  }

  verificar(nombre: string) {
    this.resuelto[nombre] = true;
    this.correcto[nombre] =
      this.respuestas[nombre].trim() === this.correctas[nombre];
    if (this.correcto[nombre]) this.puntos_obtenidos++;
    this.puedeFinalizar++;
    console.log(this.puedeFinalizar);
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
