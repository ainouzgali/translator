'use strict';

angular.module('TranslatorApp', ["angucomplete-alt"])
    .directive('whenScrolled', function() {
        // simple directive to check if we are at end of an element.
        return function(scope, element, attr) {
            var raw = element[0];
            element.bind('scroll', function() {
                if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                    scope.$apply(attr.whenScrolled);
                }
            });
        };
    })
    .controller('SearchController', function($scope, $http, $window) {

        $scope.title = 'Translator! Digital Humanities Style';
        $scope.tagline = 'Relays on our newly created data source of hebrew english sentence translation';


        // Empty object to store the response from API.
        $scope.searchResults = {};
        $scope.transResult = {}

     
        // Watch for change in search text input to hit the API.
        $scope.$watch('search', function() {
            if ($scope.search) {
                //$window.alert($scope.search);
                //$window.alert($scope.searchResults.possibility);
                $scope.loadOptions();
               // $window.alert($scope.searchResults.possibility);
            } else {
                $scope.searchResults = {};
            }
        });

        
        $scope.inputChanged = function(str) {
            $scope.search = str;
         }

        $scope.countrySelected = function(selected) {
           if (selected) {
             $scope.search= selected.originalObject.possibility;
             $scope.fetchTranslation();
           } else {
             $scope.search = null;
        }
      }

        $scope.getTranslation = function(){
        $http.get("/data/tmpTranslation.json")
            .then(function(response){
                //Success
                $scope.transResult = response.data;
            }, function(error){
                //Error
            })
    }

    $scope.getOptions = function(){
        $http.get("/data/tmpOptions.json")
            .then(function(response){
                //Success
                $scope.searchResults = response.data.possibilities;
            }, function(error){
                //Error
            })
    }






        $scope.fetchTranslation = function() {
            // @paginate is boolean to check if this is a pagination request.
            var data= {
                "original" : $scope.search
            };

            $http({
                    url: 'http://localhost:4000/Translate',
                    method: 'POST',
                    responseType: 'json',
                    data: JSON.stringify(data),
                    headers:  {'Content-Type' : 'application/json; charset=UTF-8'},
                    })
                     .then(function(response) {
                        $scope.transResult = response.data;
                        $window.alert("1");
                        $window.alert(JSON.stringify($scope.transResult));
                }, function(response) {
                    $window.alert("2");
                    $window.alert(response.data);
                    $scope.error = 1;

                });
        };


        $scope.loadOptions = function() {
            // @paginate is boolean to check if this is a pagination request.
            var data= {
                "sentence" : $scope.search
            };

            $http({
                    url: 'http://localhost:4000/GetAutoComplete',
                    method: 'POST',
                    responseType: 'json',
                    data: JSON.stringify(data),
                    headers: {'Content-Type' : 'application/json; charset=UTF-8'},
                    
                    })
                     .then(function(response) {
                        $scope.searchResults = response.data.possibilities;
                        //$window.alert(JSON.stringify($scope.searchResults));
                       // $window.alert(JSON.stringify($scope.searchResults));
                }, function(response) {
                    $scope.error = 1;
                    $window.alert(response.statusText);
                    $window.alert(response.data);
    
                });

         };


    });
