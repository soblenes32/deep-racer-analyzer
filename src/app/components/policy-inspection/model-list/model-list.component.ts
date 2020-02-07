import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectionList, MatListOption } from '@angular/material/list';
import { PolicyInspectionService } from './../../../services/policy-inspection/policy-inspection.service';
import { AwslogService } from './../../../services/awslog/awslog.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-model-list',
  templateUrl: './model-list.component.html',
  styleUrls: ['./model-list.component.css']
})
export class ModelListComponent implements OnInit {

  constructor(
    public awslogService: AwslogService,
    public policyInspectionService: PolicyInspectionService,
    private matSnackBar: MatSnackBar) { }

  @ViewChild(MatSelectionList, {static: true})
  private selectionList: MatSelectionList;

  ngOnInit() {
      this.selectionList.selectedOptions = new SelectionModel<MatListOption>(false);
  }

  fileName(fileObj) { return fileObj.Key.split('/')[2]; }
  fileSize(fileObj) { return (fileObj.Size / 1000).toFixed(0); }

  fileSelectEvent() {
    // Fast fail if nothing has been selected, or an item has been deselected
    if (this.policyInspectionService.selectedModel.length < 1) { return; }
    const modelObj = this.policyInspectionService.selectedModel[0];
    modelObj.loadStatus = 'DOWNLOADING';
    this.awslogService.downloadS3ModelFile(modelObj.Key, (data) => {
      modelObj.loadStatus = 'COMPLETE';
      // TODO: Trigger snackbar on completion
      this.openSnackBar('Finished downloading ' + this.fileName(modelObj) + '.', 'Ok', false);
    }, (error) => {
      modelObj.loadStatus = 'DOWNLOAD_ERROR';
      this.openSnackBar('Error downloading ' + this.fileName(modelObj) + ': ' + error.message, 'Ok', true);
    });
  }

  openSnackBar(message: string, action: string, error: boolean = false) {
    this.matSnackBar.open(message, action, {
      duration: 5000,
      panelClass: (error) ? 'snackbar-container-error' : 'snackbar-container-ok'
    });
  }

}
