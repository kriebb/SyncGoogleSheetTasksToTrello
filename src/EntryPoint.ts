import { UnderscoreStatic } from "underscore";
import { PropertiesApi } from "./Settings/PropertiesApi";
import { UriBuilder } from "./Common/UriBuilder";
import * as Trello from "./Trello/index";
import * as MyApp from "./MySpreadSheet/index";
import { IdGenerator } from "./Common/IdGenerator";
import * as Mappers from "./Mappers/index";
declare var _: UnderscoreStatic;

export class EntryPoint {
	public Start(): void {
		var underscoreService: UnderscoreStatic = _;
		var propertiesApi: PropertiesApi = new PropertiesApi(underscoreService); // inject underscore
		var uriBuilder: UriBuilder = new UriBuilder(propertiesApi);
		var trelloApi: Trello.Api = new Trello.Api(propertiesApi, uriBuilder, underscoreService);
		var possibleTaskBoard: Trello.Board | null = trelloApi.getBoardByName(
			propertiesApi.TRELLO_TASK_BOARD_NAME
		);
		var googleSheetApi: MyApp.Api = new MyApp.Api(propertiesApi);
		var idGenerator: IdGenerator = new IdGenerator();
		var taskFactory: MyApp.TaskFactory = new MyApp.TaskFactory(idGenerator);
		var generatedTaskTrelloCardMapper: Mappers.GeneratedTaskTrelloCardMap = new Mappers.GeneratedTaskTrelloCardMap();

		if (possibleTaskBoard == null) {
			throw "could not retrieve taskboard:" + propertiesApi.TRELLO_TASK_BOARD_NAME;
		}

		var taskBoard: Trello.Board = possibleTaskBoard;
		var listsOfTaskBoard: Trello.ListOnBoard[] = trelloApi.getListsByBoardId(taskBoard.id);

		var possibleBackLog:
			| Trello.ListOnBoard
			| undefined = listsOfTaskBoard.find((value: Trello.ListOnBoard) => {
			if (value.Name === propertiesApi.SHEET_WITH_TEMPLATE_TASKS_NAME) {
				return true;
			}
			return false;
		});
		if (possibleBackLog === undefined) {
			throw "Couldn't find the backlog. Define one";
		}

		var backlogListOnBoard: Trello.ListOnBoard = possibleBackLog;
		var templateTasksOnSheet: MyApp.TemplateTask[] = googleSheetApi.getTemplateTasksOnSheet(
			propertiesApi.SHEET_WITH_TEMPLATE_TASKS_NAME
		);

		var tasksOnSheet: MyApp.GeneratedTask[] = taskFactory.createMany(templateTasksOnSheet);
		googleSheetApi.addOrUpdate(propertiesApi.SHEET_WITH_TEMPLATE_TASKS_NAME, tasksOnSheet);

		var trelloCards: Trello.Card[] = generatedTaskTrelloCardMapper.map(tasksOnSheet);

		trelloApi.addOrUpdate(trelloCards);
	}
}
