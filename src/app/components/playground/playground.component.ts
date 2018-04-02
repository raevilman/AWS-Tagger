import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaggerService } from '../../providers/tagger.service'
import { Tag } from '../../model/tag'
const storage = window.require('electron-json-storage');
const storageKey = 'AwsOne.db';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss']
})
export class PlaygroundComponent implements OnInit {

  @Input() resourceName: String;

  loadButtonText: String = "Load";
  saveButtonText: String = "Save";

  // tags: Tag[] = [{name: 'Tag1', value:'Value1'},{name: 'Tag2', value:'Value2'}];
  tags: Tag[] = [];
  //represent the state of tags in cloud. So if I am sending set of new tags, 
  //where I have removed one tag which is sitting there in the cloud then 
  //I need to untag this in separate call bec call/method to set and unset are different.
  cloudTags: Tag[] = [];
  pastTags: Tag[] = [];

  // noTagARN = 'arn:aws:lambda:us-east-1:856095205542:function:API_CONFIG';
  // tagARN = 'arn:aws:lambda:us-east-1:856095205542:function:CICD-Demo';
  resName: String = '';
  funcARN: String;
  notYetLoaded: Boolean = true;
  errMsgLoad: String = '';
  errMsgSave: String = '';
  wasCallSuccess: Boolean = false;

  constructor(private taggerService: TaggerService) {
    console.log('I am in constructor')
  }

  ngOnInit() {
    console.log('I am in ngInit')
  }

  loadPastTags() {
    const thisObject = this;
    storage.get(storageKey, function (error, data) {
      if (error) throw error;
      thisObject.pastTags = [];
      if (Object.keys(data).length > 0) {
        Object.keys(data).forEach(key => {
          // console.log( + data[key].value)
          thisObject.addPastTagRow(data[key].name, data[key].value)
        });
      }
      console.log('after loading logs');
      console.log(thisObject.pastTags);
    });
  }

  loadLambdaTags() {
    this.notYetLoaded = false;
    var pastTagsCount = this.pastTags.length
    if (pastTagsCount < 1) {
      this.loadPastTags();
    }
    this.loadButtonText = "Loading";
    this.resetPlayground()
    // const thisObject = this;
    this.taggerService.getLambdaConfig(this.resName)
      .then(config => {
        this.funcARN = config['FunctionArn'];
        console.log('funcARN is ' + this.funcARN)
        this.taggerService.getLambdaTags(this.funcARN)
          .then(awsTags => {
            awsTags = awsTags['Tags'];
            var tagsCount = Object.keys(awsTags).length;
            if (tagsCount > 0) {
              Object.keys(awsTags).forEach(key => {
                this.tags.push({ name: key, value: awsTags[key] });
              });
              this.dumpTagsArrToCloudArr()
              console.log(this.cloudTags)
              
            } else {
              console.log('Tags not found!')
            }
            this.loadButtonText = "Load";
          })
          .catch(error => {
            this.handleErrorInLoad(error)
          });
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

  updatePastTagsAndPersists() {
    this.tags.forEach(tag => {
      var seen = false;
      this.pastTags.every(function (pastTag, index) {
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
    storage.set(storageKey, this.pastTags, function (error) {
      if (error) throw error;
    });
  }

  saveLambdaTags() {
    this.initCall()
    this.updatePastTagsAndPersists();
    this.taggerService.writeTagsToLambda(this.funcARN, this.tags)
      .then(response => {
        this.unsetLambdaTags()
      })
      .catch(error => {
        this.handleErrorInSave(error)
      });
  }

  unsetLambdaTags(){
    // collect tags  to unset
    var removedTagsKeys: String[] = [];
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
      this.taggerService.removeTagsFromLambda(this.funcARN, removedTagsKeys)
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
    this.pastTags.push(tag);
  }

  dumpTagsArrToCloudArr(){
    this.cloudTags = []; //clear the array 
    this.tags.forEach(element => {
      this.cloudTags.push(this.cloneTagObject(element))
    });
    console.log('copying finishes')
    console.log(this.cloudTags)
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
