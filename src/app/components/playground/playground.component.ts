import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaggerService } from '../../providers/tagger.service'
import { Tag } from '../../model/tag'
import { RES_TYPE } from '../../model/res-types';
const storage = window.require('electron-json-storage');
const storageKey = 'AwsOne.db';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

 resourceType: String;

  resLabel: String;

  loadButtonText: String = "Load";
  saveButtonText: String = "Save";

  // tags: Tag[] = [{name: 'Tag1', value:'Value1'},{name: 'Tag2', value:'Value2'}];
  tags: Tag[] = [];
  //represent the state of tags in cloud. So if I am sending set of new tags, 
  //where I have removed one tag which is sitting there in the cloud then 
  //I need to untag this in separate call bec call/method to set and unset are different.
  cloudTags: Tag[] = [];
  tagsHistory: Tag[] = [];

  // noTagARN = 'arn:aws:lambda:us-east-1:856095205542:function:API_CONFIG';
  // tagARN = 'arn:aws:lambda:us-east-1:856095205542:function:CICD-Demo';
  resName: string = 'neo-development-territory';
  funcARN: string;
  notYetLoaded: Boolean = true;
  errMsgLoad: String = '';
  errMsgSave: String = '';
  wasCallSuccess: Boolean = false;

  constructor(private taggerService: TaggerService) {
    this.processResourceLabel()
  }

  processResourceLabel(){
    switch(this.resourceType){
      case RES_TYPE.API_Gateway:{
        this.resLabel = 'API'
        break;
      }

      case RES_TYPE.DynamoDb:{
        this.resLabel = 'Table'
        break;
      }

      case RES_TYPE.EC2:{
        this.resLabel = 'Instance'
        break;
      }

      case RES_TYPE.Lambda:{
        this.resLabel = 'Function'
        break;
      }

      case RES_TYPE.S3:{
        this.resLabel = 'Bucket'
        break;
      }

      
    }
  }

  ngOnInit() {
  }

  changeGround(selectedMenu: RES_TYPE)  {
    this.resourceType = selectedMenu
    this.resetPlayground()
    this.processResourceLabel()
    this.taggerService.setResourceType(selectedMenu)
  }

  loadTagsHistory() {
    const thisObject = this;
    storage.get(storageKey, function (error, data) {
      if (error) throw error;
      thisObject.tagsHistory = [];
      if (Object.keys(data).length > 0) {
        Object.keys(data).forEach(key => {
          // console.log( + data[key].value)
          thisObject.addPastTagRow(data[key].name, data[key].value)
        });
      }
    });
  }

  loadLambdaTags() {
    this.resetPlayground()
    this.notYetLoaded = false;
    if(this.tagsHistory.length < 1) {
      this.loadTagsHistory();
    }
    this.loadButtonText = "Loading";
    // const thisObject = this;
    this.taggerService.translareNameToARN(this.resName)
      .then(arn => {
        this.funcARN = arn
        return arn;
      })
      .then(arn=>{
        return this.taggerService.getTags(this.funcARN)
      })
      .then(_tags=>{
        this.tags = _tags
        this.dumpTagsArrToCloudArr()
        this.loadButtonText = "Load";
      })
      .catch(error => {
        this.handleErrorInLoad(error)
      });
  }

  handleErrorInLoad(error) {
    console.log("Promise failed " + error);
    this.loadButtonText = "Load";
    this.errMsgLoad = error;
  }

  handleErrorInSave(error) {
    console.log("Promise failed " + error);
    this.saveButtonText = "Save"
    this.errMsgSave = error;
  }

  updateTagsHistoryAndPersists() {
    this.tags.forEach(tag => {
      var seen = false;
      this.tagsHistory.every(function (pastTag, index) {
        if (pastTag.name == tag.name) {
          seen = true;
          pastTag.value = tag.value;
          return false;
        }
        else return true;
      })
      if (!seen) {
        this.addPastTagRow(tag.name, tag.value);
      }
    });
    storage.set(storageKey, this.tagsHistory, function (error) {
      if (error) throw error;
    });
  }

  saveLambdaTags() {
    this.initCall()
    this.updateTagsHistoryAndPersists();
    this.taggerService.putTags(this.funcARN, this.tags)
      .then(response => {
        this.unsetLambdaTags()
      })
      .catch(error => {
        this.handleErrorInSave(error)
      });
  }

  unsetLambdaTags(){
    // collect tags  to unset
    var removedTagsKeys: string[] = [];
    this.cloudTags.forEach(cloudTag => {
      var seen = false;
      this.tags.every(function (tag, index) {
        if (tag.name == cloudTag.name) {
          seen = true;
          return false;
        } else{
          return true;
        }
      });
      if (!seen) {
        removedTagsKeys.push(cloudTag.name)
      }
    });

    //Check and send the call
    if(removedTagsKeys.length > 0 ){
      this.taggerService.deleteTags(this.funcARN, removedTagsKeys)
      .then(response => {
        this.completeOperation()
      })
      .catch(error => {
        this.handleErrorInSave(error)
      });
    } else{
      this.completeOperation()
    }
  }

  initCall(){
    this.saveButtonText = "Saving"
    this.wasCallSuccess = false;
  }
  completeOperation(){
    this.saveButtonText = "Save"
    this.wasCallSuccess = true;
    this.dumpTagsArrToCloudArr();
  }

  resetPlayground(){
    this.errMsgLoad='';
    this.wasCallSuccess=false;
    this.tags = [];
    this.cloudTags=[];
    this.notYetLoaded=true
  }

  addTagRow(name: string, value: string) {
    var tag: Tag = new Tag();
    tag.name = name;
    tag.value = value;
    this.tags.push(tag);
  }

  addPastTagRow(name: string, value: string) {
    var tag: Tag = new Tag();
    tag.name = name;
    tag.value = value;
    this.tagsHistory.push(tag);
  }

  dumpTagsArrToCloudArr(){
    this.cloudTags = []; //clear the array 
    this.tags.forEach(element => {
      this.cloudTags.push(this.cloneTagObject(element))
    });
  }

  cloneTagObject(p_tag:Tag):Tag{
    var tag: Tag = new Tag();
    tag.name = p_tag.name;
    tag.value = p_tag.value;
    return tag;
  }

  addBlankTagRow() {
    this.addTagRow("", "");
  }

  removeTagRow(tag) {
    const index: number = this.tags.indexOf(tag);
    if (index !== -1) {
      this.tags.splice(index, 1);
    }
  }

  checkAlreadyUsed(p_tag) {
    var seen = false;
    this.tags.every(function (tag, index) {
      if (p_tag.name == tag.name) {
        seen = true;
        return false;
      }
      else return true;
    })
    return seen;
  }

  isWorkingState() {
    if (this.errMsgLoad
      || this.loadButtonText == "Loading"
      || !this.resName
      || this.notYetLoaded) {
      return false;
    } else {
      return true;
    }
  }

}
