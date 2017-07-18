'use strict';

const functions = require('firebase-functions');
const ApiAiApp = require('actions-on-google').ApiAiApp;
const book = {};
var userAmount = 0;

exports.addressBook = functions.https.onRequest((req, res) => {
	const app = new ApiAiApp({request: req, response: res});
	
	const ADD_INTENT = "input.add";
	const REMOVE_INTENT = "input.remove";
	const EDIT_INTENT = "input.edit";
	const LIST_INTENT = "input.list";
	const COUNT_INTENT = "input.count";
	const SEARCH_INTENT = "input.search";
	
	const EDIT_PHONE_INTENT = "input.edit.phone";
	const EDIT_PHONE_RESPONSE = "input.edit.phone.response";
	const EDIT_ADDRESS_INTENT = "input.edit.address";
	const EDIT_ADDRESS_RESPONSE = "input.edit.address.response";
	const EDIT_EMAIL_INTENT = "input.edit.email";
	const EDIT_EMAIL_RESPONSE = "input.edit.email.response";
	
	const NAME_ARGUMENT = "name";
	const SURNAME_ARGUMENT = "last-name";
	const ADDRESS_ARGUMENT = "address";
	const PHONE_ARGUMENT = "phone-number";
	const EMAIL_ARGUMENT = "email";
	
	function responseHandler(app){
		let intent = app.getIntent();
		let name = app.getArgument(NAME_ARGUMENT);
		let lastName = app.getArgument(SURNAME_ARGUMENT);
		let key = name + " " + lastName;
		switch(intent){
			case ADD_INTENT:
				let address = app.getArgument(ADDRESS_ARGUMENT);
				let phone = app.getArgument(PHONE_ARGUMENT);
				let email = app.getArgument(EMAIL_ARGUMENT);
				if(book[key]){
					app.tell("Entry for " + key + " already exists");
				}else{
					book[key] = {
						name : key,
						address : address,
						phone : phone,
						email : email
					};
					userAmount += 1;
					app.tell("Entry successfully added");
				}
				break;
			case REMOVE_INTENT:
				if(book[key]){
					delete book[key];
					userAmount -= 1;
					app.tell("Successfully removed entry");
				}else{
					app.tell("There is no entry for " + key + " in address book");
				}
				break;
			case EDIT_INTENT:
				if(book[key]){
					let e = book[key];
					app.ask("What attribute of the entry do you want to edit?");
				}else{
					app.tell("There is no entry for " + key + " in address book");
				}
				break;
			case EDIT_PHONE_INTENT:
				let e = book[key];
				app.ask("Current Phone Number: " + e.phone + ". Please tell me the new phone number");
				break;
			case EDIT_PHONE_RESPONSE:
				let n = app.getArgument("number");
				book[key].phone = n;
				app.tell(key + "'s phone number edited successfully");
				break;
			case EDIT_ADDRESS_INTENT:
				app.ask("Current Address: " + book[key].address + ". Please tell me the new address");
				break;
			case EDIT_ADDRESS_RESPONSE:
				let addr = app.getArgument("address");
				book[key].address = addr;
				app.tell(key + "'s address edited successfully");
				break;
			case EDIT_EMAIL_INTENT:
				app.ask("Current Email: " + book[key].email + ". Please tell me the new email");
				break;
			case EDIT_EMAIL_RESPONSE:
				let em = app.getArgument("email");
				book[key].email = em;
				app.tell(key + "'s email edited successfully");
				break;
			case LIST_INTENT:
				let t = ""
				for(var k in book){
					t += k + ", ";
				}
				app.tell(t);
				break;
			case COUNT_INTENT:
				app.tell("There are " + userAmount + " entries");
				break;
			case SEARCH_INTENT:
				if(book[key]){
					let e = book[key];
					app.tell("Name: " + key + ", Address: " + e.address + ", Phone: " + e.phone + ", Email: " + e.email);
				}else{
					app.tell("There is no entry for " + key + " in address book");
				}
		}
	}
	
	app.handleRequest(responseHandler);
});
