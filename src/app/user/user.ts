import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.html'
})
export class UserComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    // runs when component initializes
  }
}
