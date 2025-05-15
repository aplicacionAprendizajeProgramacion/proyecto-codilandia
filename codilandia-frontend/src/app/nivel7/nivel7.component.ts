import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, transferArrayItem,moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-nivel7',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './nivel7.component.html',
  standalone: true,
  styleUrl: './nivel7.component.css'
})
export class Nivel7Component implements OnInit {
  correo_nino: string = '';
  nombre_nino: string = '';
  codigo_aula: string = '';
  num_nivel: number = 7;
  puntos_obtenidos: number = 0;
  puntos_minimos: number = 3;
  puntos_maximos: number = 5;
  puedeFinalizar = 0;
  colorComentario: string = '#006400';

  // Inputs
  comentario1: string = '';
  comentario2: string = '';
  comentario3: string = '';
  comentario4: string = '';
  comentario5: string = '';

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
    comentario5: false
  };

  correctos = {
    comentario1: false,
    comentario2: false,
    comentario3: false,
    comentario4: false,
    comentario5: false
  };

  opcionesComentario2: string[] = [
    '// Este código imprime un saludo',
    '// Este código imprime un adiós',
    '// Este programa no hace nada',
    '// Este es un error'
  ];

  opcionesComentario3: string[] = [
    '// Declara una variable entera llamada total',
    '// Elimina la variable llamada total',
    '// Imprime el valor de la variable total',
    '// Declara una variable entera llamada parcial'
  ];

  opcionesComentario4: string[] = [
    '// Imprime el valor de la variable suma',
    '// Declara dos variables llamadas "x" e "y"',
    '// Guarda el número 10 en la variable suma',
    '// Suma los valores de "x" e "y" y los guarda en la variable suma'
  ];
  
  codigoConHuecos = [
    { codigo: 'int x = 5;' },
    { codigo: 'int y = 10;' },
    { codigo: 'int suma = x + y;' },
    { codigo: 'cout << "Resultado: " + suma);' },
    { codigo: 'return 0;' }
  ];
  
  comentariosDisponibles = [   
    '// Finaliza el programa',
    '// Declara la variable x con valor 5',
    '// Imprime el resultado',
    '// Suma x e y y guarda el resultado',
    '// Declara la variable y con valor 10'
  ];

  ordenCorrecto: string[] = [    
    '// Declara la variable x con valor 5',
    '// Declara la variable y con valor 10',
    '// Suma x e y y guarda el resultado',
    '// Imprime el resultado',
    '// Finaliza el programa'];

    

  huecos: string[][] = [[], [], [], [], []];

  resultados: boolean[] = [];

  connectedDropListsComentario: string[] = [];

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
      this.connectedDropListsComentario = ['listaComentarios', ...this.codigoConHuecos.map((_, i) => 'huecoComentario' + i)];
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

  verificarComentario1(): void {
    const esperado = '//esteprogramasaluda';
    const comentarioNormalizado = this.comentario1
      .toLowerCase()
      .replace(/\s/g, ''); 
  
    this.resueltos.comentario1 = true;
    this.correctos.comentario1 = comentarioNormalizado === esperado;
    if (this.correctos.comentario1) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  
  
  verificarComentario2(): void {
    const correcto = '// Este código imprime un adiós';
    this.resueltos.comentario2 = true;
    this.correctos.comentario2 = this.comentario2.trim() === correcto;
    if (this.correctos.comentario2) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarComentario3(): void {
    const correcto = '// Declara una variable entera llamada total';
    this.resueltos.comentario3 = true;
    this.correctos.comentario3 = this.comentario3.trim() === correcto;
    if (this.correctos.comentario3) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarComentario4(): void {
    const correcto = '// Suma los valores de "x" e "y" y los guarda en la variable suma';
    this.resueltos.comentario4 = true;
    this.correctos.comentario4 = this.comentario4.trim() === correcto;
    if (this.correctos.comentario4) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  
  verificarComentario5() {
    this.resueltos.comentario5 = true;
  
    const correcto = this.huecos.every((hueco, i) => 
      hueco.length > 0 && hueco[0] === this.ordenCorrecto[i]
    );
  
    if (correcto) {
      this.puntos_obtenidos++;
      this.correctos.comentario5 = true;
    }
  
    this.puedeFinalizar++;
  }
  

  cambiarColor(nuevoColor: string) {
    this.colorComentario = nuevoColor;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
  }

  dropComentario(event: CdkDragDrop<string[]>, index?: number): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Si estamos soltando en uno de los huecos (index está definido)
      if (typeof index === 'number') {
        // Limpiamos el hueco si ya tenía algo
        if (this.huecos[index].length > 0) {
          const comentarioPrevio = this.huecos[index].pop();
          this.comentariosDisponibles.push(comentarioPrevio!);
        }
      }
  
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
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
