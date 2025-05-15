import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nivel4',
  templateUrl: './nivel4.component.html',
  styleUrls: ['./nivel4.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Nivel4Component implements OnInit {
  correo_nino = '';
  nombre_nino = '';
  codigo_aula = '';
  num_nivel = 4;
  puntos_obtenidos = 0;
  puntos_minimos = 10;
  puntos_maximos = 14;
  puedeFinalizar = 0;

  suma1 = { cesta1: 0, cesta2: 0, total: 0 };
  resta = { cesta: 0, tomar: 0, resultado: 0 };
  multi = { porCorral: 0, numCorrales: 0, resultado: 0 };
  div = { porciones: 1, ninos: 1, resultado: 0 };

  resueltoSuma = false;
  resueltoResta = false;
  resueltoMultiplicacion = false;
  resueltoDivision = false;

  correctoSuma = false;
  correctoResta = false;
  correctoMultiplicacion = false;
  correctoDivision = false;

  variables = [
    { label: 'int suma = 3 + 5;', valor: '', solucion: 'intsuma=3+5;', resuelto: false, correcto: false },
    { label: 'double suma = 1.5 + 2.5;', valor: '', solucion: 'doublesuma=1.5+2.5;', resuelto: false, correcto: false },
    { label: 'int diferencia = 10 - 4;', valor: '', solucion: 'intdiferencia=10-4;', resuelto: false, correcto: false },
    { label: 'double diferencia = 10.5 - 4.25;', valor: '', solucion: 'doublediferencia=10.5-4.25;', resuelto: false, correcto: false },
    { label: 'int multiplicacion = 4 * 3;', valor: '', solucion: 'intmultiplicacion=4*3;', resuelto: false, correcto: false },
    { label: 'double multiplicacion = 2.5 * 1.2;', valor: '', solucion: 'doublemultiplicacion=2.5*1.2;', resuelto: false, correcto: false },
    { label: 'int division = 8 / 2;', valor: '', solucion: 'intdivision=8/2;', resuelto: false, correcto: false },
    { label: 'double division = 9.0 / 3.0;', valor: '', solucion: 'doubledivision=9.0/3.0;', resuelto: false, correcto: false }
  ];
  
  tipoOperacion1 = {
    tipoEsperado: 'int',
    resuelto: false,
    correcto: false
  };
  
  tipoOperacion2 = {
    tipoEsperado: 'double',
    resuelto: false,
    correcto: false
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

  getPorcionesEnteras(): number[] {
    const porciones = Math.floor(this.div.resultado || 0);
    return Array(porciones).fill(0);
  }
  
  getPorcionesPorNino(): number {
    return this.div.ninos > 0 ? Math.floor(this.div.porciones / this.div.ninos) : 0;
  }
  
  getPorcionesSobrantes(): number {
    if (!this.div.porciones || !this.div.ninos || this.div.ninos === 0) return 0;
    const sobrantes = this.div.porciones % this.div.ninos;
    return sobrantes;
  }
 
  verificarSuma() {
    this.suma1.total = this.suma1.cesta1 + this.suma1.cesta2;
    this.correctoSuma = Number.isInteger(this.suma1.total);
    this.resueltoSuma = true;
    if (this.correctoSuma) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarResta() {
    this.resta.resultado = this.resta.cesta - this.resta.tomar;
    this.correctoResta = this.resta.resultado >= 0;
    this.resueltoResta = true;
    if (this.correctoResta) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarMultiplicacion() {
    this.multi.resultado = this.multi.porCorral * this.multi.numCorrales;
    this.correctoMultiplicacion = true;
    this.resueltoMultiplicacion = true;
    this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarDivision() {
    this.div.resultado = parseFloat((this.div.porciones / this.div.ninos).toFixed(2));
    this.correctoDivision = !isNaN(this.div.resultado);
    this.resueltoDivision = true;
  
    if (this.correctoDivision) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  getMensajeDivision(): string {
    if (!this.resueltoDivision) return '';
    if (this.div.porciones < this.div.ninos) {
      return 'Vaya, no hay suficientes trozos para cada uno, se tendrá que compartir!';
    }
    return '';
  }
  
  getMensajeSobrante(): string {
    if (!this.resueltoDivision) return '';
    const sobrantes = this.getPorcionesSobrantes();
    return sobrantes > 0 ? `Mira, han sobrado ${sobrantes} trozo(s) 🍰` : '';
  }
  

  verificarVariable(index: number) {
    const v = this.variables[index];
    const texto = v.valor.replace(/\s/g, '');
    v.resuelto = true;
    v.correcto = texto === v.solucion;
    if (v.correcto) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  obtenerNombre(label: string): string {
    const match = label.match(/^\w+\s+(\w+)/);
    return match ? match[1] : 'mi_variable';
  }
  
  obtenerOperacion(label: string): string {
    const match = label.match(/=\s*(.+);/);
    return match ? match[1] : '';
  }
  
  verificarTipoResultado(respuesta: 'int' | 'double') {
    this.tipoOperacion1.resuelto = true;
    this.tipoOperacion1.correcto = respuesta === this.tipoOperacion1.tipoEsperado;
    if (this.tipoOperacion1.correcto) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  
  verificarTipoResultado2(respuesta: 'int' | 'double') {
    this.tipoOperacion2.resuelto = true;
    this.tipoOperacion2.correcto = respuesta === this.tipoOperacion2.tipoEsperado;
    if (this.tipoOperacion2.correcto) this.puntos_obtenidos++;
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
