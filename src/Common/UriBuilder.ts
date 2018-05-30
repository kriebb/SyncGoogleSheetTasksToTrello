import { PropertiesApi } from "../Settings/PropertiesApi";
	export class UriBuilder {
		constructor(private propertiesApi: PropertiesApi) {}

		private buildBaseUrl(object: string, combineKey: string): string {
			let uri: string =
				"https://api.trello.com/1/" +
				object +
				combineKey +
				"key=" +
				this.propertiesApi.DEV_API_KEY +
				"&token=" +
				this.propertiesApi.USR_AUTH_TOKEN;
			return uri;
		}
		public buildUrl(object: string): string {
			return this.buildBaseUrl(object, "?");
		}
		public buildSearchUrl(object: string): string {
			return this.buildBaseUrl("search?query=" + object, "&");
		}
	}

