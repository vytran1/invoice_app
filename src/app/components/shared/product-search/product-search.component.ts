import { Component, EventEmitter, Output } from '@angular/core';
import { ProductServiceService } from '../../../services/product-service.service';
import { Product } from '../../../model/product.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-search.component.html',
  styleUrl: './product-search.component.css',
})
export class ProductSearchComponent {
  keyWord: string = '';
  listProductByName: Product[] = [];

  @Output()
  emitter = new EventEmitter();

  constructor(private productService: ProductServiceService) {}

  searchChange() {
    this.listProductByName = this.productService.findAllByName(this.keyWord);
    this.emitter.emit(this.listProductByName);
    this.listProductByName = [];
  }
}
