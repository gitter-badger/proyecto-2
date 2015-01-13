'use strict';

// Configuring the Articles module
angular.module('temas').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Temas', 'temas', 'dropdown', '/temas(/create)?');
		Menus.addSubMenuItem('topbar', 'temas', 'List Temas', 'temas');
		Menus.addSubMenuItem('topbar', 'temas', 'New Tema', 'temas/create');
	}
]);