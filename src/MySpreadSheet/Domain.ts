	/*
 * Dagelijks (MA-ZO)	1/1-*
Wekelijks (ZA-ZO)	1/7,14,21,28
Twee wekelijks (ZA-ZO)	1/1,15
Maandelijks	1/1
TweeMaandelijks	2/1
 */

	export class TaskGenerationSetting {
		constructor(private keyValue: string[][]) {}
	}
	export class TemplateTask {
		TaskName: string;
		Description: string;
		DueDate: string;
		TrelloCardPosition: number;
		Id: string;
	}

    export class GeneratedTask {
        Id: any;
        TaskBoardId: any;
        BacklogListOnBoard: any;
        TaskName: any;
        Description: any;
        DueDate: any;
        TrelloCardPosition: any;
    }
