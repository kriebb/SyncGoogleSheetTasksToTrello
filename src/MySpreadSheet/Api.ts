import { MySpreadSheet as App } from "./Domain";
import { PropertiesApi } from "../Settings/PropertiesApi";
export namespace MySpreadSheet {

		export class Api {
			public addOrUpdate(taskSheetName: string, tasksOnSheet: App.GeneratedTask[]): void {
				var activeSpreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = SpreadsheetApp.getActiveSpreadsheet();
				if (activeSpreadSheet == null) {
					throw Error("Could not fetch the ActiveSpreadSheet");
				}
				var sheet: GoogleAppsScript.Spreadsheet.Sheet = activeSpreadSheet.getSheetByName(taskSheetName);

				var tasks: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
					this.propertiesApi.GENERATED_TASK_NOTATION_A1
				);
			}
			public getTaskGenerations(sheetName: string): App.TaskGenerationSetting {
				var activeSpreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = SpreadsheetApp.getActiveSpreadsheet();
				if (activeSpreadSheet == null) {
					throw Error("Could not fetch the ActiveSpreadSheet");
				}
				var sheet: GoogleAppsScript.Spreadsheet.Sheet = activeSpreadSheet.getSheetByName(sheetName);

				var range: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
					this.propertiesApi.SETTING_TASK_REPITITION_NOTATION_A1
				);
				var generationSetting: App.TaskGenerationSetting = new App.TaskGenerationSetting(range.getDisplayValues());

				return generationSetting;
			}
			constructor(private propertiesApi: PropertiesApi) {}

			public getTemplateTasksOnSheet(sheetName: string): App.TemplateTask[] {
				var activeSpreadSheet: GoogleAppsScript.Spreadsheet.Spreadsheet | null = SpreadsheetApp.getActiveSpreadsheet();
				if (activeSpreadSheet == null) {
					throw Error("Could not fetch the ActiveSpreadSheet");
				}
				var sheet: GoogleAppsScript.Spreadsheet.Sheet = activeSpreadSheet.getSheetByName(sheetName);

				var range: GoogleAppsScript.Spreadsheet.Range = sheet.getRange(
					this.propertiesApi.TEMPLATE_TASK_NOTATION_A1
				);

				var gTasks: App.TemplateTask[] = new Array<App.TemplateTask>();
				var displayValues: string[][] = range.getDisplayValues();
				displayValues.forEach((row: string[], index: number, displayValues) => {
					var gTask: App.TemplateTask = new App.TemplateTask();
					gTask.Id = row[this.propertiesApi.GTASK_TEMPLATE_COLNR_ID];
					gTask.Description = row[this.propertiesApi.GTASK_TEMPLATE_COLNR_DESCRIPTION];
					gTask.DueDate = row[this.propertiesApi.GTASK_TEMPLATE_COLNR_DUEDATE];
					gTask.TrelloCardPosition = index;
					gTask.TaskName = row[this.propertiesApi.GTASK_TEMPLATE_COLNR_TASKNAME];

					gTasks.push(gTask);
				});
				return gTasks;
			}
		}
	}

