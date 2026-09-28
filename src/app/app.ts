import { AfterViewInit, Component, ElementRef, NgZone, OnChanges, OnDestroy, signal, SimpleChanges, ViewChild, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxGraphModule } from '@swimlane/ngx-graph'
import * as d3 from 'd3';

interface Point { label: string; value: number; }
@Component({
  imports: [NgxGraphModule],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements AfterViewInit, OnChanges, OnDestroy {
  protected readonly title = signal('graph-board');
  host = viewChild.required<ElementRef<HTMLDivElement>>('host');
  data: Point[] = [
    { label: 'Jan', value: 30 },
    { label: 'Feb', value: 86 },
    { label: 'Mar', value: 168 },
    { label: 'Apr', value: 122 },
    { label: 'May', value: 95 },
    { label: 'Jun', value: 140 }
  ];


  private svg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private ro?: ResizeObserver;
  private margin = { top: 16, right: 16, bottom: 32, left: 40 };
  constructor(private zone: NgZone) { }
  ngAfterViewInit() {
    // Run outside Angular so D3 events/animations don't trigger change detection
    this.zone.runOutsideAngular(() => {
      this.svg = d3.select(this.host().nativeElement)
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%');

      this.ro = new ResizeObserver(() => this.render());
      this.ro.observe(this.host().nativeElement);
      this.render();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['data'] && this.svg) {
      this.zone.runOutsideAngular(() => this.render());
    }
  }

  private render() {
    if (!this.svg) return;
    const { width, height } = this.host().nativeElement.getBoundingClientRect();
    const { top, right, bottom, left } = this.margin;
    const w = width - left - right;
    const h = height - top - bottom;

    const x = d3.scaleBand()
      .domain(this.data.map(d => d.label))
      .range([0, w])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(this.data, d => d.value) ?? 0])
      .nice()
      .range([h, 0]);

    this.svg.selectAll('g.root').data([null]).join('g')
      .attr('class', 'root')
      .attr('transform', `translate(${left},${top})`)
      .call(g => {
        // Axes
        g.selectAll<SVGGElement, null>('g.x').data([null]).join('g')
          .attr('class', 'x')
          .attr('transform', `translate(0,${h})`)
          .call(d3.axisBottom(x));
        g.selectAll<SVGGElement, null>('g.y').data([null]).join('g')
          .attr('class', 'y')
          .call(d3.axisLeft(y));

        // Bars (data join)
        g.selectAll<SVGRectElement, Point>('rect.bar')
          .data(this.data, d => d.label)
          .join('rect')
          .attr('class', 'bar')
          .attr('x', d => x(d.label)!)
          .attr('width', x.bandwidth())
          .attr('fill', 'steelblue')
          .transition().duration(400)
          .attr('y', d => y(d.value))
          .attr('height', d => h - y(d.value));
      });
  }

  ngOnDestroy() {
    this.ro?.disconnect();
    this.svg?.remove();
  }




  // ngx-graph configuration
  nodes = [
    { id: 'start', label: 'Start' },
    { id: 'end', label: 'End' },

  ]

  edge = [
    { id: 'link1', source: 'start', target: "end", lable: "First Link" }
  ]

  onNodeClick(event: any) {
    console.log("Node clicked");

  }



}
