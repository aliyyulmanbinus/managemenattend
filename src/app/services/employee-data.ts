import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Employee } from '../models/employee.model';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeData {
  private dataUrl = 'assets/data/employees.json';

  constructor(private http: HttpClient) { }

  getEmployees(): Observable<Employee[]> {
    return this.http.get<{ employees: Employee[] }>(this.dataUrl)
      .pipe(
        map(resp => resp && resp.employees ? resp.employees : [])
      );
  }
  
}
