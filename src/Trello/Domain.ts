export module Trello {
    export namespace VM {
      export class BoardItem {
        id: string;
      }
    }
    export class Card {
          Description: any;
          Position: any;
          DueDate: any;
          LabelsAsString: any;
          MemberIdsAsString: any;
          CardSourceId: any;
          CopyValuesFromSource: any;
          TaskName: any;
          TrelloCardId: any;
          TaskOnSheetId: any;
          TaskBoardId: any;
          TaskListId: any;
      }
      export  class Board {
          Id: any;
          id: string;
      }
      export class ListOnBoard {
          Id: any;
          id: string;
      }
  }