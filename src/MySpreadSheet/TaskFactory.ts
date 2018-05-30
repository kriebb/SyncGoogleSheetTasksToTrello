import {MySpreadSheet as MyAppDomain} from "Domain";
import {IdGenerator} from "../Common/IdGenerator";
export namespace MySpreadSheet {
	export class TaskFactory {
		constructor(private idGen: IdGenerator) {}
		public createMany(templateTasks: MyAppDomain.TemplateTask[]): MyAppDomain.GeneratedTask[] {
			return new Array<MyAppDomain.GeneratedTask>();
		}
	}
}
