'use strict';

angular.module('meFit')
	.constant('config', {
		site: 'https://accounts.google.com',
		authorize_path: '/o/oauth2/auth',
		client_id: 'CLIENT_ID',
		redirect_uri: 'http://localhost:3000',
		scope: 'https://www.googleapis.com/auth/fitness.activity.read'
	});
