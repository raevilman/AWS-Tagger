import { Component, OnInit, ViewChild, AfterViewInit} from '@angular/core';
import {MatSidenav} from '@angular/material/sidenav';
// import {MatIconModule} from '@angular/material/icon';
import { RES_TYPE } from "../../model/res-types";
import { PlaygroundComponent } from '../playground/playground.component';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  param = {value: 'world'};
  resources = [];
  selectedRes: String = RES_TYPE.DynamoDb;
  
  constructor() { 
    Object.keys(RES_TYPE).forEach(key => {
      this.resources.push(RES_TYPE[key])
    })
  }
  @ViewChild('sidenav') sidenav: MatSidenav;
  @ViewChild(PlaygroundComponent) 
  private playground: PlaygroundComponent;

  displayPlaygroundBool:boolean = false;

  displayPlayground() {
    if(this.displayPlaygroundBool) {
      return "block";
    } else {
      return "none";
    }
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.onResSelect = (res:String)=>{
      this.selectedRes = res;
      this.playground.changeGround(RES_TYPE[''+this.selectedRes])
      this.displayPlaygroundBool = true      
    }
  }

  close(reason: string) {
    // console.log('Closed due to: '+reason);
    this.sidenav.close();
  }

  onResSelect(res: String): void {
    
  }
}
