import { Injectable } from '@angular/core';
import { Lambda } from 'aws-sdk';
import { Tag } from '../model/tag'
var AWS = window.require('aws-sdk');
// var AWS2 = window.require('aws-sdk')

var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;

AWS.config.update({
  region: 'us-east-1',
});

var lambda = new AWS.Lambda();

@Injectable()
export class TaggerService {

  constructor() { }

  writeTagsToLambda(funcARN: String, tags: Tag[]): Promise<any>{
    var wireTheseTags = {}
    tags.forEach(tag => {
      wireTheseTags[tag.name] = tag.value
    })
    var params = {
      Resource : funcARN,
      Tags : wireTheseTags
    };
    return lambda.tagResource(params)
        .promise()
  }

  removeTagsFromLambda(funcARN: String, tags: String[]): Promise<any>{
    var params = {
      Resource : funcARN,
      TagKeys : tags
    };
    return lambda.untagResource(params)
        .promise()
  }

  getLambdaConfig(funcName: String): Promise<any>{
    var params = {
      FunctionName: funcName
    };
    return lambda.getFunctionConfiguration(params)
        .promise()
  }
  getLambdaTags(funcName: String): Promise<any>{
  // Promise<Lambda.Tags>{
    var params = {
      Resource: funcName /* required */
    };
    
    return lambda.listTags(params)
              .promise();
              // .then(response => response)
              // .catch(this.handleError);

    // var listTagsPromise = lambda.listTags(params).promise()
    // .then(
    //   function(data) {  
    //     /* process the data */
    //     console.log('Got promise');
    //     console.log(data['Tags']);  
    //     return data['Tags'];
    //   },
    //   function(error) {
    //     /* handle the error */
    //     console.log(error);
    //   }
    // );
    // return listTagsPromise;
    // lambda.listTags(params, function(err, data) {
    //   if (err) console.log(err, err.stack); // an error occurred
    //   else     console.log(data); console.log(data['Tags']);          // successful response
    // });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
