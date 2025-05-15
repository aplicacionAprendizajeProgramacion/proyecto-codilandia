import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nivel3',
  templateUrl: './nivel3.component.html',
  styleUrls: ['./nivel3.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class Nivel3Component implements OnInit {
  correo_nino: string = '';
  nombre_nino: string = '';
  codigo_aula: string = '';
  num_nivel: number = 3;
  puntos_obtenidos: number = 0;
  puntos_minimos: number = 5;
  puntos_maximos: number = 7;
  puedeFinalizar = 0;

  // Inputs
  frase1: string = '';
  saludo_sin_endl: string = '';
  saludo_con_endl: string = '';

  var_int: string = '';
  var_double: string = '';
  var_bool: string = '';
  var_string: string = '';


  resueltos = {
    frase1: false,
    saludo_sin_endl: false,
    saludo_con_endl: false,
    int: false,
    double: false,
    bool: false,
    string: false,
  };
  
  correctos = {
    frase1: false,
    saludo_sin_endl: false,
    saludo_con_endl: false,
    int: false,
    double: false,
    bool: false,
    string: false
  };

  conSalto = {
    int: false,
    double: false,
    bool: false,
    string: false
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

  verificarFrase1(): void {
    const input = this.frase1.trim();
    const empiezaYTerminaConComillas = input.startsWith('"') && input.endsWith('"');
  
    this.resueltos.frase1 = true;
    this.correctos.frase1 = empiezaYTerminaConComillas;
  
    if (empiezaYTerminaConComillas) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  
  
  verificarSaludoSinEndl(): void {
    const normalizado = this.saludo_sin_endl.replace(/\s/g, '').toLowerCase();
    this.resueltos.saludo_sin_endl = true;
    this.correctos.saludo_sin_endl = normalizado === 'cout<<"holajuan!";';
    if (this.correctos.saludo_sin_endl) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }
  
  verificarSaludoConEndl(): void {
    const normalizado = this.saludo_con_endl.replace(/\s/g, '').toLowerCase();
    this.resueltos.saludo_con_endl = true;
    this.correctos.saludo_con_endl = normalizado === 'cout<<"holajuan!"<<endl;' || normalizado === 'cout<<"holajuan!"<<endl;';
    if (this.correctos.saludo_con_endl) this.puntos_obtenidos++;
    this.puedeFinalizar++;
  }

  verificarVar(tipo: 'int' | 'double' | 'bool' | 'string') {
    const entradaNormalizada = this[`var_${tipo}`].replace(/\s/g, '').toLowerCase();
  
    const soluciones = {
      int: ['cout<<edad<<endl;', 'cout<<edad;'],
      double: ['cout<<altura<<endl;', 'cout<<altura;'],
      bool: ['cout<<feliz<<endl;', 'cout<<feliz;'],
      string: ['cout<<nombre<<endl;', 'cout<<nombre;']
    };
  
    this.resueltos[tipo] = true;
    this.correctos[tipo] = soluciones[tipo].includes(entradaNormalizada);
    this.conSalto[tipo] = entradaNormalizada.includes('endl');

    if (this.correctos[tipo]) this.puntos_obtenidos++;
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
