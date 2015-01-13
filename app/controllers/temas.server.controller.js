'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Tema = mongoose.model('Tema'),
	_ = require('lodash');

/**
 * Create a Tema
 */
exports.create = function(req, res) {
	var tema = new Tema(req.body);
	tema.user = req.user;

	tema.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tema);
		}
	});
};

/**
 * Show the current Tema
 */
exports.read = function(req, res) {
	res.jsonp(req.tema);
};

/**
 * Update a Tema
 */
exports.update = function(req, res) {
	var tema = req.tema ;

	tema = _.extend(tema , req.body);

	tema.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tema);
		}
	});
};

/**
 * Delete an Tema
 */
exports.delete = function(req, res) {
	var tema = req.tema ;

	tema.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(tema);
		}
	});
};

/**
 * List of Temas
 */
exports.list = function(req, res) { 
	Tema.find().sort('-created').populate('user', 'displayName').exec(function(err, temas) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(temas);
		}
	});
};

/**
 * Tema middleware
 */
exports.temaByID = function(req, res, next, id) { 
	Tema.findById(id).populate('user', 'displayName').exec(function(err, tema) {
		if (err) return next(err);
		if (! tema) return next(new Error('Failed to load Tema ' + id));
		req.tema = tema ;
		next();
	});
};

/**
 * Tema authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.tema.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
