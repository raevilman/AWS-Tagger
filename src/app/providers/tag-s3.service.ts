import { Injectable } from '@angular/core';
import { ITagger } from './ITagger';
import { Tag } from '../model/tag';
import { AwsClientsService } from './aws-clients.service';

@Injectable()
export class TagS3Service implements ITagger {
  constructor(private awsClientService: AwsClientsService) { }
  s3 = this.awsClientService.getS3Client()


  getTags(resName: string) {
    var params = {
      Bucket: resName
    };
    return this.s3.getBucketTagging(params)
      .promise()
      .then(awsTags => {
        awsTags = awsTags['TagSet']
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
  //   [
  //     {
  //    Key: "Key1", 
  //    Value: "Value1"
  //   }, 
  //     {
  //    Key: "Key2", 
  //    Value: "Value2"
  //   }
  //  ]
    var tagSet = []
    tags.forEach(tag => {
      var tagAr = {}
      tagAr['Key'] = tag.name
      tagAr['Value'] = tag.value
      tagSet.push(tagAr)
    })
    var params = {
      Bucket: resName, 
      Tagging: {
       TagSet: tagSet
      }
     };
     console.log(params)
     return this.s3.putBucketTagging(params)
      .promise()
  }
  deleteTags(resName: string, tags: string[]) {
    return Promise.resolve(resName)
  }
  translareNameToARN(resName: string) {
    return Promise.resolve(resName)
  }
}
