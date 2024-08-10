import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  showSpinner: boolean = false;
  mediaUrl = 'http://localhost:8000/media/';

  constructor(private authService: AuthService, private router: Router) {}

  login(): void {
    this.showSpinner = true; 
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        // Handle successful login, e.g., navigate to dashboard
        console.log('Login successful:', response);
        // Navigate to race checklist 
        this.router.navigate(['/home']);
      },
      (error) => {
        // Handle login error, e.g., display error message
        console.error('Login failed:', error);
      }
    );
  }
}



