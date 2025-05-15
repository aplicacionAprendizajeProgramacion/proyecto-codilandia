import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const expectedRole = route.data['expectedRole'];
    const actualRole = this.auth.getUserTipo();

    if (this.auth.isAuthenticated() && actualRole === expectedRole) {
      return true;
    }

    this.router.navigate(['/inicio-sesion']);
    return false;
  }
}
