'use strict';


const Wit = require('node-wit').Wit;
const messengerApi = require('./messengerApi');
const sessionStore = require('./sessionStore');
const WIT_TOKEN = 'WIT_TOKEN_HERE' || process.env.WIT_TOKEN;
const Q = require('q');





const firstEntityValue = (entities, entity) => {
	const val = entities && entities[entity] &&
		Array.isArray(entities[entity]) &&
		entities[entity].length > 0 &&
		entities[entity][0].value
	;
	if (!val) {
		return null;
	}
	return typeof val === 'object' ? val.value : val;
};


// Our bot actions
const actions = {
	say(sessionId, context, message, cb) {
		
		console.log('saying', message);
		const recipientId = sessionStore.sessions[sessionId].fbid;
		
		messengerApi.sendPlainMessage(recipientId, message)
		.catch((err) => {
			console.log('Oops! An error occurred while forwarding the response to', recipientId, ':', err );
		})
		.finally(() => {
			cb();
		});
		
	},
	
	merge(sessionId, context, entities, message, cb) {
		
		console.log('entities',entities);
		
		const intent = firstEntityValue(entities, 'intent');
		
		if (intent) {
			context.intent = intent;
		}
		
		cb(context);		
	},
	
	error(sessionId, context, error) {
		console.log(error.stack);
		console.log(error.message);
	},

	someFunc(sessionId, context, cb) {
		cb(context);
	}


};

// Setting up our bot
module.exports = new Wit(WIT_TOKEN, actions);