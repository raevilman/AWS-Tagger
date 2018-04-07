import { Injectable } from '@angular/core';

//Init AWS
var AWS = window.require('aws-sdk');
var credentials = new AWS.SharedIniFileCredentials({profile: 'default'});
AWS.config.credentials = credentials;
AWS.config.update({
  region: 'us-east-1',
});

var lambdaClient = new AWS.Lambda();
var s3Client = new AWS.S3();

@Injectable()
export class AwsClientsService {

  getS3Client(): any {
    return s3Client;
  }
  constructor() { }

  getLambdaClient(){return lambdaClient}

  
}
