import { Injectable } from '@angular/core';
import { ITagger } from './ITagger';
import { Tag } from '../model/tag';
import { AwsClientsService } from './aws-clients.service';

@Injectable()
export class TagEc2Service implements ITagger {

  constructor(private awsClientService: AwsClientsService) { }
  ec2 = this.awsClientService.getEC2Client()

  getTags(resName: string) {
    var params = {
      Filters: [
        {
          Name: "resource-id",
          Values: [
            resName
          ]
        }
      ]
    };
    return this.ec2.describeTags(params)
      .promise()
      .then(awsTags => {
        awsTags = awsTags['Tags'];
        var tagsCount = Object.keys(awsTags).length;
        var tags: Tag[] = [];
        if (tagsCount > 0) {
          Object.keys(awsTags).forEach(key => {
            var tagobj = awsTags[key]
            tags.push({ name: tagobj['Key'], value: tagobj['Value'] });
          });
        }
        return tags;
      })
  }
  putTags(resName: string, tags: Tag[]) {
    var tagSet = []
    tags.forEach(tag => {
      var tagAr = {}
      tagAr['Key'] = tag.name
      tagAr['Value'] = tag.value
      tagSet.push(tagAr)
    })
    var params = {
      Resources: [
         resName
      ], 
      Tags: tagSet
     };
     console.log(params)
     return this.ec2.createTags(params)
      .promise()
  }
  deleteTags(resName: string, tags: Tag[]) {
    var tagSet = []
    tags.forEach(tag => {
      var tagAr = {}
      tagAr['Key'] = tag.name
      tagAr['Value'] = tag.value
      tagSet.push(tagAr)
    })
    var params = {
      Resources: [
         resName
      ], 
      Tags: tagSet
     };
     console.log(params)
     return this.ec2.deleteTags(params)
      .promise()
  }
  translareNameToARN(resName: string) {
    return Promise.resolve(resName)
  }

}
