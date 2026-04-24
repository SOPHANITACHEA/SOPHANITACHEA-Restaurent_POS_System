import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  GetAllCategory() {
    return "All Data";
  }

  GetSingRowCategory() {
    return "Sing Row Category";
  }

  PostCategory() {
    "Insert Data Logic...";
  }

  GetCategoryByID(id: number) {
    let data = "Get ID:" + id;
    console.log(data);
    return data;
  }
}
