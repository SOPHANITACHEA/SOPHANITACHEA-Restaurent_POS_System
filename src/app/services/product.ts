import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Product {
  name: string;
  image: string;
  ingredientCost: number;
  salePrice: number;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private api = 'http://localhost:3000/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.api);
  }

  addProduct(p: Product) {
    return this.http.post(this.api, p);
  }
}
