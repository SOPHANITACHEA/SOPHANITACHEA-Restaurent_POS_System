
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../services/order.service';
import Chart from 'chart.js/auto';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

/* =======================
   Interfaces
======================= */

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  cost?: number;
}

interface Order {
  id: string;
  total: number;
  createdAt: string;
  status?: string;
  items?: OrderItem[];
}


/* =======================
   Component
======================= */

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './summary.html',
  styleUrls: ['./summary.css']
})
export class Summary implements OnInit, AfterViewInit {

  constructor(private orderService: OrderService) {}

  /* =======================
     DATA
  ======================= */
  

  orders: Order[] = [];
  filteredOrders: Order[] = [];

  fromDate = '';
  toDate = '';

  totalSales = 0;
  todaySales = 0;

  totalOrders = 0;
  completedOrders = 0;
  cancelledOrders = 0;
  preOrders = 0;

  totalCost = 0;
  totalProfit = 0;
  profitMargin = 0;

  peakHour = '';

  topItems: { name: string; qty: number }[] = [];

  salesChart: any;
  statusChart: any;
  monthlyChart: any;
  profitChart: any;

  popupChart: string | null = null;
  popupChartRef: any;


  /* =======================
     INIT
  ======================= */

  ngOnInit() {
    this.orderService.getOrders().subscribe(data => {
      this.orders = data;
      this.filteredOrders = [...data];
      this.rebuildAllFromFiltered();
    });
  }

  ngAfterViewInit() {}

  /* =======================
     FILTER
  ======================= */

  applySummaryFilter() {
    if (!this.fromDate || !this.toDate) return;

    const from = new Date(this.fromDate);
    const to = new Date(this.toDate);

    this.filteredOrders = this.orders.filter(o => {
      const d = new Date(o.createdAt);
      return d >= from && d <= to;
    });

    this.rebuildAllFromFiltered();
  }

  resetSummaryFilter() {
    this.filteredOrders = [...this.orders];
    this.fromDate = '';
    this.toDate = '';
    this.rebuildAllFromFiltered();
  }
  openChart(type: string) {
    this.popupChart = type;
  
    setTimeout(() => {
      this.buildPopupChart(type);
    }, 50);
  }
  
  closePopup() {
    this.popupChart = null;
    if (this.popupChartRef) {
      this.popupChartRef.destroy();
    }
  }
  

  

  /* =======================
     MASTER REBUILD
  ======================= */

  rebuildAllFromFiltered() {
    const list = this.filteredOrders;

    this.calculateStatsFrom(list);
    this.calculateProfitFrom(list);
    this.buildTopItemsFrom(list);
    this.calculatePeakHour(list);

    this.buildSalesChartFrom(list);
    this.buildStatusChartFrom(list);
    this.buildMonthlyChartFrom(list);
    this.buildProfitChartFrom(list);
  }

  /* =======================
     STATS
  ======================= */

  calculateStatsFrom(list: Order[]) {

    const completed = list.filter(o => o.status !== 'Cancelled');

    this.totalSales =
      completed.reduce((s,o)=> s + o.total, 0);

    this.totalOrders = list.length;

    this.completedOrders =
      list.filter(o => o.status === 'Completed').length;

    this.cancelledOrders =
      list.filter(o => o.status === 'Cancelled').length;

    this.preOrders =
      list.filter(o => o.status === 'PreOrder').length;

    const today = new Date().toDateString();

    this.todaySales =
      completed
        .filter(o => new Date(o.createdAt).toDateString() === today)
        .reduce((s,o)=> s + o.total, 0);
  }

  /* =======================
     PROFIT
  ======================= */

  calculateProfitFrom(list: Order[]) {

    let revenue = 0;
    let cost = 0;

    list
      .filter(o => o.status !== 'Cancelled')
      .forEach(o => {
        o.items?.forEach(i => {
          revenue += i.price * i.quantity;
          cost += (i.cost || 0) * i.quantity;
        });
      });

    this.totalCost = cost;
    this.totalProfit = revenue - cost;
    this.profitMargin =
      revenue > 0 ? (this.totalProfit / revenue) * 100 : 0;
  }

  buildPopupChart(type: string) {

    if (this.popupChartRef) {
      this.popupChartRef.destroy();
    }
  
    const list = this.filteredOrders;
  
    if (type === 'sales') {
  
      const map:any = {};
      list.filter(o=>o.status!=='Cancelled')
          .forEach(o=>{
            const d = new Date(o.createdAt).toLocaleDateString();
            map[d]=(map[d]||0)+o.total;
          });
  
      this.popupChartRef = new Chart("popupCanvas", {
        type: 'bar',
        data: {
          labels: Object.keys(map),
          datasets: [{ label:'Daily Sales', data:Object.values(map) }]
        }
      });
    }
  
    if (type === 'status') {
  
      const c = list.filter(o=>o.status==='Completed').length;
      const p = list.filter(o=>o.status==='PreOrder').length;
      const x = list.filter(o=>o.status==='Cancelled').length;
  
      this.popupChartRef = new Chart("popupCanvas", {
        type:'pie',
        data:{
          labels:['Completed','PreOrder','Cancelled'],
          datasets:[{data:[c,p,x]}]
        }
      });
    }
  
    if (type === 'monthly') {
  
      const map:any={};
      list.forEach(o=>{
        const d=new Date(o.createdAt);
        const k=d.getFullYear()+"-"+(d.getMonth()+1);
        map[k]=(map[k]||0)+o.total;
      });
  
      this.popupChartRef = new Chart("popupCanvas", {
        type:'line',
        data:{
          labels:Object.keys(map),
          datasets:[{data:Object.values(map)}]
        }
      });
    }
  
    if (type === 'profit') {
  
      let r=0,c=0;
      list.forEach(o=>{
        o.items?.forEach(i=>{
          r+=i.price*i.quantity;
          c+=(i.cost||0)*i.quantity;
        });
      });
  
      this.popupChartRef = new Chart("popupCanvas", {
        type:'bar',
        data:{
          labels:['Revenue','Cost','Profit'],
          datasets:[{data:[r,c,r-c]}]
        }
      });
    }
  }
  

  /* =======================
     CHARTS
  ======================= */

  buildSalesChartFrom(list: Order[]) {

    const map: { [date: string]: number } = {};

    list
      .filter(o => o.status !== 'Cancelled')
      .forEach(o => {
        const d = new Date(o.createdAt).toLocaleDateString();
        map[d] = (map[d] || 0) + o.total;
      });

    if (this.salesChart) this.salesChart.destroy();

    this.salesChart = new Chart("salesCanvas", {
      type: 'bar',
      data: {
        labels: Object.keys(map),
        datasets: [{ label: 'Daily Sales', data: Object.values(map) }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
            
    });
    
  }

  buildStatusChartFrom(list: Order[]) {

    const completed = list.filter(o => o.status === 'Completed').length;
    const preorder = list.filter(o => o.status === 'PreOrder').length;
    const cancelled = list.filter(o => o.status === 'Cancelled').length;

    if (this.statusChart) this.statusChart.destroy();

    this.statusChart = new Chart("statusCanvas", {
      type: 'pie',
      data: {
        labels: ['Completed','PreOrder','Cancelled'],
        datasets: [{ data: [completed, preorder, cancelled] }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
          });
  }

  buildMonthlyChartFrom(list: Order[]) {

    const map: { [month: string]: number } = {};

    list
      .filter(o => o.status !== 'Cancelled')
      .forEach(o => {
        const d = new Date(o.createdAt);
        const key = d.getFullYear() + '-' + (d.getMonth()+1);
        map[key] = (map[key] || 0) + o.total;
      });

    if (this.monthlyChart) this.monthlyChart.destroy();

    this.monthlyChart = new Chart("monthlyCanvas", {
      type: 'line',
      data: {
        labels: Object.keys(map),
        datasets: [{ label: 'Monthly Revenue', data: Object.values(map) }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
          });
  }

  buildProfitChartFrom(list: Order[]) {

    let revenue = 0;
    let cost = 0;

    list.forEach(o => {
      o.items?.forEach(i => {
        revenue += i.price * i.quantity;
        cost += (i.cost || 0) * i.quantity;
      });
    });

    if (this.profitChart) this.profitChart.destroy();

    this.profitChart = new Chart("profitCanvas", {
      type: 'bar',
      data: {
        labels: ['Revenue','Cost','Profit'],
        datasets: [{
          data: [revenue, cost, revenue-cost]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false
      }
          });
  }

  /* =======================
     TOP ITEMS
  ======================= */

  buildTopItemsFrom(list: Order[]) {

    const map: {[name:string]: number} = {};

    list
      .filter(o => o.status !== 'Cancelled')
      .forEach(o => {
        o.items?.forEach(i => {
          map[i.name] =
            (map[i.name] || 0) + (i.quantity * i.price);
        });
      });

    this.topItems =
      Object.entries(map)
        .map(([name,val]) => ({ name, qty: val }))
        .sort((a,b)=> b.qty - a.qty)
        .slice(0,5);
  }

  /* =======================
     PEAK HOUR
  ======================= */

  calculatePeakHour(list: Order[]) {

    const map: {[hour:number]: number} = {};

    list
      .filter(o => o.status !== 'Cancelled')
      .forEach(o => {
        const h = new Date(o.createdAt).getHours();
        map[h] = (map[h] || 0) + 1;
      });

    const best =
      Object.entries(map)
        .sort((a,b)=> b[1]-a[1])[0];

    this.peakHour = best ? best[0] + ":00" : '-';
  }

  /* =======================
     EXPORTS
  ======================= */

  exportSummaryPdf() {

    const doc = new jsPDF();
    let y = 20;

    doc.text("Sales Summary Report", 20, y); y+=12;

    doc.text(`Revenue: $${this.totalSales.toFixed(2)}`,20,y); y+=8;
    doc.text(`Cost: $${this.totalCost.toFixed(2)}`,20,y); y+=8;
    doc.text(`Profit: $${this.totalProfit.toFixed(2)}`,20,y); y+=8;

    doc.save("sales-summary.pdf");
  }

  exportExcel() {

    const rows = this.filteredOrders.map(o => ({
      Date: o.createdAt,
      Total: o.total,
      Status: o.status
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Summary");

    XLSX.writeFile(wb, "sales-summary.xlsx");
  }

  
}
