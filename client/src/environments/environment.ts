// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
	production: false,
	firebase: {
		apiKey: 'AIzaSyBTiizpyWeqHfXdFDQsd6IoMdNWYvkceS8',
		authDomain: 'amee-store.firebaseapp.com',
		databaseURL: 'https://amee-store.firebaseio.com',
		projectId: 'amee-store',
		storageBucket: 'amee-store.appspot.com',
		messagingSenderId: '457253723299'
	}
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
