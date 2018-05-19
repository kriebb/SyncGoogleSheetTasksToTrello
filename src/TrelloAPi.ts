import { PropertiesApi } from "./PropertiesApi";
import { UriBuilder } from "./UriBuilder";
import { UnderscoreStatic } from "underscore";

export class TrelloApi {
	constructor(private propertiesApi: PropertiesApi, private trelloUriBuilder: UriBuilder,private _:UnderscoreStatic) {}

	// https://sites.google.com/site/scriptsexamples/custom-methods/underscoregs

	public getBoardByName(name: string): Domain.Board | null {
		let boardId: string | null = "";
		if (this.propertiesApi.exists("boardId")) {
			boardId = this.propertiesApi.get("boardId");
		} else {
			var boardItem:VM.BoardItem|null = this.searchBoardByName(name);
			if (boardItem == null) { return null; }

			this.propertiesApi.set("boardId", boardItem.id);
			boardId = boardItem.id;
		}

    var board:Domain.Board|null = this.getBoardById(boardId);
    return board;
  }

  public getBoardById(boardId: string | null): Domain.Board|null {
		return null;
	}

	public searchBoardByName(name: string): VM.BoardItem|null {
		let uri:string = this.trelloUriBuilder.buildSearchUrl(name + "&board_fields=name&modelTypes=boards");
		let responseBoard :GoogleAppsScript.URL_Fetch.HTTPResponse= UrlFetchApp.fetch(uri);

		let responseContent:string = responseBoard.getContentText();
		if (this._.isNull(responseContent)) { return null; }
		let responseContainer:any = JSON.parse(responseContent);
		if (this._.has(responseContainer, "boards")) { return responseContainer.boards[0]; }
		return null;
	}

	public getListsByBoardId(boardId:string): Domain.ListOnBoard[] {

    return new Array<Domain.ListOnBoard>();

  }

  public createTrelloCard():void {

    // pOST [/1/cards], Required permissions: write
    var payload:any = {"name":"apiUploadedCard", // (required) Valid Values: a string with a length from 1 to 16384
                   "desc":"description", // (optional)Valid Values: a string with a length from 0 to 16384
                   "pos":"top", // (optional) Default: bottom Valid Values: A position. top, bottom, or a positive number.
                   "due": "", // (required) Valid Values: A date, or null
                   "idList":"52017776e823fa1d51000819", // (required)Valid Values: id of the list that the card should be added to
                   // "labels": ,//(optional)
                   // "idMembers": ,//(optional)Valid Values: A comma-separated list of objectIds, 24-character hex strings
                   // "idCardSource": ,//(optional)Valid Values: The id of the card to copy into a new card.
                   // "keepFromSource": ,//(optional)Default: all Valid Values: Properties of the card to copy over from the source.
                  };
    // because payload is a JavaScript object, it will be interpreted as
    // an HTML form. (We do not need to specify contentType; it will
    // automatically default to either 'application/x-www-form-urlencoded'
    // or 'multipart/form-data')
    let url:string = this.trelloUriBuilder.buildUrl("cards");
    let options :GoogleAppsScript.URL_Fetch.URLFetchRequestOptions = {"method" : "post",
                   "payload" : payload};

    UrlFetchApp.fetch(url, options);
  }
}

export module VM {
  export class BoardItem {
    id: string;
  }

}

export module Domain {
  export class Board {
    id:string;
  }
  export class ListOnBoard {
id:string;
}
}


