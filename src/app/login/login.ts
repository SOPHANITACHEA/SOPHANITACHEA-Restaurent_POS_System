import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class Login {
  username = '';
  password = '';
  message = '';
  isSuccess = false;

  users = [
    { username: 'Admin', password: '123' },
    { username: 'mony', password: '123' },
    { username: 'nita', password: '123' },
    { username: 'veychhen', password: '123' },
    { username: 'sen', password: '123' }
  ];

  constructor(private router: Router) {}

  login() {
    const user = this.users.find(u => u.username === this.username && u.password === this.password);
    if (user) {
      this.message = 'Login successful!';
      this.isSuccess = true;
      this.router.navigate(['/home']); 
    } else {
      this.message = 'Invalid username or password.';
      this.isSuccess = false;
    }
  }
}
