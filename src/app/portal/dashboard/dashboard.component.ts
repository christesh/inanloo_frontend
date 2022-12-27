import { Component, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { duration } from 'jalali-moment';
import { BaseChartDirective } from 'ng2-charts';

// import DataLabelsPlugin from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChildren(BaseChartDirective) charts: QueryList<BaseChartDirective>;
  // @ViewChild(BaseChartDirective) chart0: BaseChartDirective ;
  public barChartOptions0: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
            family: 'iransans'
          }
        }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          font: {
            size: 12,
            family: 'iransans'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 12,
            family: 'iransans'
          }
        }
      },
      tooltip: {
        titleAlign: 'center',
        titleFont: {
          size: 12,
          family: 'iransans'
        },
        bodyAlign: 'right',
        bodyFont: {
          size: 12,
          family: 'iransans'
        }
      }
    }
  };
  public barChartType0: ChartType = 'line';

  public barChartData0: ChartData<'line'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 45], label: 'سفارش گارانتی' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'سفارش تعمیرات' }
    ]
  };
  public barChartOptions1: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
            family: 'iransans'
          }
        }
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          font: {
            size: 12,
            family: 'iransans'
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 12,
            family: 'iransans'
          }
        }
      },
      tooltip: {
        titleAlign: 'center',
        titleFont: {
          size: 12,
          family: 'iransans'
        },
        bodyAlign: 'right',
        bodyFont: {
          size: 12,
          family: 'iransans'
        }
      }
    }
  };
  public barChartType1: ChartType = 'bar';

  public barChartData1: ChartData<'bar'> = {
    labels: ['2006', '2007', '2008', '2009', '2010', '2011', '2012'],
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 45], label: 'سفارش گارانتی' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'سفارش تعمیرات' }
    ]
  };
  // events
  public chartClicked({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
   // console.log(event, active);
  }

  public chartHovered({ event, active }: { event?: ChartEvent, active?: {}[] }): void {
   // console.log(event, active);
  }

  public randomize(): void {
    // Only Change 3 values
    this.barChartData0.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40];

    this.barChartData1.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40];
   // console.log(this.charts)
    this.charts?.forEach((child) => {
     // console.log(child);
      child.chart?.update()
    });
  }

  constructor(
    private fb: FormBuilder,
    private router: Router,
    ) { }

  form!: FormGroup;
  private formSubmitAttempt!: boolean;
  ngOnInit() {
    this.form = this.fb.group({     // {5}
      mobilenumber: ['', Validators.required],
      username: ['', Validators.required]
    });

    var d3: { label: string, y: number }[] = []

    d3.push({ label: "کل حق ییمه پرداختی", y: 1000 })
    d3.push({ label: "کل خسارت های دریافتی", y: 1200 })
    d3.push({ label: "کل هزینه درمانی", y: 900 })


  }
  isFieldInvalid(field: string) { // {6}
    return (
      (!this.form.get(field)?.valid && this.form.get(field)?.touched) ||
      (this.form.get(field)?.untouched && this.formSubmitAttempt)
    );
  }
  createorder() {
    this.router.navigate(['/portal/orderbystaff']);
  }
}
