'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Tema = mongoose.model('Tema'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, tema;

/**
 * Tema routes tests
 */
describe('Tema CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Tema
		user.save(function() {
			tema = {
				name: 'Tema Name'
			};

			done();
		});
	});

	it('should be able to save Tema instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tema
				agent.post('/temas')
					.send(tema)
					.expect(200)
					.end(function(temaSaveErr, temaSaveRes) {
						// Handle Tema save error
						if (temaSaveErr) done(temaSaveErr);

						// Get a list of Temas
						agent.get('/temas')
							.end(function(temasGetErr, temasGetRes) {
								// Handle Tema save error
								if (temasGetErr) done(temasGetErr);

								// Get Temas list
								var temas = temasGetRes.body;

								// Set assertions
								(temas[0].user._id).should.equal(userId);
								(temas[0].name).should.match('Tema Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Tema instance if not logged in', function(done) {
		agent.post('/temas')
			.send(tema)
			.expect(401)
			.end(function(temaSaveErr, temaSaveRes) {
				// Call the assertion callback
				done(temaSaveErr);
			});
	});

	it('should not be able to save Tema instance if no name is provided', function(done) {
		// Invalidate name field
		tema.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tema
				agent.post('/temas')
					.send(tema)
					.expect(400)
					.end(function(temaSaveErr, temaSaveRes) {
						// Set message assertion
						(temaSaveRes.body.message).should.match('Please fill Tema name');
						
						// Handle Tema save error
						done(temaSaveErr);
					});
			});
	});

	it('should be able to update Tema instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tema
				agent.post('/temas')
					.send(tema)
					.expect(200)
					.end(function(temaSaveErr, temaSaveRes) {
						// Handle Tema save error
						if (temaSaveErr) done(temaSaveErr);

						// Update Tema name
						tema.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Tema
						agent.put('/temas/' + temaSaveRes.body._id)
							.send(tema)
							.expect(200)
							.end(function(temaUpdateErr, temaUpdateRes) {
								// Handle Tema update error
								if (temaUpdateErr) done(temaUpdateErr);

								// Set assertions
								(temaUpdateRes.body._id).should.equal(temaSaveRes.body._id);
								(temaUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Temas if not signed in', function(done) {
		// Create new Tema model instance
		var temaObj = new Tema(tema);

		// Save the Tema
		temaObj.save(function() {
			// Request Temas
			request(app).get('/temas')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Tema if not signed in', function(done) {
		// Create new Tema model instance
		var temaObj = new Tema(tema);

		// Save the Tema
		temaObj.save(function() {
			request(app).get('/temas/' + temaObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', tema.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Tema instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Tema
				agent.post('/temas')
					.send(tema)
					.expect(200)
					.end(function(temaSaveErr, temaSaveRes) {
						// Handle Tema save error
						if (temaSaveErr) done(temaSaveErr);

						// Delete existing Tema
						agent.delete('/temas/' + temaSaveRes.body._id)
							.send(tema)
							.expect(200)
							.end(function(temaDeleteErr, temaDeleteRes) {
								// Handle Tema error error
								if (temaDeleteErr) done(temaDeleteErr);

								// Set assertions
								(temaDeleteRes.body._id).should.equal(temaSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Tema instance if not signed in', function(done) {
		// Set Tema user 
		tema.user = user;

		// Create new Tema model instance
		var temaObj = new Tema(tema);

		// Save the Tema
		temaObj.save(function() {
			// Try deleting Tema
			request(app).delete('/temas/' + temaObj._id)
			.expect(401)
			.end(function(temaDeleteErr, temaDeleteRes) {
				// Set message assertion
				(temaDeleteRes.body.message).should.match('User is not logged in');

				// Handle Tema error error
				done(temaDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Tema.remove().exec();
		done();
	});
});