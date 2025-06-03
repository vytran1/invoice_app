import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductServiceService } from '../../../services/product-service.service';
import { Product } from '../../../model/product.model';
import { Subscription } from 'rxjs';
import { log } from 'console';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-product',
  standalone: true,
  imports: [],
  templateUrl: './table-product.component.html',
  styleUrl: './table-product.component.css',
})
export class TableProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  subscriptions: Subscription[] = [];

  @Output()
  productEmitter = new EventEmitter();

  @Output()
  closeTableEmitter = new EventEmitter();

  constructor(private productService: ProductServiceService) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.productService.product$.subscribe((response) => {
        this.products = response;
        console.log('Product Date', this.products);
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  closeTable() {
    this.closeTableEmitter.emit();
  }

  chooseProduct($event: any) {
    this.productEmitter.emit($event);
  }
}
