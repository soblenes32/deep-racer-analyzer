import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  public reportList = [
    {name: 'Iteration reward vs iteration #', description: 'Scatter plot of reward vs iteration number', link: 'REWARD_ITERATION'},
    {name: 'Episode reward vs iteration #', description: 'Scatter plot of episode reward vs iteration number', link: 'REWARD_EPISODE'}
  ];
  public selectedReport: string;
  constructor() { }
}
