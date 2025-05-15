import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; 
@Component({
  selector: 'app-recuperacion',
  templateUrl: './recuperacion.component.html',
  styleUrls: ['./recuperacion.component.css'],
  imports: [FormsModule, CommonModule]
})
export class RecuperacionComponent implements OnInit {
  email: string = '';
  username: string = '';
  newPassword: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.email = this.route.snapshot.queryParamMap.get('email')!;
    this.username = this.route.snapshot.queryParamMap.get('username')!;
  }

  onSubmit() {
    if (!this.newPassword) {
      this.errorMessage = 'La nueva contraseña es obligatoria';
      return;
    }

    this.isLoading = true;
    this.http.post<any>('https://proyecto-codilandia-backend.onrender.com/api/users/update-password', {
      email: this.email,
      username: this.username,
      newPassword: this.newPassword
    }).subscribe({
      next: (res) => {
        alert('Contraseña actualizada con éxito');
        this.router.navigate(['/inicio-sesion']);
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = err.error?.error || 'Error al actualizar la contraseña';
        this.isLoading = false;
      }
    });
  }    

  cancel(): void {
    this.router.navigate(['/inicio-sesion']);
  }
}