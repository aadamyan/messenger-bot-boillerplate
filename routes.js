'use strict';

const Q = require('q');
const _ = require('lodash');

const messengerApi = require('./messengerApi');
const sessionStore = require('./sessionStore');
const wit = require('./wit');

const FB_VERIFY_TOKEN = process.env.FB_VERIFY_TOKEN || 'ENTER FB VERIFY TOKEN HERE';
const FB_PAGE_ID = process.env.FB_PAGE_ID || 'ENTER FB PAGE ID HERE';


exports.get = function(req, res, next) {
	if (req.query['hub.mode'] === 'subscribe' && req.query['hub.verify_token'] === FB_VERIFY_TOKEN) {
		res.send(req.query['hub.challenge']);
	} else {
		res.sendStatus(400);
	}
}


exports.receive = function(req, res, next) {
	res.status(200).end();
	
	const messages = extractMessagingObjects(req.body);
	if (!messages.length) {
		return;
	}

	var processPromises = _.map(messages, (messaging) => {
		return processMessage(messaging);
	});

	Q.all(processPromises)
	.then(function(){
		console.log('all messages processed');
	})
	.catch(function(err) {
		console.error('error handling messages', err);
		console.error(err.stack);
	});
}


function processMessage(messaging) {
	
	const sender = messaging.sender.id;
	const sessionId = sessionStore.findOrCreateSession(sender);
	
	const atts = messaging.message && messaging.message.attachments;
	if (atts) {
		return handleAttachment(sender, sessionId, sessionStore.sessions[sessionId].context, atts);
	} 

	const msg = messaging.message && messaging.message.text;
	if (msg) {
		return handleTextMessage(sessionId, sessionStore.sessions[sessionId].context, msg);
	} 

	const payload = messaging.postback && messaging.postback.payload;
	if (payload) {
		return handlePayload(sessionId, sessionStore.sessions[sessionId].context, payload);
	}
}

function handleTextMessage (sessionId, context, msg) {
	var deferred = Q.defer();
	wit.runActions(sessionId, msg, context, (error, context) => {
		if (error) {
			deferred.reject(error);
			console.log('Oops! Got an error from Wit:', error);
			return;
		} 
		
		console.log('Waiting for futher messages.');

		if (context['done']) {
			delete sessionStore.sessions[sessionId];
		} else {
			sessionStore.sessions[sessionId].context = context;
		}           

		deferred.resolve();
	});

	return deferred.promise;
}

function handlePayload(sessionId, context, payload) {
	var deferred = Q.defer();
	wit.runActions(sessionId, payload, context, (error, context) => {
		if (error) {
			deferred.reject(error);
			console.log('Oops! Got an error from Wit:', error);
			return;
		} 
		
		console.log('Waiting for futher messages.');
		sessionStore.sessions[sessionId].context = context;
		deferred.resolve();
	});
	return deferred.promise;
}

function handleAttachment(sender, sessionId, context, atts) {	
	return messengerApi.sendPlainMessage(sender,'Sorry I can only process text messages for now.');
}


function extractMessagingObjects(body) {
	var messages = [];

	for (var i = 0; i < body.entry.length; i++) {
		var eventEntry = body.entry[i];
		
		if (eventEntry.id.toString() === FB_PAGE_ID){
			var recievedMessages = _.filter(eventEntry.messaging, function(msg) {
				console.log(msg.postback);
				return !!(msg.message || msg.postback);
			})
			messages = messages.concat(recievedMessages);
		}
	}

	return messages;
}



