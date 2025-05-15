import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nivel2',
  templateUrl: './nivel2.component.html',
  styleUrls: ['./nivel2.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Nivel2Component implements OnInit {
  correo_nino: string = '';
  nombre_nino: string = '';
  codigo_aula: string = '';
  num_nivel: number = 2;
  puntos_obtenidos: number = 0;
  puntos_minimos: number = 5;
  puntos_maximos: number = 7;
  puedeFinalizar: number = 0;


  // Datos
  numeroManzanas: number = 0;
  textoUsuario: string = '';
  fraseUsuario: string = '';
  fraseCorrecta: boolean = false;

  listaMonedas = [1, 2, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01];
  monedasSeleccionadas: number[] = [];
  sumaMonedas: number = 0;


  resueltoEntero = false;
  resueltoReal = false;
  resueltoPastel = false;
  resueltoPorciones = false;
  resueltoString = false;
  resueltoFrase = false;

  esEnteroCorrecto = false;
  esRealCorrecto = false;
  respuestaPastelCorrecta = false;
  respuestaPorcionesCorrecta = false;
  esStringCorrecto = false;

  respuestaPlatanos: string = '';
  resueltoPlatanos: boolean = false;
  respuestaPlatanosCorrecta: boolean = false;


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

  agregarMoneda(valor: number) {
    this.monedasSeleccionadas.push(valor);
    this.actualizarSuma();
  }

  eliminarMoneda(index: number) {
    this.monedasSeleccionadas.splice(index, 1);
    this.actualizarSuma();
  }

  actualizarSuma() {
    this.sumaMonedas = this.monedasSeleccionadas.reduce((acc, val) => acc + val, 0);
  }

  getImagenMoneda(valor: number): string {
    const mapa: { [key: number]: string } = {
      1: '1euro.png',
      2: '2euro.png',
      0.5: '50cent.png',
      0.2: '20cent.png',
      0.1: '10cent.png',
      0.05: '5cent.png',
      0.02: '2cent.png',
      0.01: '1cent.png'
    };
    return mapa[valor] || '';
  }

  verificarEntero() {
    this.resueltoEntero = true;
    this.esEnteroCorrecto = this.numeroManzanas >= 1 && this.numeroManzanas <= 10;
    if (this.esEnteroCorrecto) this.puntos_obtenidos++;
    this.puedeFinalizar++;
}

  verificarPlatanos() {
    const sinEspacios = this.respuestaPlatanos.replace(/\s/g, '').toLowerCase();
    this.resueltoPlatanos = true;
    this.respuestaPlatanosCorrecta = sinEspacios === 'intnumero_bananas=4;';
    if (this.respuestaPlatanosCorrecta) {
      this.puntos_obtenidos++;
    }
    this.puedeFinalizar++;
  }
  
  verificarReal() {
    this.resueltoReal = true;
    this.esRealCorrecto = Math.abs(this.sumaMonedas - 2.55) < 0.01;
    if (this.esRealCorrecto) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }  

  verificarBooleano(resp: boolean, tipo: 'pastel' | 'porciones') {
    if (tipo === 'pastel') {
      this.respuestaPastelCorrecta = resp === true;
      this.resueltoPastel = true;
      if (this.respuestaPastelCorrecta) this.puntos_obtenidos++;
      this.puedeFinalizar++;
    }

    if (tipo === 'porciones') {
      this.respuestaPorcionesCorrecta = resp === false;
      this.resueltoPorciones = true;
      if (this.respuestaPorcionesCorrecta) this.puntos_obtenidos++;
      this.puedeFinalizar++;
    }

  }

  verificarString() {
    this.resueltoString = true;
    this.esStringCorrecto = this.textoUsuario.trim().length > 0;
    if (this.esStringCorrecto) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarFrase() {
    const fraseUsuarioNormalizada = this.fraseUsuario.replace(/\s+/g, '').toLowerCase(); // elimina TODOS los espacios
    const fraseCorrectaNormalizada = 'stringfrase="trestristestigrescomíantrigoenuntrigal";';
  
    this.fraseCorrecta = fraseUsuarioNormalizada === fraseCorrectaNormalizada;
    this.resueltoFrase = true;
  
    if (this.fraseCorrecta) this.puntos_obtenidos++;

    this.puedeFinalizar++;
  }
  

  finishLevel(): void {
    if (this.puedeFinalizar !== this.puntos_maximos) {
      alert("❌ Aún no has respondido a todas las pruebas.");
      return;
    }
  
    if (this.puntos_obtenidos < this.puntos_minimos) {
      alert("❌ Has respondido a todo, pero no has acertado lo suficiente. ¡Sigue intentándolo!");
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const decoded = this.decodeToken(token);
      const updatedPayload = { ...decoded, codigo_aula: this.codigo_aula };
      const newToken = this.encodeToken(updatedPayload);
      localStorage.setItem('auth_token', newToken);

      this.router.navigate(['/nivelesNinos']);
    }
  
    alert("HAS PASADO EL NIVEL! ENHORABUENA");

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
