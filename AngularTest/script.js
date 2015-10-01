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
			return Math.floor((Math.random() * (high + low + 1) - low));
		}
        
        
        if ($scope.started != true){
			$scope.turncounter = 0;
			$scope.started = true;
			$scope.idIter = 0;
			$scope.Males = [];
			$scope.Females = [];
			//$scope.unmarriedMales = [];
			//$scope.unmarriedFemales = [];
			//$scope.Couples = [];
			
			$scope.Person = function(){
				this.alive = true;
				this.id = $scope.idIter;
				this.age = 0;
				this.health = 100;
				this.spouse = false;
				this.parents = [];
				this.children = [];
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
					//if (this.age == 16){
						//if (this.gender == "Male") {
							//$scope.unmarriedMales.push(this);
						//} else {
							//$scope.unmarriedFemales.push(this);
						//}
					//} 
					
					this.health -= 1
					if ($scope.randInt(0,this.health) < 1){
						this.die();
					}
				}
				
				this.findSpouse = function(){
					if (this.age >= 16 && this.spouse == false){
						if (this.gender == "Male"){
							var randomFemale = $scope.Females[$scope.randInt(0,$scope.Females.length - 1)]
							if (randomFemale.spouse == false && randomFemale.age >= 16  && randomFemale.age <= 40){
								randomFemale.spouse = this;
								this.spouse = randomFemale;
							}
						} else {
							var randomMale = $scope.Males[$scope.randInt(0,$scope.Males.length - 1)]
							if (randomMale.spouse == false && randomMale.age >= 16 ){
								randomMale.spouse = this;
								this.spouse = randomMale;
							}
						}
					}
				}
				
				this.haveBabies = function(){
					if (this.gender == "Female" && this.age >= 16 && this.age <= 40 && this.spouse != false){
						var fertility = this.health - this.age;
						var roll = $scope.randInt(0,100);
						if (fertility > roll){
							x = new $scope.Person();
							x.parents.push(this);
							x.parents.push(this.spouse);
							this.children.push(x);
							this.spouse.children.push(x);
						}
					}
				}
				
				this.die = function(){
					this.alive = false;
					if (this.spouse != false){
						this.spouse.spouse = false;
					}
					$scope[this.gender + "s"].splice($scope[this.gender + "s"].indexOf(this), 1);
					//$scope["unmarried" + this.gender + "s"].splice($scope[this.gender + "s"].indexOf(this), 1);
				}
			}
			
			$scope.meanOfAttr= function(attr){
				var sum = 0;
				for (var i = 0; i < $scope.Males.length; i++){
					sum += $scope.Males[i][attr];
				}
				var maleAvg = sum / parseFloat($scope.Males.length)
				var sum = 0;
				for (var i = 0; i < $scope.Females.length; i++){
					sum += $scope.Females[i][attr];
				}
				var femaleAvg = sum / parseFloat($scope.Females.length);
				return [maleAvg, femaleAvg];
			}
			
			$scope.calcAverages = function(){
				ageAvgs = $scope.meanOfAttr('age');
				$scope.avgMaleAge = ageAvgs[0]
				$scope.avgFemaleAge = ageAvgs[1]
				healthAvgs = $scope.meanOfAttr('health');
				$scope.avgMaleHealth = healthAvgs[0]
				$scope.avgFemaleHealth = healthAvgs[1]
			}
			
			
			$scope.oneYear = function(){
				for (var i = 0; i < $scope.Males.length; i++){
					$scope.Males[i].findSpouse();
					$scope.Males[i].birthday();
				}
				for (var i = 0; i < $scope.Females.length; i++){
					$scope.Females[i].findSpouse();
					$scope.Females[i].haveBabies();
					$scope.Females[i].birthday()
				}
			}
			for (var i = 0; i < 100; i++){
				x = new $scope.Person();
				x.age = i;
			}
			
			
			$scope.intervalFunc = function(){
				urp = $timeout(function myfunction(){
					$scope.turncounter++;
					$scope.oneYear();
					//$scope.calcAverages()
					$scope.$apply();
					urp = $timeout($scope.intervalFunc, 100);
				},100);
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
