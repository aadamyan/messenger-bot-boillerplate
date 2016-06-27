'use strict';

const request = require('request-promise');
const FB_PAGE_TOKEN = process.env.FB_PAGE_TOKEN || 'ENTER FACEBOOK PAGE ACCESS TOKEN HERE';

class MessengerAPI {
	constructor() {
		this.api = request.defaults({
			uri: 'https://graph.facebook.com/v2.6/me/messages',
			method: 'POST',
			json: true,
			qs: { access_token: FB_PAGE_TOKEN },
			headers: {'Content-Type': 'application/json'},
		});
	}
	
	sendTemplateMessage(recipientId, data) {
		const opts = {
			form: {
				recipient: {
					id: recipientId,
				},
				message: data,
			}
		};
		return this.api(opts);
	}

	sendPlainMessage(recipientId, msg) {
		return this.sendTemplateMessage(recipientId, {text: msg});
	}
}


module.exports = new MessengerAPI();