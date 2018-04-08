import { Injectable } from '@angular/core';
import { TagLambdaService } from "./tag-lambda.service";
import { TagS3Service } from "./tag-s3.service";
import { TagEc2Service } from "./tag-ec2.service";
import { TagDynamodbService } from "./tag-dynamodb.service";
import { Tag } from '../model/tag'
import { ITagger } from "./ITagger";
import { RES_TYPE } from '../model/res-types';


@Injectable()
export class TaggerService {
  

  constructor(
    private lambdaTagger:TagLambdaService,
    private s3Tagger:TagS3Service,
    private ec2Tagger: TagEc2Service,
    private dynamoDbTagger: TagDynamodbService) { }
  
  resType: RES_TYPE = RES_TYPE.Lambda

  setResourceType(e: RES_TYPE){
    this.resType = e;
  }

  getCurrentClient():ITagger{
    switch(this.resType) {
      case RES_TYPE.Lambda:{
        return this.lambdaTagger;
      }

      case RES_TYPE.S3:{
        return this.s3Tagger;
      }

      case RES_TYPE.EC2:{
        return this.ec2Tagger;
      }

      case RES_TYPE.DynamoDb:{
        return this.dynamoDbTagger;
      }

      case RES_TYPE.API_Gateway:{

        break;
      }
    }
  }

  getTags(resName:string){
    return this.getCurrentClient().getTags(resName);
  }

  putTags(resName:string, tags:Tag[]){
    return this.getCurrentClient().putTags(resName, tags)
  }

  deleteTags(resName:string, tags:Tag[]){
    return this.getCurrentClient().deleteTags(resName, tags)
  }

  translareNameToARN(resName:string){
    return this.getCurrentClient().translareNameToARN(resName)
  }

}
