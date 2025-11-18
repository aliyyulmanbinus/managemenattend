import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Employee } from '../../../models/employee.model';
import { EmployeeData } from '../../../services/employee-data';
import { Subscription } from 'rxjs';

// ng-zorro
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzAlertModule } from 'ng-zorro-antd/alert';

// chart
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    NzGridModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzSpinModule,
    NzAlertModule,
    BaseChartDirective
  ],
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {
  employees: Employee[] = [];
  listOfDisplayData: Employee[] = [];
  loading = true;
  errorMsg = '';

  // summary
  totalEmployees = 0;
  totalIzin = 0;
  averageActiveDays = 0;

  // labels
  public barChartLabels: string[] = [];
  public lineChartLabels: string[] = [];

  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // we'll control height via CSS
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Active Days per Employee' }
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  };

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Active Days',
        backgroundColor: '#1890ff'
      }
    ]
  };

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Izin (Leaves) per Employee' }
    },
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    }
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Izin',
        borderColor: '#52c41a',
        backgroundColor: 'rgba(82,196,26,0.12)',
        fill: true,
        tension: 0.25,
        pointRadius: 4
      }
    ]
  };

  private subs: Subscription[] = [];

  // view children for forcing chart update
  @ViewChild('barChart') barChart?: BaseChartDirective;
  @ViewChild('lineChart') lineChart?: BaseChartDirective;

  constructor(private empService: EmployeeData) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subs.forEach(s => s.unsubscribe());
  }

  private loadData(): void {
    this.loading = true;
    const s = this.empService.getEmployees().subscribe({
      next: (emps) => {
        this.employees = emps || [];
        this.listOfDisplayData = [...this.employees];
        this.prepareSummary();
        this.prepareCharts();
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load employees', err);
        this.errorMsg = 'Gagal memuat data karyawan.';
        this.loading = false;
      }
    });
    this.subs.push(s);
  }

  private prepareSummary(): void {
    this.totalEmployees = this.employees.length;
    this.totalIzin = this.employees.reduce((s, e) => s + (e.izin || 0), 0);
    this.averageActiveDays = this.totalEmployees ? +(this.employees.reduce((s,e)=>s+(e.activeDays||0),0)/this.totalEmployees).toFixed(2) : 0;
  }

  private prepareCharts(): void {
    const labels = this.employees.map(e => e.name);

    // bar
    this.barChartLabels = labels;
    this.barChartData = {
      labels,
      datasets: [
        {
          data: this.employees.map(e => e.activeDays),
          label: 'Active Days',
          backgroundColor: '#1890ff'
        }
      ]
    };

    // line
    this.lineChartLabels = labels;
    this.lineChartData = {
      labels,
      datasets: [
        {
          data: this.employees.map(e => e.izin),
          label: 'Izin',
          borderColor: '#52c41a',
          backgroundColor: 'rgba(82,196,26,0.12)',
          fill: true,
          tension: 0.25,
          pointRadius: 4
        }
      ]
    };

    // Ensure charts update after Angular view/render has applied changes
    // small timeout guarantees BaseChartDirective is available and canvas rendered
    setTimeout(() => {
      try {
        this.barChart?.update();
      } catch (e) {
        // ignore
      }
      try {
        this.lineChart?.update();
      } catch (e) {
        // ignore
      }
    }, 50);
  }

  sortByActiveDaysDesc(): void {
    this.listOfDisplayData = [...this.employees].sort((a,b)=>b.activeDays - a.activeDays);
  }

  sortByIzinDesc(): void {
    this.listOfDisplayData = [...this.employees].sort((a,b)=>b.izin - a.izin);
  }

  resetSort(): void {
    this.listOfDisplayData = [...this.employees];
  }
}

export { WelcomeComponent as Welcome };