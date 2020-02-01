import { Component, OnInit } from '@angular/core';
import {MatDialogRef} from '@angular/material/dialog';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<SetupComponent>) { }

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}
