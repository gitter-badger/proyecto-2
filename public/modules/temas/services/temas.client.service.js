'use strict';

//Temas service used to communicate Temas REST endpoints
angular.module('temas').factory('Temas', ['$resource',
	function($resource) {
		return $resource('temas/:temaId', { temaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);