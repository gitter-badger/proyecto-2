'use strict';

//Setting up route
angular.module('temas').config(['$stateProvider',
	function($stateProvider) {
		// Temas state routing
		$stateProvider.
		state('listTemas', {
			url: '/temas',
			templateUrl: 'modules/temas/views/list-temas.client.view.html'
		}).
		state('createTema', {
			url: '/temas/create',
			templateUrl: 'modules/temas/views/create-tema.client.view.html'
		}).
		state('viewTema', {
			url: '/temas/:temaId',
			templateUrl: 'modules/temas/views/view-tema.client.view.html'
		}).
		state('editTema', {
			url: '/temas/:temaId/edit',
			templateUrl: 'modules/temas/views/edit-tema.client.view.html'
		});
	}
]);