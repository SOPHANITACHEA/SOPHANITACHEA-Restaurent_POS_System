import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jsPDF from 'jspdf';

import { KhmerOSBattambang } from './khmer-font';

interface Drink {
  name: string;
  price: number;
  cost: number;
  image: string;
  description: string;
  bg?: string;
  category: string;
}



interface OrderItem {
  name: string;
  price: number;
  cost: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}



  // ================= PRODUCTS =================
  // ================= DRINKS PRODUCTS =================
  
  drinks: Drink[] = [
    { name:'Cappuccino', price:4.98, cost:1.80, image:'image/17.jpg', description:'Rich espresso with steamed milk.',category: 'drink' },
    { name:'Coffee Latte', price:5.98, cost:2.10, image:'image/13.jpg', description:'Smooth latte.',category: 'drink' },
    { name:'Americano', price:4.98, cost:1.20, image:'image/11.jpg', description:'Hot americano.',category: 'drink' },
    { name:'Caramel Macchiato', price:5.98, cost:2.30, image:'image/4.jpg', description:'Caramel coffee.',category: 'drink' },
    { name:'Flat White', price:5.98, cost:2.00, image:'image/5.jpg', description:'Flat white.',category: 'drink'},
    { name:'Mocha', price:5.98, cost:2.40, image:'image/6.jpg', description:'Mocha.',category: 'drink' },
    { name:'Espresso', price:3.98, cost:0.90, image:'image/7.jpg', description:'Strong espresso.',category: 'drink' },
    { name:'Hazelnut Latte', price:6.25, cost:2.50, image:'image/8.jpg', description:'Hazelnut latte.',category: 'drink' },
    { name:'Vanilla Latte', price:6.25, cost:2.30, image:'image/9.jpg', description:'Latte with vanilla syrup.',category: 'drink' },
    { name:'Iced Coffee', price:4.50, cost:1.40, image:'image/19.jpg', description:'Cold brewed coffee.',category: 'drink' },
    { name:'Iced Latte', price:5.75, cost:2.10, image:'image/12.jpg', description:'Chilled latte.' ,category: 'drink'},
    { name:'Matcha Latte', price:6.50, cost:2.80, image:'image/14.jpg', description:'Japanese matcha latte.',category: 'drink' },
    { name:'Chocolate Milk', price:4.25, cost:1.60, image:'image/15.jpg', description:'Sweet chocolate milk.',category: 'drink' },
    { name:'Milk Tea', price:4.75, cost:1.70, image:'image/7.jpg', description:'Classic milk tea.',category: 'drink' },
    { name:'Green Tea', price:3.50, cost:0.80, image:'image/13.jpg', description:'Hot green tea.',category: 'drink' },
    { name:'Black Coffee', price:3.75, cost:0.90, image:'image/19.jpg', description:'Pure black coffee.',category: 'drink' },
    { name:'Caramel Latte', price:6.25, cost:2.40, image:'image/20.jpg', description:'Latte with caramel syrup.',category: 'drink' },
    { name:'Iced Mocha', price:6.50, cost:2.60, image:'image/9.jpg', description:'Cold mocha.',category: 'drink' }
  ];

    // ================= Desert PRODUCTS =================

    desserts: Drink[] = [
      { name:'Chocolate Cake', price:5.50, cost:2.50, image:'image/desert/chocolate.jpg', description:'Rich chocolate cake.', category: 'dessert' },
      { name:'Cheesecake', price:6.00, cost:3.00, image:'image/desert/rose.jpg', description:'Creamy cheesecake.', category: 'dessert' },
      { name:'Mochi', price:4.00, cost:1.50, image:'image/desert/matcha.jpg', description:'Vanilla ice cream scoop.', category: 'dessert' },
      { name:'Cloud Pudding', price:4.50, cost:1.80, image:'image/desert/jellycrystal.jpg', description:'Chocolate brownie.', category: 'dessert' },
      { name:'Fruit Tart', price:5.25, cost:2.20, image:'image/desert/orange.jpg', description:'Tart with fresh fruits.', category: 'dessert' },
      { name:'Brownie', price:4.75, cost:2.00, image:'image/desert/Fudgy chocolate brownie.jpg', description:'Fudgy chocolate brownie.', category: 'dessert' },
      { name:'Tiramisu', price:6.50, cost:3.20, image:'image/desert/Tiramisu.jpg', description:'Coffee-flavored Italian dessert.', category: 'dessert' },
      { name:'Macaron', price:3.50, cost:1.50, image:'image/desert/Macaron.jpg', description:'Delicate French cookie.', category: 'dessert' },
      { name:'Crepe', price:4.25, cost:1.80, image:'image/desert/Crepe.jpg', description:'Thin pancake with filling.', category: 'dessert' },
      { name:'Ice Cream Sundae', price:5.00, cost:2.50, image:'image/desert/IceCreamSundae.jpg', description:'Ice cream with toppings.', category: 'dessert' },
      { name:'Apple Pie', price:5.25, cost:2.20, image:'image/desert/ApplePie.jpg', description:'Classic apple pie.', category: 'dessert' },
      { name:'Panna Cotta', price:6.00, cost:3.00, image:'image/desert/PannaCotta.jpg', description:'Creamy Italian dessert.', category: 'dessert' },
      { name:'Cupcake', price:3.75, cost:1.60, image:'image/desert/Cupcake.jpg', description:'Mini cake with frosting.', category: 'dessert' },
      { name:'Eclair', price:4.50, cost:2.00, image:'image/desert/Eclair.jpg', description:'Choux pastry with cream.', category: 'dessert' },
      { name:'Mousse', price:5.50, cost:2.50, image:'image/desert/Mousse.jpg', description:'Light and airy dessert.', category: 'dessert' }
    ];


    // ================= Apertiser PRODUCTS =================

    appetizers: Drink[] = [
    
      {name: 'Garlic Bread', price: 3.50, cost: 1.20, image: 'image/appetizer/GarlicBread.jpg', description: 'Crispy bread with garlic butter.', category: 'appetizer'},
      { name: 'Spring Rolls', price: 4.00, cost: 1.50, image: 'image/appetizer/SpringRolls.jpg', description: 'Crispy vegetable spring rolls.', category: 'appetizer' },
      { name: 'French Fries', price: 3.00, cost: 1.00, image: 'image/appetizer/FrenchFries.jpg', description: 'Golden crispy fries.', category: 'appetizer' },
      { name: 'Chicken Wings', price: 6.50, cost: 3.00, image: 'image/appetizer/ChickenWings.jpg', description: 'Spicy grilled chicken wings.', category: 'appetizer' },
      { name: 'Onion Rings', price: 3.75, cost: 1.40, image: 'image/appetizer/OnionRings.jpg', description: 'Crispy fried onion rings.', category: 'appetizer' },
      { name: 'Nachos', price: 5.50, cost: 2.20, image: 'image/appetizer/Nachos.jpg', description: 'Nachos with cheese dip.', category: 'appetizer' },
      { name: 'Mozzarella Sticks', price: 5.00, cost: 2.00, image: 'image/appetizer/MozzarellaSticks.jpg', description: 'Fried cheese sticks.', category: 'appetizer' },
      { name: 'Crosant Sandwich', price: 4.50, cost: 1.80, image: 'image/appetizer/MiniSandwich.jpg', description: 'Small ham sandwiches.', category: 'appetizer' },
      { name: 'Shrimp Tempura', price: 7.00, cost: 3.50, image: 'image/appetizer/ShrimpTempura.jpg', description: 'Crispy shrimp tempura.', category: 'appetizer' },
      { name: 'Fish Balls', price: 4.25, cost: 1.70, image: 'image/appetizer/FishBalls.jpg', description: 'Fried fish balls.', category: 'appetizer' },
      { name: 'Dumplings', price: 5.75, cost: 2.30, image: 'image/appetizer/Dumplings.jpg', description: 'Steamed pork dumplings.', category: 'appetizer' },
      { name: 'Bruschetta', price: 4.80, cost: 2.00, image: 'image/appetizer/Bruschetta.jpg', description: 'Toasted bread with tomato.', category: 'appetizer' },
      { name: 'Cheese Balls', price: 4.20, cost: 1.60, image: 'image/appetizer/CheeseBalls.jpg', description: 'Deep fried cheese balls.', category: 'appetizer' },
      { name: 'Corn Dogs', price: 3.90, cost: 1.50, image: 'image/appetizer/CornDogs.jpg', description: 'Hot dog coated in batter.', category: 'appetizer' },
      { name: 'Egg Rolls', price: 4.30, cost: 1.70, image: 'image/appetizer/EggRolls.jpg', description: 'Crispy egg rolls.', category: 'appetizer' },
      { name: 'Potato Wedges', price: 3.60, cost: 1.30, image: 'image/appetizer/PotatoWedges.jpg', description: 'Seasoned potato wedges.', category: 'appetizer' },
      { name: 'Stuffed Mushrooms', price: 5.20, cost: 2.10, image: 'image/appetizer/StuffedMushrooms.jpg', description: 'Mushrooms stuffed with cheese.', category: 'appetizer' },
      { name: 'Chicken Nuggets', price: 4.70, cost: 2.00, image: 'image/appetizer/ChickenNuggets.jpg', description: 'Crispy chicken nuggets.', category: 'appetizer' },
      { name: 'Calamari', price: 6.80, cost: 3.20, image: 'image/appetizer/Calamari.jpg', description: 'Fried squid rings.', category: 'appetizer' },  
    ];
    
  selectedCategory = 'drink';

  filteredDrinks = this.drinks;

  selectCategory(cat: string) {
    this.selectedCategory = cat;
  
    if (cat === 'drink') {
      this.filteredDrinks = this.drinks;
  
    } else if (cat === 'dessert') {
      this.filteredDrinks = this.desserts;
  
    } else if (cat === 'appetizer') {
      this.filteredDrinks = this.appetizers;
  
    } else {
      this.filteredDrinks = [];
    }
  }
  

toggleSidebar() {
  this.showSidebar = !this.showSidebar;
}


  // ================= ORDER STATE =================

  order: OrderItem[] = [];
  tableNumber: number | null = null;

  showPaymentModal = false;
  cashGiven = 0;
  showSidebar = false; // start CLOSED




  // ================= CALCULATIONS =================

  get subtotal(): number {
    return this.order.reduce((s, i) => s + i.price * i.quantity, 0);
  }

  get discount(): number {
    return this.subtotal > 20 ? 2.25 : 0;
  }

  get total(): number {
    return this.subtotal - this.discount;
  }

  get change(): number {
    return this.cashGiven >= this.total ? this.cashGiven - this.total : 0;
  }

  // ================= ORDER ACTIONS =================

  addToOrder(drink: Drink): void {
    console.log("CLICKED", drink.name);  
    const existing = this.order.find(o => o.name === drink.name);

    if (existing) {
      existing.quantity++;
    } else {
      this.order.push({
        name: drink.name,
        price: drink.price,
        cost: drink.cost,
        quantity: 1,
        image: drink.image
      });
    }
  }

  increase(item: OrderItem) {
    item.quantity++;
  }

  decrease(item: OrderItem) {
    if (item.quantity > 1) item.quantity--;
    else this.order = this.order.filter(o => o !== item);
  }

  resetOrder() {
    this.order = [];
    this.cashGiven = 0;
    this.tableNumber = null;
  }

  // ================= PAYMENT MODAL =================

  openPaymentModal() {
    if (!this.order.length) {
      alert('Order is empty');
      return;
    }
    this.cashGiven = 0;
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  // ================= ORDER SAVE =================

  private buildPayload(status: string) {
    return {
      _id: undefined,   // let MongoDB generate it, but keep the field
      orderId: this.generateOrderId(),
      tableNumber: this.tableNumber ?? null,  // allow null
      items: this.order,
      subtotal: this.subtotal,
      discount: this.discount,
      total: this.total,
      cash: this.cashGiven,
      change: this.change,
      createdAt: new Date().toISOString(),
      status
    };
  }
  

  confirmPayment() {

    if (this.cashGiven < this.total) {
      alert('Not enough cash');
      return;
    }

    const payload = this.buildPayload('Completed');

    this.http.post('http://localhost:3000/orders', payload)
      .subscribe({
        next: () => {
          this.generateInvoicePDF(payload);
          this.resetOrder();
          this.closePaymentModal();
          this.router.navigate(['/history']);
        },
        error: (err: any) => console.error(err)
      });
  }

  preOrder() {
    if (!this.order.length) return;

    const payload = this.buildPayload('PreOrder');

    this.http.post('http://localhost:3000/orders', payload)
      .subscribe({
        next: () => {
          this.generateInvoicePDF(payload);
          alert('PreOrder saved');
          this.resetOrder();
        },
        error: (err: any) => console.error(err)
      });
  }

  deleteEmptyOrders() {
    this.http.delete('http://localhost:3000/orders/empty')
      .subscribe({
        next: (res) => {
          console.log('Deleted:', res);
          alert('Empty orders cleaned!');
        },
        error: (err) => console.error(err)
      });
  }
  



  // ================= PDF =================

  generateInvoicePDF(order: any) {

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200]
    });
  
    let y = 10;
  
    // Khmer font
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
  
    // ===== HEADER =====
    doc.setFontSize(14);
    doc.text('NitaFood', 40, y, { align: 'center' });
    y += 8;
  
    doc.setFontSize(9);
    doc.text(`Invoice ID: ${order.orderId}`, 5, y); 
    y += 5;
  
    doc.text(
      `Date: ${new Date(order.createdAt).toLocaleString()}`,
      5,
      y
    );
    y += 6;
  
    doc.line(5, y, 75, y);
    y += 4;
  
    // ===== ITEMS =====
    order.items.forEach((item: any) => {
  
      doc.text(item.name, 5, y);
      y += 4;
  
      doc.text(
        `${item.quantity} x $${item.price.toFixed(2)}`,
        5,
        y
      );
  
      doc.text(
        `$${(item.price * item.quantity).toFixed(2)}`,
        75,
        y,
        { align: 'right' }
      );
  
      y += 6;
    });
  
    // ===== TOTALS =====
    doc.line(5, y, 75, y);
    y += 5;
  
    doc.text(`Subtotal: $${order.subtotal.toFixed(2)}`, 5, y);
    y += 5;
  
    doc.text(`Discount: $${order.discount.toFixed(2)}`, 5, y);
    y += 5;
  
    doc.setFontSize(11);
    doc.text(`TOTAL: $${order.total.toFixed(2)}`, 5, y);
    y += 7;
  
    doc.setFontSize(9);
    doc.text(`Cash: $${order.cash.toFixed(2)}`, 5, y);
    y += 5;
  
    doc.text(`Change: $${order.change.toFixed(2)}`, 5, y);
    y += 10;
  
    // ===== FOOTER =====
    doc.text('សូមអរគុណ!', 40, y, { align: 'center' });
    y += 6;
  
    doc.text('Thank you!', 40, y, { align: 'center' });
  
    // ===== PRINT =====
    doc.autoPrint();
    window.open(doc.output('bloburl'));
  }
  


  

  generateOrderId(): string {
    return 'ORD-' + Date.now();
  }
}









