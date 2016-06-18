class MessengerHelper {
	createTemplateResult(title, subtitle, image, ) {
		const elements = _.map(businesses, function(user) {
			return {
				title: user.name,
				item_url: config.websiteUrl + '/user-profile/' + user._id, 
				subtitle: user.business ? 'organization' : (user.publicProfile ? 'public figure' : 'user'),
				image_url: user.avatar,
				buttons: [{
					type: 'web_url',
					url: config.websiteUrl + '/user-profile/' + user._id, 
					title: 'Visit profile'
				}, {
					type: 'postback',
					title: 'Give feedback',
					payload: 'feedback to http://truthly.me/' + user._id,
				}]
			};
		});

		return {
			attachment: {
				type: "template",
				payload: {
					template_type: "generic",
					elements: elements
				}
			}
		};
	}
}