import { UnderscoreStatic } from "underscore";
import { PropertiesApi } from "./Settings/PropertiesApi";
import { UriBuilder } from "./Common/UriBuilder";
import { Trello as TrelloService } from "./Trello/Api";
import { Trello as TrelloDomain } from "./Trello/Domain";
import { IdGenerator } from "./Common/IdGenerator";
import { MySpreadSheet as MyAppApi } from "./MySpreadSheet/Api";
import { MySpreadSheet as MyAppTask } from "./MySpreadSheet/TaskFactory";
import { MySpreadSheet as MyAppDomain } from "./MySpreadSheet/Domain";
import { Mappers } from "./Mappers/GeneratedTaskTrelloCardMapper";
declare var _: UnderscoreStatic;

export class EntryPoint {
	public Start = () => {
		var underscoreService: UnderscoreStatic = _;
		var propertiesApi: PropertiesApi = new PropertiesApi(underscoreService); // inject underscore
		var uriBuilder: UriBuilder = new UriBuilder(propertiesApi);
		var trelloApi: TrelloService.Api = new TrelloService.Api(propertiesApi, uriBuilder, underscoreService);
		var possibleTaskBoard: TrelloDomain.Board | null = trelloApi.getBoardByName(propertiesApi.TRELLO_TASK_BOARD_NAME);
		var googleSheetApi: MyAppApi.Api = new MyAppApi.Api(propertiesApi);
		var idGenerator: IdGenerator = new IdGenerator();
		var taskFactory: MyAppTask.TaskFactory = new MyAppTask.TaskFactory(idGenerator);
		var generatedTaskTrelloCardMapper: Mappers.GeneratedTaskTrelloCardMap = new Mappers.GeneratedTaskTrelloCardMap();

		if (possibleTaskBoard == null) {
			throw "could not retrieve taskboard:" + propertiesApi.TRELLO_TASK_BOARD_NAME;
		}

		var taskBoard: TrelloDomain.Board = possibleTaskBoard;
		var listsOfTaskBoard: TrelloDomain.ListOnBoard[] = trelloApi.getListsByBoardId(taskBoard.id);

		var possibleBackLog:
			| TrelloDomain.ListOnBoard
			| undefined = listsOfTaskBoard.find(
			(value: TrelloDomain.ListOnBoard, index: number, array: TrelloDomain.ListOnBoard[]) => {
				return true;
			}
		);
		if (possibleBackLog === undefined) {
			throw "Couldn't find the backlog. Define one";
		}

		var backlogListOnBoard: TrelloDomain.ListOnBoard = possibleBackLog;
		var templateTasksOnSheet: MyAppDomain.TemplateTask[] = googleSheetApi.getTemplateTasksOnSheet(
			propertiesApi.SHEET_WITH_TEMPLATE_TASKS
		);

		var tasksOnSheet: MyAppDomain.GeneratedTask[] = taskFactory.createMany(templateTasksOnSheet);
		googleSheetApi.addOrUpdate(propertiesApi.SHEET_WITH_TEMPLATE_TASKS, tasksOnSheet);

		var trelloCards:TrelloDomain.Card[] = generatedTaskTrelloCardMapper.map(tasksOnSheet);

		trelloApi.addOrUpdate(trelloCards);
	}
}
