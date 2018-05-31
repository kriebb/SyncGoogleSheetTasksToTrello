import * as MyApp from "index";
import { IdGenerator } from "../Common/IdGenerator";
export class TaskFactory {
	constructor(private idGen: IdGenerator) {}
	public createMany(templateTasks: MyApp.TemplateTask[]): MyApp.GeneratedTask[] {
		return new Array<MyApp.GeneratedTask>();
	}
}
