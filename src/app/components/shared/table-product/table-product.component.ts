import { Component, OnDestroy, OnInit, Output } from '@angular/core';
import { ProductServiceService } from '../../../services/product-service.service';
import { Product } from '../../../model/product.model';
import { Subscription } from 'rxjs';
import { log } from 'console';
import { EventEmitter } from '@angular/core';
import { ProductSearchComponent } from '../product-search/product-search.component';

@Component({
  selector: 'app-table-product',
  standalone: true,
  imports: [ProductSearchComponent],
  templateUrl: './table-product.component.html',
  styleUrl: './table-product.component.css',
})
export class TableProductComponent implements OnInit, OnDestroy {
  products: Product[] = [];
  subscriptions: Subscription[] = [];
  pagedProducts: Product[] = [];

  totalPage: number = 0;
  pageNumber: number = 1;
  pageSize: number = 3;

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
        this.pageNumber = 1;
        this.updatePaging();
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

  onSearch($event: any) {
    this.products = $event;
    this.pageNumber = 1;
    this.updatePaging();
  }

  updatePaging() {
    this.totalPage = Math.ceil(this.products.length / this.pageSize);
    this.setupPageAttribute();
  }

  setupPageAttribute() {
    const start = (this.pageNumber - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.pagedProducts = this.products.slice(start, end);
  }

  prevPage() {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.setupPageAttribute();
    }
  }

  nextPage() {
    if (this.pageNumber < this.totalPage) {
      this.pageNumber++;
      this.setupPageAttribute();
    }
  }
}
