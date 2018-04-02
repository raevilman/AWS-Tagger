import { Component, OnInit, ViewChild } from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
// import {MatIconModule} from '@angular/material/icon';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  param = {value: 'world'};
  resources = ['Lambda','EC2','API Gateway', 'DynamoDb'];
  selectedRes: String;

  

  constructor() { }
  
  ngOnInit() {
  }

  @ViewChild('sidenav') sidenav: MatSidenav;

  close(reason: string) {
    console.log('Closed due to: '+reason);
    this.sidenav.close();
  }

  onResSelect(res: String): void {
    this.selectedRes = res;
  }
}
