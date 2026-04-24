import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-store',
  templateUrl: './store.html',
  styleUrls: ['./store.css']
})
export class Store implements AfterViewInit {
  ngAfterViewInit(): void {
    this.loopNumber('drinkCount1', 350, 7000);
    this.loopNumber('drinkCount2', 60, 7000);
    this.loopNumber('drinkCount3', 88, 7000);
    this.loopNumber('drinkCount4', 65, 7000);
    this.loopNumber('drinkCount5', 650, 7000);
    this.loopNumber('drinkCount6', 10, 7000);
  }

  loopNumber(id: string, end: number, duration: number): void {
    const el = document.getElementById(id);
    if (!el) return;

    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const value = Math.floor(progress * end);
      el.textContent = value.toString();

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
