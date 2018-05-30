import { UnderscoreStatic } from "underscore";

export class PropertiesApi {


  public OAUTH_1_SECRET: string;
  public USR_AUTH_TOKEN: string;
  public DEV_API_KEY: string;

	public GENERATED_TASK_NOTATION_A1:string = "A2:H1000";
	public SETTING_TASK_REPITITION_NOTATION_A1: string = "A2:B6";
	public GTASK_TEMPLATE_COLNR_ID: number= 7;
	public GTASK_TEMPLATE_COLNR_DESCRIPTION: number = 5;
	public GTASK_TEMPLATE_COLNR_DUEDATE: number = 4;
	public GTASK_TEMPLATE_COLNR_TASKNAME: number = 2;
	public TEMPLATE_TASK_NOTATION_A1: string ="A4:H1000";

	public SETTINGS_SHEET: string = "SettingsSheet";
  public SHEET_WITH_TASKS: string = "GegenereerdeTaken";

  public SHEET_WITH_TEMPLATE_TASKS:string = "TemplateTaken";

  public TRELLO_TASK_BOARD_NAME:string = "Taken Huishouden";
  public TRELLO_BACKLOG_LIST:string = "BackLog";

  public TRELLO_TASKLIST_KRISTOF:string="Kristof";
  public TRELLO_TASKLIST_SAARTJE:string="Saartje";

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

