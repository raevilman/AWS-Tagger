import { Injectable } from '@angular/core';
import { Lambda } from 'aws-sdk';
import { } from "../../providers/aws";
import { AwsClientsService } from "./aws-clients.service";
import { Tag } from '../model/tag'
import { ITagger } from "./ITagger";


@Injectable()
export class TagLambdaService implements ITagger {
  constructor(private awsClientService: AwsClientsService) { }
  lambda = this.awsClientService.getLambdaClient()

  putTags(funcARN: String, tags: Tag[]): Promise<any> {
    var wireTheseTags = {}
    tags.forEach(tag => {
      wireTheseTags[tag.name] = tag.value
    })
    var params = {
      Resource: funcARN,
      Tags: wireTheseTags
    };
    return this.lambda.tagResource(params)
      .promise()
  }

  deleteTags(funcARN: String, tags: String[]): Promise<any> {
    var params = {
      Resource: funcARN,
      TagKeys: tags
    };
    return this.lambda.untagResource(params)
      .promise()
  }

  translareNameToARN(funcName: String): Promise<any> {
    var params = {
      FunctionName: funcName
    };
    return this.lambda.getFunctionConfiguration(params)
      .promise()
      .then(function (config) {
        return config['FunctionArn']
      })
  }

  getTags(funcName: String): Promise<any> {
    // Promise<Lambda.Tags>{
    var params = {
      Resource: funcName /* required */
    };

    return this.lambda.listTags(params)
      .promise()
      .then(awsTags => {
        awsTags = awsTags['Tags'];
        var tagsCount = Object.keys(awsTags).length;
        var tags: Tag[] = [];
        if (tagsCount > 0) {
          Object.keys(awsTags).forEach(key => {
            tags.push({ name: key, value: awsTags[key] });
          });
        }
        return tags;        
      });
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}
