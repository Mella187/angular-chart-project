import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { Chart, Tooltip } from 'chart.js';
import { TimezoneService } from '../timezone.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnInit, AfterViewInit {
  lightMode: boolean = true;
  currentTime: string = '';

  @Output() lightModeChanged = new EventEmitter<boolean>();

  constructor(
    public sharedTimeZone: TimezoneService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.sharedTimeZone.timezoneChanged.subscribe(() => {
      this.updateChart();
    });
  }

  toggleMode() {
    this.lightMode = !this.lightMode;
    this.lightModeChanged.emit(this.lightMode);
    this.updateChart();
  }

  @ViewChild('scatterChartCanvas', { static: false })
  scatterChartCanvas!: ElementRef<HTMLCanvasElement>;
  scatterChart!: Chart;

  ngAfterViewInit() {
    this.updateChart();
    this.addResizeListener();
  }

  updateChart() {
    let { hours, minutes } = this.sharedTimeZone.getSharedTimeZone();

    if (hours == 24) {
      hours = 0;
    }

    const canvas = this.scatterChartCanvas.nativeElement;
    const context = canvas.getContext('2d');

    if (context) {
      const data = [{ x: hours + minutes / 60, y: 0 }];

      Chart.register(Tooltip);

      if (this.scatterChart) {
        this.scatterChart.data.datasets[0].data = data;
        this.scatterChart.data.datasets[0].backgroundColor = this.lightMode
          ? '#6e18e9'
          : '#bb86fc';
        this.scatterChart.data.datasets[0].borderColor = this.lightMode
          ? '#6e18e9'
          : '#bb86fc';

        this.scatterChart.update();
      } else {
        const defaultData = data;

        this.scatterChart = new Chart(context, {
          type: 'scatter',
          data: {
            datasets: [
              {
                label: 'Scatter Data',
                data: defaultData,
                backgroundColor: this.lightMode ? '#6e18e9' : '#bb86fc',
                pointRadius: 5,
                showLine: true,
                borderColor: this.lightMode ? '#6e18e9' : '#bb86fc',
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                type: 'linear',
                position: 'bottom',
                min: 0,
                max: 24,

                ticks: {
                  stepSize: 1,
                },
                grid: {
                  display: true,
                  color: '#6e18e9',
                },
              },
              y: {
                display: false,
              },
            },
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  title: () => {
                    const currentTime = `Current time is: ${hours}h ${minutes}m`;
                    return currentTime;
                  },
                  label: () => '',
                },
              },
            },
          },
        });
      }
    }

    // Update the current time when you hover the marker
    const { hours: currentHours, minutes: currentMinutes } =
      this.sharedTimeZone.getSharedTimeZone();
    this.currentTime = `Current time is: ${currentHours}h ${currentMinutes}m`;

    // Trigger change detection
    this.cdRef.detectChanges();
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.scatterChart) {
      this.scatterChart.resize();
    }
  }

  addResizeListener() {
    window.addEventListener('resize', this.onWindowResize.bind(this));
  }

  removeResizeListener() {
    window.removeEventListener('resize', this.onWindowResize.bind(this));
  }

  ngOnDestroy() {
    this.removeResizeListener();
  }
}
