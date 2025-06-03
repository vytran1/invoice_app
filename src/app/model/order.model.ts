import { Customer } from './customer.model';
import { OrderDetail } from './order-detail.model';

export interface Order {
  customer: Customer;
  orderDetails: OrderDetail[];
}
