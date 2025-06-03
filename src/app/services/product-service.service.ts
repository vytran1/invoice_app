import { Injectable } from '@angular/core';
import { Product } from '../model/product.model';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';
import { log } from 'console';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductServiceService {
  productSubject = new BehaviorSubject<Product[]>([]);
  product$ = this.productSubject.asObservable();

  constructor(private httpClient: HttpClient) {
    this.loadData();
  }

  loadData() {
    this.httpClient
      .get('assets/product-data.xlsx', { responseType: 'arraybuffer' })
      .subscribe({
        next: (response) => {
          const workBook = XLSX.read(response, { type: 'array' });
          const sheetName = workBook.SheetNames[0];
          const worksheet = workBook.Sheets[sheetName];

          const rawData = XLSX.utils.sheet_to_json<any>(worksheet, {
            defval: '',
          });

          const products: Product[] = rawData.map((row) => ({
            id: row['STT'],
            name: row['Tên Sp'],
            unit: row['DVT'],
            price: this.parseNumber(row[' Giá ']),
            selling_price: this.parseNumber(row[' Giá bán ']),
            wholesale_price: this.parseNumber(row[' Giá sỉ ']),
          }));

          this.productSubject.next(products);
        },
      });
  }

  parseNumber(value: any): number {
    if (typeof value === 'string') {
      return Number(value.replace(/,/g, '').trim()) || 0;
    }
    return Number(value) || 0;
  }
}
