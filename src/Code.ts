import { PropertiesApi } from "./PropertiesApi";
import { UnderscoreStatic } from "underscore";
import { TrelloApi, Domain } from "./TrelloAPi";
import { UriBuilder } from "./UriBuilder";
declare var _: _.UnderscoreStatic;

export class EntryPoint {
  constructor() {
    var underscoreService :UnderscoreStatic = _;
    var propertiesApi:PropertiesApi = new PropertiesApi(underscoreService); // inject underscore
    var uriBuilder:UriBuilder = new UriBuilder(propertiesApi);
    var trelloApi:TrelloApi = new TrelloApi(propertiesApi,uriBuilder,underscoreService);
    var taskBoard:Domain.Board|null = trelloApi.getBoardByName(propertiesApi.TRELLO_TASK_BOARD_NAME);
    if(taskBoard == null) { throw "could not retrieve taskboard:" + propertiesApi.TRELLO_TASK_BOARD_NAME; }
    var listsOfTaskBoard:Domain.ListOnBoard[] = trelloApi.getListsByBoardId(taskBoard.id);

  }
}



