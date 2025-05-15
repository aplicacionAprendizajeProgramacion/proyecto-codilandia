import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, transferArrayItem,moveItemInArray } from '@angular/cdk/drag-drop';
import { DragDropModule } from '@angular/cdk/drag-drop';



@Component({
  selector: 'app-nivel8',
  imports: [CommonModule, FormsModule, DragDropModule],
  templateUrl: './nivel8.component.html',
  standalone: true,
  styleUrl: './nivel8.component.css'
})
export class Nivel8Component implements OnInit {
  correo_nino: string = '';
  nombre_nino: string = '';
  codigo_aula: string = '';
  num_nivel: number = 8;
  puntos_obtenidos: number = 0;
  puntos_minimos: number = 6;
  puntos_maximos: number = 9;
  puedeFinalizar = 0;

  // Inputs
  comentario1: string = '';
  comentario2: string = '';
  comentario3: string = '';
  comentario4: string = '';
  comentario5: string = '';
  comentario6: string = '';
  comentario7: string = '';
  comentario8: string = '';
  comentario9: string = '';

  var_int: string = '';
  var_float: string = '';
  var_bool: string = '';
  var_string: string = '';
  mensajeCopiado: string | null = null;

  // Estados
  resueltos = {
    comentario1: false,
    comentario2: false,
    comentario3: false,
    comentario4: false,
    comentario5: false,
    comentario6: false,
    comentario7: false,
    comentario8: false,
    comentario9: false
  };

  correctos = {
    comentario1: false,
    comentario2: false,
    comentario3: false,
    comentario4: false,
    comentario5: false,
    comentario6: false,
    comentario7: false,
    comentario8: false,
    comentario9: false
  };



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
    const esperado1 = 'leer("libro");';
    const esperado2 = 'leer(libro);';
    const entrada = this.comentario1.toLowerCase().replace(/\s/g, '');
  
    this.resueltos.comentario1 = true;
    this.correctos.comentario1 =
      entrada === esperado1.toLowerCase().replace(/\s/g, '') ||
      entrada === esperado2.toLowerCase().replace(/\s/g, '');
      
    if (this.correctos.comentario1) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  
  verificarPrueba2(): void {
    const esperado1 = 'jugar("casa");';
    const esperado2 = 'jugar("fuera");';
    const esperado3 = 'jugar(casa);';
    const esperado4 = 'jugar(fuera);';
    const entrada2 = this.comentario2.toLowerCase().replace(/\s/g, '');
    const entrada3 = this.comentario3.toLowerCase().replace(/\s/g, '');
  
    this.resueltos.comentario2 = true;
    this.resueltos.comentario3 = true;
    this.correctos.comentario2 = entrada2 === esperado1.toLowerCase().replace(/\s/g, '') || 
    entrada2 === esperado3.toLowerCase().replace(/\s/g, '');
    this.correctos.comentario3 = entrada3 === esperado2.toLowerCase().replace(/\s/g, '') || 
    entrada3 === esperado4.toLowerCase().replace(/\s/g, '');
  
    if (this.correctos.comentario2) this.puntos_obtenidos++;
    if (this.correctos.comentario3) this.puntos_obtenidos++;
    this.puedeFinalizar = this.puedeFinalizar+2;
  }
  
  verificarPrueba3(): void {
    const opciones1 = ['pintar("sol");', 'pintar(sol);'];
    const opciones2 = ['pintar("cielo");', 'pintar(cielo);'];
    const opciones3 = ['pintar("planta");', 'pintar(planta);'];
  
    const entrada4 = this.comentario4.toLowerCase().replace(/\s/g, '');
    const entrada5 = this.comentario5.toLowerCase().replace(/\s/g, '');
    const entrada6 = this.comentario6.toLowerCase().replace(/\s/g, '');
  
    this.resueltos.comentario4 = true;
    this.resueltos.comentario5 = true;
    this.resueltos.comentario6 = true;
  
    this.correctos.comentario4 = opciones1.some(op =>
      entrada4 === op.toLowerCase().replace(/\s/g, '')
    );
    this.correctos.comentario5 = opciones2.some(op =>
      entrada5 === op.toLowerCase().replace(/\s/g, '')
    );
    this.correctos.comentario6 = opciones3.some(op =>
      entrada6 === op.toLowerCase().replace(/\s/g, '')
    );
  
    if (this.correctos.comentario4) this.puntos_obtenidos++;
    if (this.correctos.comentario5) this.puntos_obtenidos++;
    if (this.correctos.comentario6) this.puntos_obtenidos++;
    this.puedeFinalizar = this.puedeFinalizar+3;
  }
  
  

  verificarPrueba4(): void {
    const esperado1 = 'mesActual == Junio || mesActual== Julio || mesActual == Agosto';
    const esperado2 = 'mesActual == Diciembre || mesActual== Enero || mesActual == Febrero';
    const esperado3 = 'mesActual == Marzo || mesActual== Abril || mesActual == Mayo';
    this.resueltos.comentario7 = true;
    this.resueltos.comentario8 = true;
    this.resueltos.comentario9 = true;
    this.correctos.comentario7 = this.comentario7.trim() === esperado1;
    this.correctos.comentario8 = this.comentario8.trim() === esperado2;
    this.correctos.comentario9 = this.comentario9.trim() === esperado3;
    if (this.correctos.comentario7) this.puntos_obtenidos++;
    if (this.correctos.comentario8) this.puntos_obtenidos++;
    if (this.correctos.comentario9) this.puntos_obtenidos++;
    this.puedeFinalizar = this.puedeFinalizar+3;
  }

  copiarAlPortapapeles(elemento: HTMLElement) {
    const texto = elemento.innerText;
    navigator.clipboard.writeText(texto)
      .then(() => {
        this.mensajeCopiado = 'Texto copiado al portapapeles ✅';
        setTimeout(() => {
          this.mensajeCopiado = null;
        }, 3000); 
      })
      .catch(err => {
        console.error('Error al copiar al portapapeles:', err);
      });
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
