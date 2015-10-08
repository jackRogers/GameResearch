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
			
			$scope.Stats = {
				birthsCounters: 0,
				deathsCounter: 0,
				birthsThisYear: 0,
				deathsThisYear: 0,
				averageAge: 0,
				populationChangeThisYear: 0
			}
			
			$scope.Settings = {
					maleBreedingCutoffs:  [16,60],
					femaleBreedingCutoffs: [16,40],
					femaleBreedingPercent: 40,
					//percent of couples that breed successfully
					successfulBreedingChance: 0.1,
					deathrate: 0.1,
					dt: 0.1
			}
			
			$scope.Population = {
				Males: 0,
				Females: 0,
				MaleAgeList: [0],
				FemaleAgeList: [0]
			}
			
			$scope.Resources = {
				food: 0,
				logs: 0,
				stone: 0,
				ore: 0,
				knowledge: 0
			}
			
			$scope.Buildings = {
				farms: 0,
				loggingCamps: 0,
				quarrys: 0,
				mines: 0,
				schools: 0
			}
			
			$scope.buyBuilding = function(buildingName){
				if (buildingName == 'farm'){
					$scope.Buildings.farms += 1
				} else if(buildingName == 'loggingCamp'){
					$scope.Buildings.loggingCamps += 1
				} else if (buildingName == 'quarry'){
					$scope.Buildings.quarrys += 1
				} else if (buildingName == 'mine'){
					$scope.Buildings.mines += 1
				} else if (buildingName == 'school'){
					$scope.Buildings.schools += 1
				} 
			}
			
			$scope.getBreedingPairs = function() {
				var breedingMales = 0;
				//get number of males between low and high breeding age cutoff
				for ( var i = $scope.Settings.maleBreedingCutoffs[0]; i < $scope.Population.MaleAgeList.length; i++){
					if (i <= $scope.Settings.maleBreedingCutoffs[1]){
						breedingMales += $scope.Population.MaleAgeList[i]
					}
				}
				var breedingFemales = 0;
				//get number of males between low and high breeding age cutoff
				for ( var i = $scope.Settings.femaleBreedingCutoffs[0]; i < $scope.Population.FemaleAgeList.length; i++){
					if (i <= $scope.Settings.femaleBreedingCutoffs[1]){
						breedingFemales += $scope.Population.FemaleAgeList[i]
					}
				}
				return Math.min(breedingMales,breedingFemales * $scope.Settings.femaleBreedingPercent * 0.01)
			}
			
			$scope.birthPerson = function(){
				var g = $scope.randInt(0,1)
				if (g == 0){
					$scope.Population.Males += 1
					$scope.Population.MaleAgeList[0] += 1
				} else {
					$scope.Population.Females += 1
					$scope.Population.FemaleAgeList[0] += 1
				}
			}
			
			$scope.breed = function(){
				var breedingpairs = $scope.getBreedingPairs()
				newbirths = breedingpairs * $scope.Settings.successfulBreedingChance * $scope.Settings.dt
				for (var i = 0; i < newbirths; i++) {
					$scope.birthPerson();
					$scope.Stats.birthsCounter += 1
				}
				
			}
			
			$scope.death = function(){
				var maleDeathTotal = 0;
				for (var i = 1; i < $scope.Population.MaleAgeList.length; i++){
					var newdeaths = Math.ceil(Math.floor($scope.randInt(0,$scope.Population.MaleAgeList[i] * $scope.Settings.deathrate ) *  i  * 0.01  * $scope.Settings.dt))
					if (newdeaths >= $scope.Population.MaleAgeList[i]){
						$scope.Population.Males -= $scope.Population.MaleAgeList[i]
						$scope.Stats.deathsCounter += $scope.Population.MaleAgeList[i]
						$scope.Population.MaleAgeList[i] = 0;
					} else {
						$scope.Population.Males -= newdeaths
						$scope.Population.MaleAgeList[i] -= newdeaths
						$scope.Stats.deathsCounter += newdeaths
					}
				}
				
				for (var i = 1; i < $scope.Population.FemaleAgeList.length; i++){
					var newdeaths = Math.ceil(Math.floor($scope.randInt(0,$scope.Population.FemaleAgeList[i] * $scope.Settings.deathrate ) *  i  * 0.01  * $scope.Settings.dt))
					if (newdeaths >= $scope.Population.FemaleAgeList[i]){
						$scope.Population.Females -= $scope.Population.FemaleAgeList[i]
						$scope.Stats.deathsCounter += $scope.Population.FemaleAgeList[i]
						$scope.Population.FemaleAgeList[i] = 0;
					} else {
						$scope.Population.Females -= newdeaths
						$scope.Population.FemaleAgeList[i] -= newdeaths
						$scope.Stats.deathsCounter += newdeaths
					}
				}
			}
			
			$scope.cleanAgeLists = function(){
				var maybemore = false
				if ($scope.Population.MaleAgeList[$scope.Population.MaleAgeList.length -1] == 0){
					$scope.Population.MaleAgeList.pop($scope.Population.MaleAgeList.length -1)
					maybemore = true
				}
				if ($scope.Population.FemaleAgeList[$scope.Population.FemaleAgeList.length -1] == 0){
					$scope.Population.FemaleAgeList.pop($scope.Population.FemaleAgeList.length -1)
					maybemore = true
				}
				if (maybemore == true){
					$scope.cleanAgeLists()
				}
			}
			
			$scope.stats = function(){
				$scope.Stats.birthsThisYear = $scope.Stats.birthsCounter
				$scope.Stats.birthsCounter = 0;
				$scope.Stats.deathsThisYear = $scope.Stats.deathsCounter
				$scope.Stats.deathsCounter = 0;
				$scope.Stats.populationChangeThisYear = $scope.Stats.birthsThisYear - $scope.Stats.deathsThisYear
				var mysum = 0;
				for ( var i = 0; i < $scope.Population.MaleAgeList.length; i++){
					mysum += $scope.Population.MaleAgeList[i] * i
				}
				for ( var i = 0; i < $scope.Population.FemaleAgeList.length; i++){
					mysum += $scope.Population.FemaleAgeList[i] * i
				}
				$scope.Stats.averageAge = mysum / parseFloat($scope.Population.Males + $scope.Population.Females)
				
			}
			
			$scope.newYear = function(){
				$scope.Population.MaleAgeList.unshift(0)
				$scope.Population.FemaleAgeList.unshift(0)
				$scope.cleanAgeLists()
				$scope.stats()
			}
			
			
			
			$scope.turn = function(){
				$scope.breed()
				$scope.death()
				$scope.turncounter += $scope.Settings.dt
				if (Number($scope.turncounter.toFixed(1)) % 1.0 == 0){
					$scope.newYear()
					//console.log("NEW YEAR")
					//console.log($scope.Population.MaleAgeList)
				}
			}
			
			$scope.pauseResume = function(){
				if ($scope.paused == false){
					$scope.paused = true
				} else {
					$scope.paused = false
					$scope.intervalFunc();
				}
			}
			
			//test
			for (var i = 0; i < 1000; i++){
				$scope.birthPerson()
			}
			$scope.paused = false
			$scope.intervalFunc = function(){
				urp = $timeout(function myfunction(){
					if ($scope.paused == false){
						$scope.turn()
						$scope.$apply();
						urp = $timeout($scope.intervalFunc, 100);
					}
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
