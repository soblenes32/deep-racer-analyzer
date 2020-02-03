import { PolicyInspectionService } from './../../../services/policy-inspection/policy-inspection.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-selection',
  templateUrl: './image-selection.component.html',
  styleUrls: ['./image-selection.component.css']
})
export class ImageSelectionComponent implements OnInit {


  constructor(private policyInspectionService: PolicyInspectionService) { }

  ngOnInit() {
    if (this.policyInspectionService.imageArr.length > 0 && !this.policyInspectionService.selectedImage) {
      this.selectImage(this.policyInspectionService.imageArr[0]);
    }
  }

  selectImage(imageUriObj) {
    this.policyInspectionService.selectedImage = imageUriObj;
  }
}
