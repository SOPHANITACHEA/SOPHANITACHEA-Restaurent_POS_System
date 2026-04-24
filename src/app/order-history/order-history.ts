import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import jsPDF from 'jspdf';

import { KhmerOSBattambang } from '../home/khmer-font';
import { OrderService } from '../services/order.service';




/* =======================
   Interfaces
======================= */

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface Order {
  _id: string;   // ✅ MUST use _id (MongoDB)
  orderId: string;
  tableNumber: number;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  cash: number;
  change: number;
  createdAt: string;
  status?: string;
}



/* =======================
   Component
======================= */

@Component({
  selector: 'app-order-history',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  templateUrl: './order-history.html',
  styleUrls: ['./order-history.css']
})
export class OrderHistory implements OnInit {

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  fromDate: string = '';
  toDate: string = '';

  filteredTotal: number = 0;

  constructor(private orderService: OrderService) {}

  /* =======================
     INIT
  ======================= */

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders()
      .subscribe(data => {
  
        // ✅ SORT: newest first
        this.orders = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime()
            - new Date(a.createdAt).getTime()
        );
  
        this.filteredOrders = [...this.orders];
        this.calculateTotal();
      });
  }
  sortNewestFirst() {
    this.filteredOrders.sort(
      (a, b) =>
        new Date(b.createdAt).getTime()
        - new Date(a.createdAt).getTime()
    );
  }
  
  

  activeTab: 'all' | 'preorder' | 'completed' | 'cancelled' = 'all';
  setTab(tab: 'all' | 'preorder' | 'completed' | 'cancelled') {

    this.activeTab = tab;
  
    if (tab === 'all') {
      this.filteredOrders = [...this.orders];
    }
  
    if (tab === 'preorder') {
      this.filteredOrders =
        this.orders.filter(o => o.status === 'PreOrder');
    }
  
    if (tab === 'completed') {
      this.filteredOrders =
        this.orders.filter(o => o.status === 'Completed');
    }
  
    if (tab === 'cancelled') {
      this.filteredOrders =
        this.orders.filter(o => o.status === 'Cancelled');
    }
  
    this.calculateTotal();
    this.sortNewestFirst(); 
  }
  
  


  /* =======================
     SORT
  ======================= */

  applySort(event: Event) {

    const value = (event.target as HTMLSelectElement).value;

    switch (value) {

      case 'priceHigh':
        this.filteredOrders.sort((a,b) => b.total - a.total);
        break;

      case 'priceLow':
        this.filteredOrders.sort((a,b) => a.total - b.total);
        break;

      case 'dateNew':
        this.filteredOrders.sort(
          (a,b) => new Date(b.createdAt).getTime()
                 - new Date(a.createdAt).getTime()
        );
        break;

      case 'dateOld':
        this.filteredOrders.sort(
          (a,b) => new Date(a.createdAt).getTime()
                 - new Date(b.createdAt).getTime()
        );
        break;
    }

    this.calculateTotal();
    this.sortNewestFirst(); 
  }

  /* =======================
     DATE FILTER
  ======================= */

  applyDateFilter() {

    if (!this.fromDate || !this.toDate) return;

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    this.filteredOrders = this.orders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= from && d <= to;
    });

    this.calculateTotal();
    this.sortNewestFirst(); 
  }

  resetFilter() {
    this.filteredOrders = [...this.orders];
    this.fromDate = '';
    this.toDate = '';
    this.calculateTotal();
    this.sortNewestFirst(); 
  }

  calculateTotal() {

    // ✅ Cancelled tab → show cancelled money
    if (this.activeTab === 'cancelled') {
      this.filteredTotal =
        this.filteredOrders
          .filter(o => o.status === 'Cancelled')
          .reduce((sum, o) => sum + o.total, 0);
      return;
    }
  
    // ✅ Other tabs → exclude cancelled
    this.filteredTotal =
      this.filteredOrders
        .filter(o => o.status !== 'Cancelled')
        .reduce((sum, o) => sum + o.total, 0);
  }
  

  showPayModal = false;
  payOrder: Order | null = null;
  payCash: number = 0;

  openConfirmPayment(order: Order) {
    this.payOrder = order;
    this.payCash = order.total;  // default to the exact amount
    this.showPayModal = true;
  }
  
  
  
  

  closePayModal() {
    this.showPayModal = false;
    this.payOrder = null;
  }
  

  confirmPreOrderPayment() {
    if (!this.payOrder) return;
  
    const cash = this.payCash; // already number
  
    if (cash < this.payOrder.total) {
      alert('Not enough cash');
      return;
    }
  
    const updated = {
      ...this.payOrder,
      status: 'Completed',
      cash: cash,
      change: cash - this.payOrder.total
    };
  
    this.orderService.updateOrder(this.payOrder._id, updated)
      .subscribe({
        next: () => {
          this.loadOrders();
          this.closePayModal();
        },
        error: err => console.error('UPDATE FAILED', err)
      });
  }
  


  cancelOrder(order: Order) {

    if (!confirm(`Cancel order ${order.orderId}?`)) return;
  
    const updated = {
      ...order,
      status: 'Cancelled'
    };
  
    this.orderService.updateOrder(order._id, updated)
      .subscribe(() => {
  
        const idx = this.orders.findIndex(o => o._id === order._id);
        if (idx > -1) this.orders[idx].status = 'Cancelled';
  
        const fidx = this.filteredOrders.findIndex(o => o._id === order._id);
        if (fidx > -1) this.filteredOrders[fidx].status = 'Cancelled';
  
        this.calculateTotal();
      });
  }
  
  

  /* =======================
     DELETE
  ======================= */

  deleteOrder(order: Order) {

    if (!confirm(`Delete order ${order.orderId}?`)) return;
  
    this.orderService.deleteOrder(order._id)
      .subscribe(() => {
  
        this.orders = this.orders.filter(o => o._id !== order._id);
        this.filteredOrders = this.filteredOrders.filter(o => o._id !== order._id);
  
        this.calculateTotal();
      });
  }
  

  /* =======================
     PDF INVOICE
  ======================= */

  showInvoice(order: Order): void {

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200]
    });

    let y = 10;

    (doc as any).addFileToVFS(
      'KhmerOSBattambang-Regular.ttf',
      KhmerOSBattambang
    );

    (doc as any).addFont(
      'KhmerOSBattambang-Regular.ttf',
      'KhmerOSBattambang',
      'normal'
    );

    doc.setFont('KhmerOSBattambang');

    doc.setFontSize(14);
    doc.text('NitaFood', 40, y, { align: 'center' });
    y += 8;

    doc.setFontSize(9);
    doc.text(`Invoice ID: ${order.orderId}`, 5, y); y += 5;
    doc.text(`Date: ${new Date(order.createdAt).toLocaleString()}`, 5, y);
    y += 6;

    doc.line(5, y, 75, y);
    y += 4;

    order.items.forEach(item => {
      doc.text(item.name, 5, y);
      y += 4;

      doc.text(`${item.quantity} x $${item.price.toFixed(2)}`, 5, y);

      doc.text(
        `$${(item.price * item.quantity).toFixed(2)}`,
        75,
        y,
        { align: 'right' }
      );

      y += 6;
    });

    doc.line(5, y, 75, y);
    y += 5;

    doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 5, y); y += 5;
    doc.text(`Discount: $${order.discount.toFixed(2)}`, 5, y); y += 5;

    doc.setFontSize(11);
    doc.text(`TOTAL: $${order.total.toFixed(2)}`, 5, y); y += 7;

    doc.setFontSize(9);
    doc.text(`Cash: $${order.cash.toFixed(2)}`, 5, y); y += 5;
    doc.text(`Change: $${order.change.toFixed(2)}`, 5, y); y += 10;

    doc.text('សូមអរគុណ!', 40, y, { align: 'center' });
    y += 8;
    doc.text('Thank you!', 40, y, { align: 'center' });

    doc.autoPrint();
    window.open(doc.output('bloburl'));
  }

}
