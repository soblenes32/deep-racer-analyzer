import { AwslogService } from './../../../services/awslog/awslog.service';
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-reward-iteration-report',
  templateUrl: './reward-iteration-report.component.html',
  styleUrls: ['./reward-iteration-report.component.css']
})
export class RewardIterationReportComponent implements OnInit, AfterViewInit {

  private margin = {top: 50, right: 50, bottom: 50, left: 50};
  private xScale: any;
  private yScale: any;
  private svg: any;
  private renderArr: any[];

  @ViewChild('rewardIterationPlotContainer', {static: false})
  rewardIterationPlotContainer: ElementRef;

  constructor(private awslogService: AwslogService) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.buildData();
    this.initializePlot();
  }

  initializePlot() {
    this.svg = d3.select('.reward-iteration-plot-container').append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('class', 'grid-container');
    this.buildPlotAxes();
    this.plotGraph();
  }

  buildData() {
    this.renderArr = [];
    const assocArr = {};
    this.awslogService.hrArr.forEach((e) => {
      let value = +e['total reward'];
      value = (Number.isNaN(value)) ? 0 : value;
      assocArr[e.iteration] = (assocArr[e.iteration]) ? +assocArr[e.iteration] + value : value;
    });
    Object.keys(assocArr).forEach((key) => {
      this.renderArr.push({x: +key, y: assocArr[key]});
    });
  }

  /**************************************************************************************************
   * Build plot axes
   **************************************************************************************************/
  buildPlotAxes() {
    // Fast-fail if no data
    if (!this.renderArr || this.renderArr.length < 1) { return; }
    const self = this;
    const width = this.rewardIterationPlotContainer.nativeElement.clientWidth;
    const height = this.rewardIterationPlotContainer.nativeElement.clientHeight;

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


    // // gridlines in x, y axis function
    // function make_x_gridlines() { return d3.axisBottom(self.xScale).ticks(5); }
    // function make_y_gridlines() { return d3.axisLeft(self.yScale).ticks(5); }
    // // add the X gridlines
    // this.svg.append('g')
    //   .attr('class', 'grid')
    //   .attr('transform', 'translate(0,' + height + ')')
    //   .call(make_x_gridlines()
    //       .tickSize(-height)
    //       .tickFormat(''));
    // // add the Y gridlines
    // this.svg.append('g')
    //   .attr('class', 'grid')
    //   .call(make_y_gridlines()
    //       .tickSize(-width)
    //       .tickFormat(''));

  }

  /**********************************************************************************
   * plotStepCircles - Makes dots for all steps in selected iterations
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
