import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private apiUrl = 'http://localhost:3000/orders';

  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get<any[]>(this.apiUrl);
  }

  updateOrder(id: string, data: any) {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteOrder(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
