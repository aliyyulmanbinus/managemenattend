import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeData {
  private dataUrl = 'https://dataattend-da1c2-default-rtdb.asia-southeast1.firebasedatabase.app/employees.json';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<{ [key: string]: Employee }>(this.dataUrl)
      .pipe(
        map(resp => {
          // Konversi object Firebase ke dalam bentuk array
          return resp ? Object.values(resp) : [];
        })
      );
  }
}
