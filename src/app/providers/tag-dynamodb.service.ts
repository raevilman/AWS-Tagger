import { Injectable } from '@angular/core';
import { ITagger } from './ITagger';
import { Tag } from '../model/tag';
import { AwsClientsService } from './aws-clients.service';

@Injectable()
export class TagDynamodbService implements ITagger {

  constructor(private awsClientService: AwsClientsService) { }
  dynamoDbClient = this.awsClientService.getDynamoDbClient()

  getTags(resName: string) {
    var params = {
      ResourceArn: resName, /* required */
      // NextToken: 'STRING_VALUE'
    };
    return this.dynamoDbClient.listTagsOfResource(params)
      .promise()
      .then(awsTags => {
        awsTags = awsTags['Tags']
        var tagsCount = Object.keys(awsTags).length;
        var tags: Tag[] = [];
        if (tagsCount > 0) {
          Object.keys(awsTags).forEach(key => {
            var tagobj = awsTags[key]
            tags.push({ name: tagobj['Key'], value: tagobj['Value'] });
          });
        }
        return tags;
      });

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
      ResourceArn: resName, /* required */
      Tags: tagSet
    };
    return this.dynamoDbClient.tagResource(params)
      .promise()
  }
  deleteTags(resName: string, tags: Tag[]) {
    var removedTagsKeys: string[] = [];
    tags.forEach(tag=>{
      removedTagsKeys.push(tag.name)
    })
    var params = {
      ResourceArn: resName, /* required */
      TagKeys: removedTagsKeys
    };
    return this.dynamoDbClient.untagResource(params)
      .promise()
  }
  translareNameToARN(resName: string) {
    var params = {
      TableName: resName
     };
     return this.dynamoDbClient.describeTable(params)
      .promise()
      .then(function(description){
        //.Table.TableArn
        return description['Table']['TableArn']
      })

  }

}
