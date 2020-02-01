import { PlotPresentationService } from './../../../../services/plot-presentation/plot-presentation.service';
import { AppEvent } from './../../../../models/app-event';
import { SubscriptionService } from '../../../../services/subscription/subscription.service';
import { LogTreeNodeDatabaseService } from './../../../../services/logtreenodedatabase/log-tree-node-database.service';
import { RacetrackService } from './../../../../services/racetrack/racetrack.service';
import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-path-plot',
  templateUrl: './path-plot.component.html',
  styleUrls: ['./path-plot.component.css']
})
export class PathPlotComponent implements OnInit, AfterViewInit {

  // Shared plotting constructs
  private margin = {top: 50, right: 50, bottom: 50, left: 50};
  private xScale: any;
  private yScale: any;
  private svg: any;

  @ViewChild('pathPlotContainer', {static: false})
  pathPlotContainer: ElementRef;

  constructor(
    private racetrackService: RacetrackService,
    private logTreeNodeDatabase: LogTreeNodeDatabaseService,
    private subscriptionService: SubscriptionService,
    private plotPresentationService: PlotPresentationService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initializePlot();
    // Listen for changes to tree node selections
    this.logTreeNodeDatabase.on('tree-node-change', (e) => { this.plotPaths(); });
    // listen for data reload event
    this.subscriptionService.on('log-data-change', (e) => {
      this.buildPlotAxes();
      this.plotRacetrack();
      this.plotPaths();
    });
    // listen for plot restyle event
    this.subscriptionService.on('plot-style-change', (e) => {
      d3.select('.path-plot-container').select('svg').remove();
      this.initializePlot();
      this.plotPaths();
    });
  }

  /**************************************************************************************************
   * (Re)Initialize plot: run after view transition -or- after load of track data is complete
   **************************************************************************************************/
  initializePlot() {
    this.svg = d3.select('.path-plot-container').append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
    .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')')
      .attr('class', 'grid-container');
    this.buildPlotAxes();
    this.plotRacetrack();
  }

  /**************************************************************************************************
   * Build plot axes
   **************************************************************************************************/
  buildPlotAxes() {
    // Fast-fail if racetrackService data is not loaded
    if (!this.racetrackService.outerBoundary) { return; }
    const width = this.pathPlotContainer.nativeElement.clientWidth;
    const height = this.pathPlotContainer.nativeElement.clientHeight;

    // Get the min and max x and y coordinates from the track outer boundary to scale the plot
    let xMin = Math.min(...this.racetrackService.outerBoundary.map((coord) => +coord[0])) - 0.2;
    let yMin = Math.min(...this.racetrackService.outerBoundary.map((coord) => +coord[1])) - 0.2;
    let xMax = Math.max(...this.racetrackService.outerBoundary.map((coord) => +coord[0])) + 0.2;
    let yMax = Math.max(...this.racetrackService.outerBoundary.map((coord) => +coord[1])) + 0.2;

    // Scale the smaller dimension to the same total distance as the larger dimension so that the track doesn't skew
    const xLen = xMax - xMin;
    const yLen = yMax - yMin;
    if (xLen > yLen) {
      const rescaleAmt = (xLen - yLen) / 2;
      xMin -= rescaleAmt;
      xMax += rescaleAmt;
    } else if (xLen < yLen) {
      const rescaleAmt = (yLen - xLen) / 2;
      yMin -= rescaleAmt;
      yMax += rescaleAmt;
    }

    this.xScale = d3.scaleLinear()
      .domain([xMin, xMax])
      .range([0, width - this.margin.left - this.margin.right]);

    this.yScale = d3.scaleLinear()
      .domain([yMin, yMax])
      .range([height - this.margin.top - this.margin.bottom, 0]);

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
  }

  /**************************************************************************************************
   * Plot racetrack
   **************************************************************************************************/
  plotRacetrack() {
    // Fast-fail if racetrackService data is not loaded
    if (!this.racetrackService.outerBoundary) { return; }
    const line = d3.line()
      .x((d) => this.xScale(d[0])) // set the x values for the line generator
      .y((d) => this.yScale(d[1]));

    // Clear out any old bounary lines
    this.svg.selectAll('.track-boundary').remove();
    this.svg.selectAll('.track-centerline').remove();

    // Draw the outer track boundary
    this.svg.append('path')
      .datum(this.racetrackService.outerBoundary)
      .attr('d', line)
      .attr('class', 'track-boundary')
      .style('stroke', this.plotPresentationService.trackBorderColor);
    // Draw the inner track boundary
    this.svg.append('path')
      .datum(this.racetrackService.innerBoundary)
      .attr('d', line)
      .attr('class', 'track-boundary')
      .style('stroke', this.plotPresentationService.trackBorderColor);
    if (this.plotPresentationService.showTrackCenterline) {
      this.svg.append('path')
        .datum(this.racetrackService.centerLine)
        .attr('d', line)
        .attr('class', 'track-centerline')
        .style('stroke', this.plotPresentationService.trackCenterlineColor);
    }
  }

  getStepValue(step) {
    let val = 0;
    val = this.plotPresentationService.stepMarkerColorStrategy === 'REWARD' ? step.reward : val;
    val = this.plotPresentationService.stepMarkerColorStrategy === 'VELOCITY' ? step.reward : val;
    val = this.plotPresentationService.stepMarkerColorStrategy === 'EPISODE' ? step.episode : val;
    val = this.plotPresentationService.stepMarkerColorStrategy === 'ACTION_CLASS' ? step.action : val;
    return val;
  }

  plotPaths() {
    const self = this;
    const episodeArr = this.logTreeNodeDatabase.getSelectedEpisodes();

    // Calculate the min and max values among the selected episodes
    let min = 0;
    let max = 0;

    max = (this.plotPresentationService.stepMarkerColorStrategy === 'VELOCITY') ? 5 : max;

    episodeArr.forEach((episode) => {
      episode.steps.forEach(step => {
        if (this.plotPresentationService.stepMarkerColorStrategy === 'REWARD') {
          max = (max < step.reward) ? step.reward : max;
        } else if (this.plotPresentationService.stepMarkerColorStrategy === 'EPISODE') {
          min = (min > step.episode) ? step.episode : min;
          max = (max < step.episode) ? step.episode : max;
        } else if (this.plotPresentationService.stepMarkerColorStrategy === 'ACTION_CLASS') {
          min = (min > step.action) ? step.action : min;
          max = (max < step.action) ? step.action : max;
        }
      });
    });

    if (this.plotPresentationService.showEpisodeSequenceLine) {
      this.plotStepLines(episodeArr, min, max);
    }
    this.plotStepCircles(episodeArr, min, max);
  }

  /**********************************************************************************
   * plotStepCircles - Makes dots for all steps in selected episodes
   **********************************************************************************/
  plotStepCircles(episodeArr, min, max) {
    const self = this;
    this.svg
    .selectAll('.episode-group')
    .data(episodeArr, (e) => e.steps[0].episode)
    .enter()
      .append('g')
      .attr('class', 'episode-group')
      .selectAll('.step-marker')
      .data((e) => e.steps)
      .enter()
        .append('circle')
        .attr('cx', (s) => this.xScale(s.x) )
        .attr('cy', (s) => this.yScale(s.y) )
        .attr('r', this.plotPresentationService.stepMarkerSize)
        .style('fill', (s) => self.plotPresentationService.calcStepMarkerColor(this.getStepValue(s), min, max))
        .attr('class', 'step-marker')
        .on('click', (step) => {
          const stepEvent = new AppEvent();
          stepEvent.name = 'step-select';
          stepEvent.value = step;
          this.subscriptionService.emit(stepEvent);
          this.placeSelectionCircle(step);
        })
        .on('mouseover', function(step) {
          d3.select(this).style('cursor', 'pointer');
          d3.select(this).attr('r', self.plotPresentationService.stepMarkerSize + 3).style('fill', '#4dff4d').raise();
        })
        .on('mouseout', function(step) {
          d3.select(this).style('cursor', 'default');
          d3.select(this)
            .attr('r', self.plotPresentationService.stepMarkerSize)
            .style('fill', (s) => self.plotPresentationService.calcStepMarkerColor(self.getStepValue(s), min, max));
        });

    this.svg
    .selectAll('.episode-group')
    .data(episodeArr, (e) => e.steps[0].episode)
      .exit()
      .remove();
  }

  /**********************************************************************************
   * plotStepLines - Makes dots for all steps in selected episodes
   **********************************************************************************/
  plotStepLines(episodeArr, min, max) {
    const self = this;
    const line = d3.line()
      .x((step) => this.xScale(step.x)) // set the x values for the line generator
      .y((step) => this.yScale(step.y));

    this.svg
    .selectAll('.episode-line')
    .data(episodeArr, (e) => e)
    .exit()
      .remove();


    this.svg
    .selectAll('.episode-line')
    .data(episodeArr, (e) => e.steps[0].episode)
    .enter()
      .append('path')
      .style('stroke', self.plotPresentationService.stepMarkerColorGradient1)
      .style('stroke-width', 3)
      .style('fill', 'none')
      .attr('class', 'episode-line')
      .datum((e) => e.steps)
        .attr('d', line);
  }

  /**********************************************************************************
   * placeSelectionCircle - Places a green circle around the last selected step
   **********************************************************************************/
  placeSelectionCircle(step) {
    let selCir = this.svg.selectAll('.selectionCircle');
    if (selCir.empty()) {
      selCir = this.svg.append('circle')
        .attr('r', this.plotPresentationService.stepMarkerSize + 5)
        .attr('class', 'selectionCircle')
        .style('stroke-width', 3)
        .style('stroke', '#4dff4d')
        .style('fill', 'none');
    }
    selCir.attr('r', this.plotPresentationService.stepMarkerSize + 5)
      .attr('cx', this.xScale(step.x))
      .attr('cy', this.yScale(step.y))
      .raise();
  }

}
