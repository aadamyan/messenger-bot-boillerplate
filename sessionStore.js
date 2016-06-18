'use strict';

class SessionStore {
	constructor() {
		this.sessions = {};
	}

	findOrCreateSession(fbid) {
		let sessionId;

		// Let's see if we already have a session for the user fbid
		Object.keys(this.sessions).forEach(k => {
			if (this.sessions[k].fbid === fbid) {
				// Yep, got it!
				sessionId = k;
			}
		});

		if (!sessionId) {
			// No session found for user fbid, let's create a new one
			sessionId = new Date().toISOString();
			this.sessions[sessionId] = {fbid: fbid, context: {}};
		}
		return sessionId;
	}

}

module.exports = new SessionStore();