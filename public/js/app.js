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
                console.log("watch pre:");
                console.log($scope.search);
                console.log($scope.searchResults);
                //$window.alert($scope.searchResults.possibility);
                $scope.loadOptions();
                console.log("watch after:");
                console.log($scope.search);
                console.log($scope.searchResults);
               // $window.alert($scope.searchResults.possibility);
            } else {
                console.log("2:");
                console.log($scope.search);
                console.log($scope.searchResults);
                $scope.searchResults = {};
                $scope.transResult = {};
            }
        });

        $scope.slectedOpt= function(selectedObject){
            if(selectedObject){
                console.log("***1***");
                console.log($scope.search);
                $scope.search=selectedObject.originalObject.possibility;
                $scope.fetchTranslation();
                console.log($scope.search);
                console.log("****1***");
            } else{
                $scope.search = {};
            }
            
        }

        
        $scope.inputChanged = function(str) {
            console.log("input change pre:");
            console.log(str);
            console.log($scope.searchResults);
            $scope.search = str;
            console.log("input change after:");
            console.log($scope.searchResults);
         }

        $scope.countrySelected = function(selected) {
           if (selected) {
            console.log("***2***");
            console.log($scope.search);
             $scope.search= selected.originalObject.possibility;
             $scope.fetchTranslation();
             console.log($scope.search);
            console.log("****2***");
           } else {
             $scope.search = {};
             $window.alert("No Translation Yet");

             }
        }

        $scope.localSearch = function(str,searchResults) {
            console.log("********");
            var matches=[];
            searchResults.forEach(function(possibility) {
                console.log(possibility);
                matches.push(possibility.possibility);
            });
            console.log(matches);
            console.log("********");
            return matches;
        };

        $scope.localSearch1 = function(str,searchResults) {
            return searchResults;
        };




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
            var req = {
                method: 'POST',
                url: 'http://localhost:4000/Translate',
                headers: {
                'Content-Type': undefined
                },
                data: data
            }

            $http(req)
                     .then(function(response) {
                        $scope.transResult = response.data;
                        console.log("fetchyrans pre:");
                        console.log($scope.search);
                        console.log($scope.searchResults);
                        console.log(JSON.stringify($scope.transResult));
                }, function(response) {
                    $window.alert("2");
                    $window.alert(response.data);
                    $scope.error = 1;

                });
        };


        $scope.loadOptions = function() {
            // @paginate is boolean to check if this is a pagination request.
            console.log("enter load options");
            var data= {
                "sentence" : $scope.search
            };
            var req = {
                method: 'POST',
                url: 'http://localhost:4000/GetAutoComplete',
                headers: {
                'Content-Type': undefined
                },
                data: data
            }

            console.log(JSON.stringify(data));

            $http(req)
                     .then(function(response) {
                        console.log("loadOptions pre:");
                        console.log($scope.search);
                        console.log($scope.searchResults);
                        $scope.searchResults = response.data.possibilities;
                        console.log("loadOptions after:");
                        console.log($scope.search);
                        console.log($scope.searchResults);
                        $scope.searchResults = response.data.possibilities;
                        //$window.alert(JSON.stringify($scope.searchResults));
                       // $window.alert(JSON.stringify($scope.searchResults));
                }, function(response) {
                    $scope.error = 1;
                    //console.log(JSON.stringify(response.data));
                });

         };


    });
