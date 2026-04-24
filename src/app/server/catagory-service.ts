import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiUrl = 'http://localhost:3000/api/categories';

  constructor(private http: HttpClient) {}

  getAllCategory(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
}










// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class CategoryService {

//   constructor() {}

//   getAllCategory() {
//     const data = "All Data";
//     console.log(data);
//     return data;
//   }

//   getSingleRowCategory() {
//     return "Single Row Category";
//   }

//   postCategory() {
//     const result = "Insert Data Logic executed";
//     return result;
//   }
//   GetAll(){
//     let data ="Get All Category"
//     console.log(data);
//     return data;
//   }
//   GetCategoryByID(id: number){
//     let data = "Get ID:" + id;
//     console.log(data);
//     return data;
//   }

// }
