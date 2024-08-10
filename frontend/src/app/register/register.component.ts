import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  email: string = '';
  password1: string = '';
  password2: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  register(): void {
    if (this.password1 !== this.password2) {
      console.error('Passwords do not match');
      return;
    }

    this.authService.register(this.username, this.email, this.password1, this.password2).subscribe(
      (response) => {
        console.log('Registration successful', response);
        this.router.navigate(['/home']);
      },
      (error) => {
        console.error('Registration failed:', error);
        // Handle registration error, display error message
      }
    );
  }
}

