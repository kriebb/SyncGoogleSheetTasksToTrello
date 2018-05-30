import { Trello as TrelloDomain } from "../Trello/Domain";
import { MySpreadSheet as MyAppDomain } from "../MySpreadSheet/Domain";

export module Mappers {

    export class GeneratedTaskTrelloCardMap {

		public map(tasksOnSheet: MyAppDomain.GeneratedTask[]): TrelloDomain.Card[] {
			var cards: TrelloDomain.Card[] = new Array<TrelloDomain.Card>();
			tasksOnSheet.forEach((taskOnSheet: MyAppDomain.GeneratedTask) => {
				var trelloCard: TrelloDomain.Card = new TrelloDomain.Card();
				trelloCard.TaskOnSheetId = taskOnSheet.Id;
				trelloCard.TaskBoardId = taskOnSheet.TaskBoardId;
				trelloCard.TaskListId = taskOnSheet.BacklogListOnBoard.Id;
				trelloCard.TaskName = taskOnSheet.TaskName;
				trelloCard.Description = taskOnSheet.Description;
				trelloCard.DueDate = taskOnSheet.DueDate;
				trelloCard.Position = taskOnSheet.TrelloCardPosition;

				cards.push(trelloCard);
			});
			return cards;
		}
	}
}