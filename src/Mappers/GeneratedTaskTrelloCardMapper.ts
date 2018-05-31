import * as Trello from "../Trello/index";
import * as MyApp from "../MySpreadSheet/index";

export class GeneratedTaskTrelloCardMap {
	public map(tasksOnSheet: MyApp.GeneratedTask[]): Trello.Card[] {
		var cards: Trello.Card[] = new Array<Trello.Card>();
		tasksOnSheet.forEach((taskOnSheet: MyApp.GeneratedTask) => {
			var trelloCard: Trello.Card = new Trello.Card();
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
