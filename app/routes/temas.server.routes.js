'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var temas = require('../../app/controllers/temas.server.controller');

	// Temas Routes
	app.route('/temas')
		.get(temas.list)
		.post(users.requiresLogin, temas.create);

	app.route('/temas/:temaId')
		.get(temas.read)
		.put(users.requiresLogin, temas.hasAuthorization, temas.update)
		.delete(users.requiresLogin, temas.hasAuthorization, temas.delete);

	// Finish by binding the Tema middleware
	app.param('temaId', temas.temaByID);
};
