// script.js

    // create the module and name it scotchApp
    var jackApp = angular.module('jackApp', ['ngRoute']);

    // create the controller and inject Angular's $scope
    jackApp.config(function($routeProvider) {
        $routeProvider
        
			// route for the home page
            .when('/', {
                templateUrl : 'main.html',
                controller  : 'mainController'
            })
            
            
            // route for the about page
            .when('/page1', {
                templateUrl : 'page1.html',
                controller  : 'mainController'
            })

            // route for the contact page
            .when('/page2', {
                templateUrl : 'page2.html',
                controller  : 'mainController'
            });
    });
        
        
	// create the controller and inject Angular's $scope
    jackApp.controller('mainController', function($scope,$timeout) {
        // create a message to display in our view
        
       $scope.randInt = function(low,high){
		   console.log(Math.floor((Math.random() * (high + low + 1) ) - low));
			return Math.floor((Math.random() * (high + low + 1) - low));
		}
        
        
        if ($scope.started != true){
			$scope.mycounter = 0;
			$scope.started = true;
			$scope.idIter = 0;
			$scope.Males = [];
			$scope.Females = [];
			$scope.unmarriedMales = [];
			$scope.unmarriedFemales = [];
			
			$scope.Person = function(){
				this.id = $scope.idIter;
				this.age = 0;
				$scope.idIter += 1;
				genderBool = $scope.randInt(0,1);
				if (genderBool == 0){
					this.gender = "Male";
					$scope.Males.push(this);
				} else {
					this.gender = "Female";
					$scope.Females.push(this);
				}
				this.birthday = function(){
					this.age += 1;
					if (this.age > 15){
						if (this.gender == "Male") {
							$scope.unmarriedMales.push(this);
						} else {
							$scope.unmarriedFenales.push(this);
						}
					}
				}
			}
				
			for (var p = 0; p < 100; p++) {
				person = new $scope.Person();
				person.age = p;
			}
			
			$scope.intervalFunc = function(){
				urp = $timeout(function myfunction(){
					x = new $scope.Person();
					$scope.mycounter++;
					$scope.$apply();
					urp = $timeout($scope.intervalFunc, 1000);
				},1000);
			}
			$scope.intervalFunc();
			
		}
  });
    //jackApp.controller('page1Controller', function($scope) {
        //$scope.message = 'Scope message on page1';
    //});

    //jackApp.controller('page2Controller', function($scope) {
        //$scope.message = 'Scope message on page2';
    //});
