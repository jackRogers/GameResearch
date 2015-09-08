// script.js

    // create the module and name it scotchApp
    var jackApp = angular.module('jackApp', ['ngRoute']);

    // create the controller and inject Angular's $scope
    jackApp.config(function($routeProvider) {
        $routeProvider
        
			// route for the home page
            .when('/', {
                templateUrl : '/main.html',
                controller  : 'mainController'
            })
            
            
            // route for the about page
            .when('/page1', {
                templateUrl : '/page1.html',
                controller  : 'page1Controller'
            })

            // route for the contact page
            .when('/page2', {
                templateUrl : '/page2.html',
                controller  : 'page2Controller'
            });
    });
        
        
	// create the controller and inject Angular's $scope
    jackApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'Scope message on main page';
    });

    jackApp.controller('page1Controller', function($scope) {
        $scope.message = 'Scope message on page1';
    });

    jackApp.controller('page2Controller', function($scope) {
        $scope.message = 'Scope message on page2';
    });
