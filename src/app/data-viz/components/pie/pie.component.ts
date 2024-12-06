import { Component, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
@Component({
  selector: 'app-pie',
  standalone: true,
  imports: [],
  templateUrl: './pie.component.html',
  styleUrl: './pie.component.scss'
})
export class PieComponent implements OnChanges {
  @Input() departmentData: { name: string; patientCount: number }[] = [];

  constructor(private elementRef: ElementRef) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['departmentData']) {
      this.createPieChart();
    }
  }

  private createPieChart(): void {
    const data = this.departmentData;
    const element = this.elementRef.nativeElement.querySelector('.chart-container');

    // Clear any previous SVG
    d3.select(element).select('svg').remove();

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    // Create the SVG
    const svg = d3.select(element)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // Create the pie
    const pie = d3.pie<any>().value((d: any) => d.patientCount);

    // Define the arc
    const arc = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius);

    // Define the color scale
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create the arcs
    const arcs = svg.selectAll('arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    // Draw the pie slices
    arcs.append('path')
      .attr('d', arc)
      .attr('fill', (d: any, i: number) => color(i.toString()));

    // Add tooltips
    arcs.append('title')
      .text((d: any) => `${d.data.name}: ${d.data.patientCount} Patients`);

    // Add labels
    arcs.append('text')
      .attr('transform', (d: any) => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .style('fill', '#fff')
      .text((d: any) => d.data.patientCount);
  }
}