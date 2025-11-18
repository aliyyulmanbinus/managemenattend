import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormBuilder } from '@angular/forms';

// ng-zorro modules yang diperlukan
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ReportService, ReportSettings } from '../../services/report.service';
import { EmployeeData } from '../../services/employee-data';

@Component({
  selector: 'app-monitor',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    // ng-zorro
    NzGridModule,
    NzCardModule,
    NzSelectModule,
    NzDividerModule,
    NzListModule,
    NzInputModule,
    NzButtonModule,
    NzCheckboxModule,
    NzSpaceModule
  ],
  templateUrl: './monitor.html',
  styleUrls: ['./monitor.css'],
  providers: [NzMessageService]
})

export class MonitorComponent implements OnInit {
 form: any;
//   form = this.fb.group({
//     recipientEmail: ['']
//   });

  recipients: string[] = [];
  scheduleOptions = ['Harian', 'Mingguan', 'Bulanan'];
  selectedSchedule = 'Bulanan';

  // report section selections
  includeTitle = true;
  includeSummary = true;
  includeBarChart = true;
  includeLineChart = true;
  includeTable = true;

  constructor(
    private fb: FormBuilder,
    private msg: NzMessageService,
    private reportService: ReportService,
    private empService: EmployeeData
  ) {
    // Inisialisasi form HARUS di constructor
    this.form = this.fb.group({
      recipientEmail: ['']
    });
  }

  ngOnInit(): void {
    this.loadSettingsFromStorage();
  }

  addRecipient(): void {
    const email = this.form.value.recipientEmail?.trim();
    if (!email) {
      this.msg.warning('Masukkan email terlebih dahulu');
      return;
    }
    if (!this.validateEmail(email)) {
      this.msg.error('Format email tidak valid');
      return;
    }
    if (!this.recipients.includes(email)) {
      this.recipients.push(email);
      this.form.reset();
    } else {
      this.msg.info('Email sudah ada di daftar');
    }
  }

  removeRecipient(email: string): void {
    this.recipients = this.recipients.filter(e => e !== email);
  }

  validateEmail(email: string): boolean {
    // simple email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  saveSettings(): void {
    const settings: ReportSettings = {
      recipients: this.recipients,
      includeTitle: this.includeTitle,
      includeSummary: this.includeSummary,
      includeBarChart: this.includeBarChart,
      includeLineChart: this.includeLineChart,
      includeTable: this.includeTable,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem('monitor_report_settings', JSON.stringify(settings));
    this.msg.success('Pengaturan tersimpan');
  }

  loadSettingsFromStorage(): void {
    const raw = localStorage.getItem('monitor_report_settings');
    if (raw) {
      try {
        const s = JSON.parse(raw) as ReportSettings;
        this.recipients = s.recipients || [];
        this.includeTitle = !!s.includeTitle;
        this.includeSummary = !!s.includeSummary;
        this.includeBarChart = !!s.includeBarChart;
        this.includeLineChart = !!s.includeLineChart;
        this.includeTable = !!s.includeTable;
      } catch {
        // ignore
      }
    }
  }

  async previewReport(): Promise<void> {
    // prepare images (capture canvas in dashboard if present)
    const barCanvas = document.getElementById('barCanvas') as HTMLCanvasElement | null;
    const lineCanvas = document.getElementById('lineCanvas') as HTMLCanvasElement | null;

    const images: { barChart?: string; lineChart?: string } = {};
    try {
      if (this.includeBarChart && barCanvas) {
        images.barChart = barCanvas.toDataURL('image/png', 1.0);
      }
      if (this.includeLineChart && lineCanvas) {
        images.lineChart = lineCanvas.toDataURL('image/png', 1.0);
      }
    } catch (err) {
      // if can't capture, ignore images
      console.warn('Gagal capture chart canvas', err);
    }

    const settings: ReportSettings = {
      recipients: this.recipients,
      includeTitle: this.includeTitle,
      includeSummary: this.includeSummary,
      includeBarChart: this.includeBarChart,
      includeLineChart: this.includeLineChart,
      includeTable: this.includeTable,
      timestamp: new Date().toISOString()
    };

    await this.reportService.previewPdf(settings, images);
  }
}
