import { Routes } from '@angular/router';
import path from 'path';
import { OrderFormComponent } from './components/order-form/order-form.component';
import { TableProductComponent } from './components/shared/table-product/table-product.component';

export const routes: Routes = [
  { path: 'order', component: OrderFormComponent },
  { path: 'products', component: TableProductComponent },
];
