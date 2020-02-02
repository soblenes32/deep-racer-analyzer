import { AwslogService } from './../../../services/awslog/awslog.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-reward-episode-report',
  templateUrl: './reward-episode-report.component.html',
  styleUrls: ['./reward-episode-report.component.css']
})
export class RewardEpisodeReportComponent implements OnInit, AfterViewInit {

  private margin = {top: 50, right: 50, bottom: 50, left: 50};
  private xScale: any;
  private yScale: any;
  private svg: any;
  private renderArr: any[];

  @ViewChild('rewardEpisodePlotContainer', {static: false})
  rewardEpisodePlotContainer: ElementRef;

  constructor(private awslogService: AwslogService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.buildData();
    this.initializePlot();
  }

  initializePlot() {
    this.svg = d3.select('.reward-episode-plot-container').append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('class', 'grid-container');
    this.buildPlotAxes();
    this.plotGraph();
  }

  buildData() {
    this.renderArr = this.awslogService.hrArr.map((e) => ({x: e.iteration, y: +e['total reward']}));
    console.dir(this.renderArr);
  }

  /**************************************************************************************************
   * Build plot axes
   **************************************************************************************************/
  buildPlotAxes() {
    // Fast-fail if no data
    if (!this.renderArr || this.renderArr.length < 1) { return; }
    const self = this;
    const width = this.rewardEpisodePlotContainer.nativeElement.clientWidth;
    const height = this.rewardEpisodePlotContainer.nativeElement.clientHeight;

    // Get the min and max x and y coordinates from the track outer boundary to scale the plot
    const xMin = Math.min(...this.renderArr.map((r) => r.x));
    const xMax = Math.max(...this.renderArr.map((r) => r.x));
    const yMin = Math.min(...this.renderArr.map((r) => r.y));
    const yMax = Math.max(...this.renderArr.map((r) => r.y));

    this.xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, width - this.margin.left - this.margin.right])
      .nice();

    this.yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height - this.margin.top - this.margin.bottom, 0])
      .nice();

    // Build axes
    this.svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + (height - this.margin.top - this.margin.bottom) + ')')
      .call(d3.axisBottom(this.xScale));
    this.svg.append('g')
      .attr('class', 'y axis')
      .call(d3.axisLeft(this.yScale));
    // Build plot area
    this.svg.append('g')
      .attr('class', 'plot-group');

    // text label for the x axis
    this.svg.append('text')
      .attr('transform', 'translate(' + (width / 2) + ' ,' + (height - this.margin.bottom - 10) + ')')
      .style('text-anchor', 'middle')
      .style('fill', '#fff')
      .text('Iteration number');

    // text label for the y axis
    this.svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - this.margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('fill', '#fff')
      .style('text-anchor', 'middle')
      .text('Reward');
  }

    /**********************************************************************************
   * plotStepCircles - Makes dots for all steps in selected episodes
   **********************************************************************************/
  plotGraph() {
    this.svg.selectAll('.iteration-reward').remove();
    this.svg.selectAll('grid-container')
    .data(this.renderArr)
      .enter()
      .append('circle')
      .attr('cx', (s) => this.xScale(s.x) )
      .attr('cy', (s) => this.yScale(s.y) )
      .attr('r', 7)
      .style('fill', '#4dff4d')
      .attr('class', 'iteration-reward');
  }

}
