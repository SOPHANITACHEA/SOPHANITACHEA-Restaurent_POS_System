import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../server/catagory-service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories implements OnInit {

  categories: any[] = [];

  constructor(private cate: CategoryService) {}

  ngOnInit() {
    this.getData();
  }

  getData() {
    this.cate.getAllCategory().subscribe({
      next: (data) => {
        this.categories = data;
        console.log('API JSON:', data);
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
  }
}








// import { Component } from '@angular/core';
// import { CategoryService } from '../server/catagory-service';

// @Component({
//   selector: 'app-categories',
//   imports: [],
//   templateUrl: './categories.html',
//   styleUrl: './categories.css',
// })
// export class Categories {
//   constructor(private cate: CategoryService){}
//   ngOnInit(){
//     this.GetData()
//   }
//   GetData(){
//     this.cate.GetAll();
//   }




// }
