import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { EmployeeData } from './employee-data';
import { firstValueFrom } from 'rxjs';


let pdfMakeLib: any = null;

async function ensurePdfMakeLoaded(): Promise<any> {
  if (pdfMakeLib) {
    return pdfMakeLib;
  }

  // dynamic import so TypeScript/webpack treat it safely and we can normalize default/namespace exports
  const pdfMakeModule: any = await import('pdfmake/build/pdfmake');
  const pdfFontsModule: any = await import('pdfmake/build/vfs_fonts');

  const pdfMakeCandidate = pdfMakeModule && (pdfMakeModule.default || pdfMakeModule);
  const pdfFontsCandidate = pdfFontsModule && (pdfFontsModule.default || pdfFontsModule);

  pdfMakeLib = pdfMakeCandidate;

  // find vfs in fonts module (it may be exported as pdfMake.vfs or vfs)
  const vfs =
    pdfFontsCandidate.pdfMake?.vfs ||
    pdfFontsCandidate.vfs ||
    pdfFontsCandidate.pdfMake;

  // attach vfs onto pdfMake object (mutating runtime object is OK)
  if (pdfMakeLib) {
    (pdfMakeLib as any).vfs = vfs;
  }

  return pdfMakeLib;
}

export interface ReportSettings {
  recipients: string[];
  includeTitle: boolean;
  includeSummary: boolean;
  includeBarChart: boolean;
  includeLineChart: boolean;
  includeTable: boolean;
  timestamp?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private empService: EmployeeData) {}

  async getEmployees(): Promise<Employee[]> {
    return firstValueFrom(this.empService.getEmployees());
  }

  async generateReportData(): Promise<{
    employees: Employee[],
    mostActive?: Employee,
    mostLeave?: Employee,
    summary: { totalEmployees: number; totalIzin: number; averageActiveDays: number },
    generatedAt: string
  }> {
    const employees = await this.getEmployees();
    const totalEmployees = employees.length;
    const totalIzin = employees.reduce((s, e) => s + (e.izin || 0), 0);
    const averageActiveDays = totalEmployees ? +(employees.reduce((s, e) => s + (e.activeDays || 0), 0) / totalEmployees).toFixed(2) : 0;

    const mostActive = [...employees].sort((a,b)=>b.activeDays - a.activeDays)[0];
    const mostLeave = [...employees].sort((a,b)=>b.izin - a.izin)[0];

    return {
      employees,
      mostActive,
      mostLeave,
      summary: { totalEmployees, totalIzin, averageActiveDays },
      generatedAt: new Date().toISOString()
    };
  }

  /**
   * Build and open PDF preview using pdfMake.
   * images: optional object { barChart?: dataUrl, lineChart?: dataUrl }
   */
  async previewPdf(settings: ReportSettings, images?: { barChart?: string; lineChart?: string }) {
    // ensure pdfMake runtime + vfs loaded
    const pdfMake = await ensurePdfMakeLoaded();

    const data = await this.generateReportData();

    const content: any[] = [];

    // Title
    if (settings.includeTitle) {
      content.push({
        text: 'Laporan Performa Karyawan',
        style: 'header',
        margin: [0, 0, 0, 10]
      });
    }

    // timestamp & recipients
    content.push({
      columns: [
        { text: `Tanggal: ${new Date(data.generatedAt).toLocaleString()}`, width: 'auto' },
        { text: `Penerima: ${settings.recipients.join(', ') || '-'}`, alignment: 'right' }
      ],
      margin: [0, 0, 0, 8]
    });

    // Summary
    if (settings.includeSummary) {
      content.push({
        style: 'box',
        table: {
          widths: ['*','*','*'],
          body: [
            [{ text: 'Total Karyawan', bold: true }, { text: 'Total Izin', bold: true }, { text: 'Rata-rata Hari Aktif', bold: true }],
            [{ text: data.summary.totalEmployees.toString() }, { text: data.summary.totalIzin.toString() }, { text: data.summary.averageActiveDays.toString() }]
          ]
        },
        layout: 'noBorders',
        margin: [0, 0, 0, 10]
      });

      content.push({
        columns: [
          { text: `Karyawan Paling Aktif: ${data.mostActive ? `${data.mostActive.name} (${data.mostActive.activeDays})` : '-'}`, width: '50%' },
          { text: `Karyawan Paling Izin: ${data.mostLeave ? `${data.mostLeave.name} (${data.mostLeave.izin})` : '-'}`, width: '50%', alignment: 'right' }
        ],
        margin: [0, 0, 0, 10]
      });
    }

    // Charts images (if provided and selected)
    if (settings.includeBarChart && images?.barChart) {
      content.push({ text: 'Grafik Aktivitas (Bar)', style: 'subheader', margin: [0, 8, 0, 6] });
      content.push({
        image: images.barChart,
        width: 480,
        margin: [0, 0, 0, 10]
      });
    }

    if (settings.includeLineChart && images?.lineChart) {
      content.push({ text: 'Grafik Izin (Line)', style: 'subheader', margin: [0, 8, 0, 6] });
      content.push({
        image: images.lineChart,
        width: 480,
        margin: [0, 0, 0, 10]
      });
    }

    // Table
    if (settings.includeTable) {
      const body: any[] = [
        [{ text: 'Nama', bold: true }, { text: 'Hari Aktif', bold: true }, { text: 'Izin', bold: true }]
      ];

      data.employees.forEach(emp => {
        body.push([
          { text: emp.name },
          { text: emp.activeDays != null ? emp.activeDays.toString() : '0' },
          { text: emp.izin != null ? emp.izin.toString() : '0' }
        ]);
      });

      content.push({ text: 'Tabel Aktivitas Karyawan', style: 'subheader', margin: [0, 8, 0, 6] });
      content.push({
        table: {
          headerRows: 1,
          widths: ['*', 80, 60],
          body
        }
      });
    }

    const docDefinition: any = {
      content,
      styles: {
        header: { fontSize: 16, bold: true, alignment: 'center' },
        subheader: { fontSize: 12, bold: true },
        box: { margin: [0, 5, 0, 5] }
      },
      defaultStyle: {
        fontSize: 10
      }
    };

    // create and open
    pdfMake.createPdf(docDefinition).open();
  }
}
