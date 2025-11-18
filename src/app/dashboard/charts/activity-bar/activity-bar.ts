import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { Employee } from '../../../models/employee.model';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-activity-bar',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, NzCardModule],
  templateUrl: './activity-bar.html',
  styleUrls: ['./activity-bar.css']
})
export class ActivityBarComponent implements OnChanges {
  @Input() employees: Employee[] = [];

  public barChartType: ChartType = 'bar';

  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'ActiveMonth per Employee' }
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['employees']) {
      this.updateChart();
    }
  }

  private updateChart(): void {
    const labels = (this.employees || []).map(e => e.name);
    const data = (this.employees || []).map(e => e.activeDays ?? 0);

    this.barChartData = {
      labels,
      datasets: [
        {
          data,
          label: 'Active Days',
          backgroundColor: '#1890ff'
        }
      ]
    };
  }
}

export { ActivityBarComponent as ActivityBar };
