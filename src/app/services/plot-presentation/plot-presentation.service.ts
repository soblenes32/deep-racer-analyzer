import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlotPresentationService {
  public stepMarkerColorStrategy: string; // Valid values: ['REWARD', 'VELOCITY', 'EPISODE', 'ACTION_CLASS']
  public stepMarkerColorGradient1: string; // Hex value
  public stepMarkerColorGradient2: string; // Hex value
  private color1Obj: any; // {r:256, g:256, b:256}
  private color2Obj: any;
  public stepMarkerSize: number;
  public trackBorderColor: string; // Hex value
  public showTrackCenterline: boolean;
  public showEpisodeSequenceLine: boolean;
  public trackCenterlineColor: string; // Hex value

  private shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

  constructor() {
    this.stepMarkerColorStrategy = 'REWARD';
    this.stepMarkerColorGradient1 = '#69b3a2';
    this.stepMarkerColorGradient2 = '#8000ff';
    this.stepMarkerSize = 3;
    this.trackBorderColor = '#ffab00';
    this.showTrackCenterline = true;
    this.showEpisodeSequenceLine = true;
    this.trackCenterlineColor = '#302102';
    this.updateGradients();
  }

  updateGradients() {
    this.color1Obj = this.hexToRgb(this.stepMarkerColorGradient1);
    this.color2Obj = this.hexToRgb(this.stepMarkerColorGradient2);
  }

  /****************************************************************************************
   * Calculate the gradient of the step marker
   * @param val: the value to interpolate
   * @param min: the low interpolation boundary
   * @param max: the high interpolation boundary
   * @return Hex color string
   ****************************************************************************************/
  calcStepMarkerColor(val, min, max) {
    const percent = (val - min) / (max - min);
    const red = this.color1Obj.r + percent * (this.color2Obj.r - this.color1Obj.r);
    const green = this.color1Obj.g + percent * (this.color2Obj.g - this.color1Obj.g);
    const blue = this.color1Obj.b + percent * (this.color2Obj.b - this.color1Obj.b);
    return 'rgb(' + red + ',' + green + ',' + blue + ')';
  }

  hexToRgb(hex) {
    hex = hex.replace(this.shorthandRegex, (m, r, g, b) => {
      return r + r + g + g + b + b;
    });
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

}
