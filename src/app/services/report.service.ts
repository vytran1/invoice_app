import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../model/order.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportService {
  host = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  generateReport(order: Order): Observable<HttpResponse<any>> {
    return this.httpClient.post(`${this.host}/invoice/generateReport`, order, {
      observe: 'response',
    });
  }
}
