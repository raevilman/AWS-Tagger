import { Injectable } from '@angular/core';
import { ITagger } from './ITagger';
import { Tag } from '../model/tag';

@Injectable()
export class TagApiGatewayService implements ITagger {

  getTags(resName: string) {
    throw new Error("Method not implemented.");
  }
  putTags(resName: string, tags: Tag[]) {
    throw new Error("Method not implemented.");
  }
  deleteTags(resName: string, tags: Tag[]) {
    throw new Error("Method not implemented.");
  }
  translareNameToARN(resName: string) {
    throw new Error("Method not implemented.");
  }
  constructor() { }

}
