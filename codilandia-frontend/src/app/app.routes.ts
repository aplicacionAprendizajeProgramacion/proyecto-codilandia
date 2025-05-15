import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './inicio/inicio.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';


import { InicioSesionComponent } from './inicio-sesion/inicio-sesion.component';
import { InicioNinoComponent } from './inicio-nino/inicio-nino.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';
import { NivelesNinosComponent } from './nivelesNinos/nivelesNinos.component';
import { ProfesorComponent } from './profesor/profesor.component'; 
import { CursoComponent } from './curso/curso.component';
import { SolictudesComponent } from './solictudes/solictudes.component';
import { AlumnosComponent } from './alumnos/alumnos.component';
import { EstadisticasComponent } from './estadisticas/estadisticas.component';
import { Nivel1Component } from './nivel1/nivel1.component';
import { Nivel2Component } from './nivel2/nivel2.component';
import { Nivel3Component } from './nivel3/nivel3.component';
import { Nivel4Component } from './nivel4/nivel4.component';
import { Nivel5Component } from './nivel5/nivel5.component';
import { Nivel6Component } from './nivel6/nivel6.component';
import { Nivel7Component } from './nivel7/nivel7.component';
import { Nivel8Component } from './nivel8/nivel8.component';
import { Nivel9Component } from './nivel9/nivel9.component';
import { Nivel10Component } from './nivel10/nivel10.component';
import { Nivel11Component } from './nivel11/nivel11.component';

export const routes: Routes = [
  { path: '', component: InicioComponent }, 
  { path: 'registro', component: RegistroComponent },
  { path: 'inicio-sesion', component: InicioSesionComponent },
  { path: 'recuperacion', component: RecuperacionComponent },
 {
    path: 'inicio-nino',
    component: InicioNinoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivelesNinos',
    component: NivelesNinosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel1',
    component: Nivel1Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel2',
    component: Nivel2Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel3',
    component: Nivel3Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel4',
    component: Nivel4Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel5',
    component: Nivel5Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel6',
    component: Nivel6Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel7',
    component: Nivel7Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel8',
    component: Nivel8Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel9',
    component: Nivel9Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel10',
    component: Nivel10Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
  {
    path: 'nivel11',
    component: Nivel11Component,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'nino' }
  },
 {
    path: 'profesor',
    component: ProfesorComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'adulto' }
  },
  {
    path: 'curso/:codigo',
    component: CursoComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'adulto' }
  },
  {
    path: 'solicitudes/:codigo',
    component: SolictudesComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'adulto' }
  },
  {
    path: 'alumnos/:codigo',
    component: AlumnosComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'adulto' }
  },
  {
    path: 'estadisticas/:codigo',
    component: EstadisticasComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { expectedRole: 'adulto' }
  }
];

export const AppRoutingModule = RouterModule.forRoot(routes);
