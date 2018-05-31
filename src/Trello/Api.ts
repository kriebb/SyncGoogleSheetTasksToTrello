import { UnderscoreStatic } from "underscore";
import { PropertiesApi } from "../Settings/PropertiesApi";
import { UriBuilder } from "../Common/UriBuilder";
import * as Mappers from "../Mappers/index";
import * as Trello from "./index";

export class Api {
	constructor(
		private propertiesApi: PropertiesApi,
		private trelloUriBuilder: UriBuilder,
		private _: UnderscoreStatic
	) {}

	public addOrUpdate(trelloCards: Trello.Card[]): Trello.Card[] {
		var postedTrelloCards: Trello.Card[] = new Array<Trello.Card>();
		trelloCards.forEach((trelloCard: Trello.Card) => {
			// pOST [/1/cards], Required permissions: write
			let payload: any = {
				name: trelloCard.TaskName, // (required) Valid Values: a string with a length from 1 to 16384
				desc: trelloCard.Description, // (optional)Valid Values: a string with a length from 0 to 16384
				pos: trelloCard.Position, // (optional) Default: bottom Valid Values: A position. top, bottom, or a positive number.
				due: trelloCard.DueDate, // (required) Valid Values: A date, or null
				idList: trelloCard.TaskListId, // (required)Valid Values: id of the list that the card should be added to
				labels: trelloCard.LabelsAsString,
				idMembers: trelloCard.MemberIdsAsString,
				idCardSource: trelloCard.CardSourceId,
				keepFromSource: trelloCard.CopyValuesFromSource
				// "labels": ,    //(optional)
				// "idMembers": , //(optional)Valid Values: A comma-separated list of objectIds, 24-character hex strings
				// "idCardSource": ,//(optional)Valid Values: The id of the card to copy into a new card.
				// "keepFromSource": ,//(optional)Default: all Valid Values: Properties of the card to copy over from the source.
			};
			// because payload is a JavaScript object, it will be interpreted as
			// an HTML form. (We do not need to specify contentType; it will
			// automatically default to either 'application/x-www-form-urlencoded'
			// or 'multipart/form-data')
			let url: string = this.trelloUriBuilder.buildUrl("cards");
			let options: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {
				method: "post",
				payload: payload
			};

			let response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(url, options);
			let content: string = response.getContentText();
			var card: Trello.Card | undefined = JSON.parse(content);
			if (card === undefined) {
				throw Error("The card that you've posted returned an error by parsing it");
			}
			postedTrelloCards.push(card);
		});
		return postedTrelloCards;
	}

	public getBoardByName(name: string): Trello.Board | null {
		let boardId: string | null = "";
		if (this.propertiesApi.exists("boardId")) {
			boardId = this.propertiesApi.get("boardId");
		} else {
			var boardItem: Trello.VM.BoardItem | null = this.searchBoardByName(name);
			if (boardItem == null) {
				return null;
			}

			this.propertiesApi.set("boardId", boardItem.id);
			boardId = boardItem.id;
		}
		if (boardId == null) {
			throw new Error("Could not find the boardId for name:" + name);
		}
		var board: Trello.Board | null = this.getBoardById(boardId);
		return board;
	}

	public getBoardById(boardId: string): Trello.Board | null {
		let url: string = this.trelloUriBuilder.buildUrl("boards/" + boardId);
		// https://api.trello.com/1/boards/id

		let response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(url);
		let content: string = response.getContentText();
		var board: Trello.Board | undefined = JSON.parse(content);
		if (board === undefined) {
			return null;
		}
		return board;
	}

	public searchBoardByName(name: string): Trello.VM.BoardItem | null {
		let uri: string = this.trelloUriBuilder.buildSearchUrl(name + "&board_fields=name&modelTypes=boards");
		let responseBoard: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(uri);

		let responseContent: string = responseBoard.getContentText();
		if (this._.isNull(responseContent)) {
			return null;
		}
		let responseContainer: any = JSON.parse(responseContent);
		if (this._.has(responseContainer, "boards")) {
			return responseContainer.boards[0];
		}
		return null;
	}

	public getListsByBoardId(boardId: string): Trello.ListOnBoard[] {
		let url: string = this.trelloUriBuilder.buildUrl("boards/" + boardId + "/lists");
		// https://api.trello.com/1/boards/id

		let response: GoogleAppsScript.URL_Fetch.HTTPResponse = UrlFetchApp.fetch(url);
		let content: string = response.getContentText();
		var lists: Trello.ListOnBoard[] | undefined = JSON.parse(content);
		if (lists === undefined) {
			throw new Error("Could not retrieve lists from boardid: " + boardId);
		}
		return lists;
	}
}
