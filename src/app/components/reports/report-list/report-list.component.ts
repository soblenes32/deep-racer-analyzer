import { SelectionModel } from '@angular/cdk/collections';
import { ReportService } from './../../../services/report/report.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList, MatListOption } from '@angular/material/list';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.css']
})
export class ReportListComponent implements OnInit {

  constructor(public reportService: ReportService) { }

  @ViewChild(MatSelectionList, {static: true})
  private selectionList: MatSelectionList;

  ngOnInit() {
    this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  openReport(link) {
    console.log('Open report with link: ' + link);
    this.reportService.selectedReport = link;
  }

}
