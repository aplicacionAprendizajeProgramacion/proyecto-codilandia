import { Component } from '@angular/core';
import { Router } from '@angular/router'; 

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {

  constructor(private router: Router) {} 
  
  // Método del botón de iniciar sesión
  iniciarSesion() {
    console.log('Iniciar sesión');
    this.router.navigate(['/inicio-sesion']);
  }

  // Método del botón de registrarse
  registrarse() {
    console.log('Registrarse');
    this.router.navigate(['/registro']);  
  }

}
