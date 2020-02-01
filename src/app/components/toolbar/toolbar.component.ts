import { AwslogService } from './../../services/awslog/awslog.service';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  navigationView: string;

  constructor(private location: Location, public awslogService: AwslogService) {
  }

  ngOnInit() {
    this.navigationView = this.location.path();
    console.log('location: ' + this.location.path());
  }

}
