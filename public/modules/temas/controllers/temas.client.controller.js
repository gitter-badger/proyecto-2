'use strict';

// Temas controller
angular.module('temas').controller('TemasController', ['$scope', '$stateParams', '$location', 'Authentication', 'Temas',
	function($scope, $stateParams, $location, Authentication, Temas) {
		$scope.authentication = Authentication;

		// Create new Tema
		$scope.create = function() {
			// Create new Tema object
			var tema = new Temas ({
				name: this.name
			});

			// Redirect after save
			tema.$save(function(response) {
				$location.path('temas/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Tema
		$scope.remove = function(tema) {
			if ( tema ) { 
				tema.$remove();

				for (var i in $scope.temas) {
					if ($scope.temas [i] === tema) {
						$scope.temas.splice(i, 1);
					}
				}
			} else {
				$scope.tema.$remove(function() {
					$location.path('temas');
				});
			}
		};

		// Update existing Tema
		$scope.update = function() {
			var tema = $scope.tema;

			tema.$update(function() {
				$location.path('temas/' + tema._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Temas
		$scope.find = function() {
			$scope.temas = Temas.query();
		};

		// Find existing Tema
		$scope.findOne = function() {
			$scope.tema = Temas.get({ 
				temaId: $stateParams.temaId
			});
		};
	}
]);