import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { minFormArrayLength } from '../../validators/shared/shared.validator';
import { TableProductComponent } from '../shared/table-product/table-product.component';
import { Product } from '../../model/product.model';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { Subscription } from 'rxjs';
import { Order } from '../../model/order.model';
import { log } from 'console';
@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [ReactiveFormsModule, TableProductComponent, CommonModule],
  templateUrl: './order-form.component.html',
  styleUrl: './order-form.component.css',
})
export class OrderFormComponent implements OnInit, OnDestroy {
  orderForm!: FormGroup;
  subscriptions: Subscription[] = [];

  isOpenProductTable: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.orderForm = this.formBuilder.group({
      customer: this.formBuilder.group({
        name: ['', [Validators.required, Validators.minLength(5)]],
        address: ['', [Validators.required]],
        phone_number: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{10}$/)],
        ],
      }),
      orderDetails: this.formBuilder.array([], minFormArrayLength(1)),
    });
  }

  onSubmit() {
    if (!this.orderForm.invalid) {
      const requestBody: Order = this.orderForm.value;

      console.log('Request Body', requestBody);

      this.subscriptions.push(
        this.reportService.generateReport(requestBody).subscribe({
          next: (response) => {
            console.log(response);
            alert('Created Report');
          },
          error: (err) => {
            console.log(err);
            alert('Error System');
          },
        })
      );
    }
  }

  get orderDetails() {
    return this.orderForm.get('orderDetails') as FormArray;
  }

  openProductTable() {
    this.isOpenProductTable = true;
  }

  closeProductTable() {
    this.isOpenProductTable = false;
  }

  addProductToOrder(event: Product): void {
    const productExist = this.orderDetails.controls.find(
      (detail) => detail.get('product_name')?.value === event.name
    );

    if (productExist) {
      const currentQuantity = productExist.get('quantity')?.value || 0;
      productExist.get('quantity')?.setValue(currentQuantity + 1);
    } else {
      const newOrderDetailFormGroup = this.formBuilder.group({
        product_name: [event.name],
        unit_price: [event.selling_price],
        quantity: [1, [Validators.min(1)]],
      });

      this.orderDetails.push(newOrderDetailFormGroup);
    }
  }

  removeOrderDetail(index: number) {
    this.orderDetails.removeAt(index);
    this.orderDetails.markAllAsTouched();
    this.orderDetails.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }
}
