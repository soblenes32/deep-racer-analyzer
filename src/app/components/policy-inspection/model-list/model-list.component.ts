import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { PolicyInspectionService } from './../../../services/policy-inspection/policy-inspection.service';
import { AwslogService } from './../../../services/awslog/awslog.service';
import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  constructor(
    public awslogService: AwslogService,
    public policyInspectionService: PolicyInspectionService) { }

  @ViewChild(MatSelectionList, {static: true})
  private selectionList: MatSelectionList;

  ngOnInit() {
      this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  fileName(fileObj) {
    return fileObj.Key.split('/')[2];
  }
  fileSize(fileObj) {
    return (fileObj.Size / 1000).toFixed(0);
  }

  fileSelectEvent() {
    // Fast fail if nothing has been selected, or an item has been deselected
    if (this.policyInspectionService.selectedModel.length < 1) { return; }
    console.dir(this.policyInspectionService.selectedModel);
    this.policyInspectionService.selectedModel.loadStatus = 'DOWNLOADING';
    this.awslogService.downloadS3ModelFile(this.policyInspectionService.selectedModel[0].Key, (data) => {
      console.log('File download completed');
      this.policyInspectionService.selectedModel.loadStatus = 'DOWNLOAD_COMPLETE';
      // TODO: Trigger snackbar on completion
    }, (error) => {
      console.log('Unable to download file.');
      this.policyInspectionService.selectedModel.loadStatus = 'DOWNLOAD_ERROR';
      // TODO: Trigger snackbar on error
    });
  }

}
