import { UnderscoreStatic } from "underscore";

export class PropertiesApi {

  public OAUTH_1_SECRET: string;
  public USR_AUTH_TOKEN: string;
  public DEV_API_KEY: string;
  public TRELLO_TASK_BOARD_NAME:string;
  constructor(private _:UnderscoreStatic) {
    let apiKey:string|null = this.get("DEV_API_KEY");
    if(apiKey == null) { throw "Could not find DEV_API_KEY"; }
    this.DEV_API_KEY = apiKey;

    let token:string|null =  this.get("USR_AUTH_TOKEN");
    if(token == null) { throw "Could not find USR_AUTH_TOKEN"; }
    this.USR_AUTH_TOKEN = token;

    let secret:string|null = this.get("OAUTH_1_SECRET");
    if(secret == null) { throw "Could not find OAUTH_1_SECRET"; }
    this.OAUTH_1_SECRET = secret;

    let trelloBoard:string|null = this.get("TRELLO_TASK_BOARD_NAME");
    if(trelloBoard == null) { throw "Could not find TRELLO_TASK_BOARD_NAME"; }
    this.TRELLO_TASK_BOARD_NAME = trelloBoard;
  }

  public exists(propertyId:string):boolean {
    let keys:string[] = PropertiesService.getScriptProperties().getKeys();
    let exists:boolean = this._.contains( keys,propertyId);
    return exists;
  }

  public set (propertyId:string, value:string):void {
    PropertiesService.getScriptProperties().setProperty(propertyId, value);
  }
  public get (propertyId:string):string | null {
      return PropertiesService.getScriptProperties().getProperty(propertyId);
  }

  public getAsString (propertyId:string):string {
      var value:string|null = PropertiesService.getScriptProperties().getProperty(propertyId);
      if(value == null) { return ""; }
      return value;
  }
}

