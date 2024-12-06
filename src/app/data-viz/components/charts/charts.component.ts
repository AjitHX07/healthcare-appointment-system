import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DataVizService } from '../../services/data-viz.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-charts',
  standalone: true,
  imports: [],
  templateUrl: './charts.component.html',
  styleUrl: './charts.component.scss'
})
export class ChartsComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;

  constructor(private dataVizService: DataVizService) { }

  ngOnInit(): void {
    this.dataVizService.getAppointmentsCountByDoctor().subscribe((data) => {
      this.createChart(data);
    });
  }

  createChart(data: { doctor: string; count: number }[]): void {
    const element = this.chartContainer.nativeElement;

    // Define chart dimensions and margins
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = element.offsetWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    // Create the SVG container
    const svg = d3
      .select(element)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create X and Y scales
    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.doctor)) // Map doctors to X-axis
      .range([0, width])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.count)!]) // Map counts to Y-axis
      .nice() // Adjust for cleaner axis ticks
      .range([height, 0]);

    // Define color scale for bars
    const colorScale = d3.scaleOrdinal(d3.schemeSet2);

    // Draw bars for each data point
    svg
      .append('g')
      .selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (d) => x(d.doctor)!)
      .attr('y', (d) => y(d.count))
      .attr('width', x.bandwidth())
      .attr('height', (d) => height - y(d.count))
      .attr('fill', (d, i) => colorScale(i.toString()) as string);

    // Add X-axis with labels
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x));

    // Add Y-axis
    svg.append('g').call(d3.axisLeft(y));
  }
}