import { PropertiesApi } from "./PropertiesApi";
import { UriBuilder } from "./UriBuilder";
import { TrelloApi, Trello } from "./TrelloAPi";
import { UnderscoreStatic } from "underscore";
import { GSheetApi, GSheet, GSheetWithTasks } from "./Google";

declare var _: UnderscoreStatic;

export class EntryPoint {
 	public Start = () => {
		var underscoreService: UnderscoreStatic =  _;
		var propertiesApi: PropertiesApi = new PropertiesApi(underscoreService); // inject underscore
		var uriBuilder: UriBuilder = new UriBuilder(propertiesApi);
		var trelloApi: TrelloApi = new TrelloApi(propertiesApi, uriBuilder, underscoreService);
		var possibleTaskBoard: Trello.Board | null = trelloApi.getBoardByName(propertiesApi.TRELLO_TASK_BOARD_NAME);
		var googleSheetApi: GSheetApi = new GSheetApi(propertiesApi);

		if (possibleTaskBoard == null) {
			throw "could not retrieve taskboard:" + propertiesApi.TRELLO_TASK_BOARD_NAME;
		}

		var taskBoard:Trello.Board = possibleTaskBoard;
		var listsOfTaskBoard: Trello.ListOnBoard[] = trelloApi.getListsByBoardId(taskBoard.id);

		var possibleBackLog: Trello.ListOnBoard | undefined = listsOfTaskBoard.find(
			(value:Trello.ListOnBoard,index:number,array:Trello.ListOnBoard[]) => {

			return true;
		});
		if(possibleBackLog === undefined) {
			throw "Couldn't find the backlog. Define one";
			}

		var backlogListOnBoard:Trello.ListOnBoard = possibleBackLog;
		var settingsSheet: GSheet = googleSheetApi.getSheetByName(propertiesApi.SHEET_PROPERTIES_TASK_NAME);
		var tasksOnSheet: GSheetWithTasks[] = googleSheetApi.getTasksOnSheet(settingsSheet.SHEET_WITH_TASKS);

		tasksOnSheet.forEach(taskOnSheet => {
			var trelloCard:Trello.Card = new Trello.Card();
			trelloCard.TaskOnSheetId = taskOnSheet.Id;
			trelloCard.TaskBoardId = taskBoard.Id;
			trelloCard.TaskListId = backlogListOnBoard.Id;

			var updatedTrelloCard:Trello.Card = trelloApi.AddOrUpdate(trelloCard);

			taskOnSheet.TrelloCardId = updatedTrelloCard.TrelloCardId;

			googleSheetApi.AddOrUpdateTask(taskOnSheet);
		});

	}
}
