'use strict';

(function() {
	// Temas Controller Spec
	describe('Temas Controller Tests', function() {
		// Initialize global variables
		var TemasController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Temas controller.
			TemasController = $controller('TemasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Tema object fetched from XHR', inject(function(Temas) {
			// Create sample Tema using the Temas service
			var sampleTema = new Temas({
				name: 'New Tema'
			});

			// Create a sample Temas array that includes the new Tema
			var sampleTemas = [sampleTema];

			// Set GET response
			$httpBackend.expectGET('temas').respond(sampleTemas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.temas).toEqualData(sampleTemas);
		}));

		it('$scope.findOne() should create an array with one Tema object fetched from XHR using a temaId URL parameter', inject(function(Temas) {
			// Define a sample Tema object
			var sampleTema = new Temas({
				name: 'New Tema'
			});

			// Set the URL parameter
			$stateParams.temaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/temas\/([0-9a-fA-F]{24})$/).respond(sampleTema);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.tema).toEqualData(sampleTema);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Temas) {
			// Create a sample Tema object
			var sampleTemaPostData = new Temas({
				name: 'New Tema'
			});

			// Create a sample Tema response
			var sampleTemaResponse = new Temas({
				_id: '525cf20451979dea2c000001',
				name: 'New Tema'
			});

			// Fixture mock form input values
			scope.name = 'New Tema';

			// Set POST response
			$httpBackend.expectPOST('temas', sampleTemaPostData).respond(sampleTemaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Tema was created
			expect($location.path()).toBe('/temas/' + sampleTemaResponse._id);
		}));

		it('$scope.update() should update a valid Tema', inject(function(Temas) {
			// Define a sample Tema put data
			var sampleTemaPutData = new Temas({
				_id: '525cf20451979dea2c000001',
				name: 'New Tema'
			});

			// Mock Tema in scope
			scope.tema = sampleTemaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/temas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/temas/' + sampleTemaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid temaId and remove the Tema from the scope', inject(function(Temas) {
			// Create new Tema object
			var sampleTema = new Temas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Temas array and include the Tema
			scope.temas = [sampleTema];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/temas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTema);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.temas.length).toBe(0);
		}));
	});
}());