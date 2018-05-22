import { PropertiesApi } from "./PropertiesApi";
import { UriBuilder } from "./UriBuilder";
import { TrelloApi, Domain } from "./TrelloAPi";
import { UnderscoreStatic } from "underscore";
declare var _: UnderscoreStatic;

export class EntryPoint {
 	public Start = () => {
		var underscoreService: UnderscoreStatic =  _;
		var propertiesApi: PropertiesApi = new PropertiesApi(underscoreService); // inject underscore
		var uriBuilder: UriBuilder = new UriBuilder(propertiesApi);
		var trelloApi: TrelloApi = new TrelloApi(propertiesApi, uriBuilder, underscoreService);
		var taskBoard: Domain.Board | null = trelloApi.getBoardByName(propertiesApi.TRELLO_TASK_BOARD_NAME);
		if (taskBoard == null) {
			throw "could not retrieve taskboard:" + propertiesApi.TRELLO_TASK_BOARD_NAME;
		}
		var listsOfTaskBoard: Domain.ListOnBoard[] = trelloApi.getListsByBoardId(taskBoard.id);
	}
}
