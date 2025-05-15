import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { InicioNinoComponent } from './inicio-nino/inicio-nino.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { NivelesNinosComponent } from './nivelesNinos/nivelesNinos.component';
import { AppRoutingModule } from './app.routes';  
import { Nivel1Component } from './nivel1/nivel1.component';
import { Nivel2Component } from './nivel2/nivel2.component';
import { Nivel3Component } from './nivel3/nivel3.component';
import { Nivel4Component } from './nivel4/nivel4.component';
import { Nivel5Component } from './nivel5/nivel5.component';
import { Nivel6Component } from './nivel6/nivel6.component';
import { Nivel11Component } from './nivel11/nivel11.component';
import { ProfesorComponent } from './profesor/profesor.component';
import { CursoComponent } from './curso/curso.component';
import { SolictudesComponent } from './solictudes/solictudes.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { Nivel7Component } from './nivel7/nivel7.component';
import { Nivel8Component } from './nivel8/nivel8.component';
import { Nivel9Component } from './nivel9/nivel9.component';
import { Nivel10Component } from './nivel10/nivel10.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';



@NgModule({
  declarations: [
    AppComponent,
    InicioComponent,
    RegistroComponent,
    InicioSesionComponent,
    InicioNinoComponent,
    RecuperacionComponent,
    NivelesNinosComponent,
    Nivel1Component,
    Nivel2Component,
    Nivel3Component,
    Nivel4Component,
    Nivel5Component,
    Nivel6Component,   
    Nivel11Component,
    Nivel7Component,
    Nivel8Component,
    Nivel9Component,
    Nivel10Component,
    ProfesorComponent,
    CursoComponent,
    SolictudesComponent,
    AlumnosComponent,
    EstadisticasComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    DragDropModule
  ],
  providers: [AuthGuard, RoleGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
