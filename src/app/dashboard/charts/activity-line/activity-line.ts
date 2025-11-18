import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType } from 'chart.js';
import { Employee } from '../../../models/employee.model';
import { NzCardModule } from 'ng-zorro-antd/card';

@Component({
  selector: 'app-activity-line',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, NzCardModule],
  templateUrl: './activity-line.html',
  styleUrls: ['./activity-line.css']
})
export class ActivityLineComponent implements OnChanges {
  @Input() employees: Employee[] = [];

  public lineChartType: ChartType = 'line';

  public lineChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Izin (Leaves) per Employee' }
    },
    elements: {
      line: { tension: 0.25 }
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
        pointRadius: 4
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
    const data = (this.employees || []).map(e => e.izin ?? 0);

    this.lineChartData = {
      labels,
      datasets: [
        {
          data,
          label: 'Izin',
          borderColor: '#52c41a',
          backgroundColor: 'rgba(82,196,26,0.12)',
          fill: true,
          pointRadius: 4,
          tension: 0.25
        }
      ]
    };
  }
}
export { ActivityLineComponent as ActivityLine };
