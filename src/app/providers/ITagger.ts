import { Tag } from '../model/tag'
import { String } from 'aws-sdk/clients/rds';
export interface ITagger{
    getTags(resName:String)
    putTags(resName:String, tags:Tag[])
    deleteTags(resName:String, tags:Tag[])
    translareNameToARN(resName:String)
}