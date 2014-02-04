'use strict';
var app = angular.module('superForm', ['ngAnimate']);

/* Controllers */
function MainCtrl($scope, $http) {
  $scope.fetchSecQuestUrl ='http://www.mocky.io/v2/52ea5a9a7cf0cd6806540819?callback=JSON_CALLBACK';
    $scope.pushToServerUrl ='http://www.mocky.io/v2/52f0f1bdbf227b1603d8a146?callback=JSON_CALLBACK'; //true
//  $scope.pushToServerUrl ='http://www.mocky.io/v2/52f0f29dbf227b2103d8a147?callback=JSON_CALLBACK'; //false

  $scope.master = {
    name: "Ronny",
    pass: "a",
    passconf: "a",
    email: "a@a",
  };

  $scope.longStage = 0;
  $scope.update = function(user,nextStage) {
    $scope.master = angular.copy(user);
    $scope.direction = 1;
    $scope.selection = nextStage;
    if (nextStage=="stage3"){
      $scope.longStage = 1;
    }
  };
  $scope.reset = function() {
    $scope.user = angular.copy($scope.master);
  };
  $scope.reset();

  $scope.isUnchanged = function(user) {
    return angular.equals(user, $scope.master);
  };

  $scope.backTo = function(stage) {
    $scope.direction = 0;
    $scope.selection = stage;
  };

  $scope.fetchSecQuest = function() {
    $scope.code = null;
    $scope.response = null;
    // cache set to false for IE
    var httpHeaders = { 'If-Modified-Since': "0" };
    // Data sent to the server
    var myParams = {a:"q",did:"1",l:"ja-jp"};
    $http({
      method: 'JSONP',
      url: $scope.fetchSecQuestUrl,
      cache: false,
      headers: httpHeaders,
      params: myParams
    }).
    success(function(data, status) {
      // pre-selecting question
      $scope.questions = data.questions;
      $scope.user.secQuest= $scope.questions[1];
    }).
    error(function(data, status) {
      $scope.questions = data.questions || "Request failed";
      $scope.status = status;
    });
  };


  $scope.pushToServer = function(user) {
    $scope.master = angular.copy(user);

    $scope.code = null;
    $scope.response = null;
    // cache set to false for IE
    var httpHeaders = { 'If-Modified-Since': "0" };
    // Data sent to the server
    var myParams = $scope.master;
    $http({
      method: 'JSONP',
      url: $scope.pushToServerUrl,
      cache: false,
      headers: httpHeaders,
      params: myParams
    }).
    success(function(data, status) {
      if (data.suc===true){
        $scope.direction = 1;
        $scope.longStage = 1;
        $scope.selection = "finish";
      } else if (data.suc===false) {
        console.log (data.suc);
      }
    }).
    error(function(data, status) {
      console.log ("pushToServer: Request failed");
      $scope.status = status;
    });
  };

  $scope.fetchSecQuest();

};


/* Directives */
app.directive('passwordMatch', [
  function() {
    return {
      restrict: 'A',
      scope: true,
      require: 'ngModel',
      link: function(scope, elem, attrs, control) {
        var checker = function() {
//get the value of the first password
var e1 = scope.$eval(attrs.ngModel);
//get the value of the other password  
var e2 = scope.$eval(attrs.passwordMatch);
return e1 == e2;
};
scope.$watch(checker, function(n) {
//set the form control to valid if both 
//passwords are the same, else invalid
control.$setValidity("unique", n);
});
}
};
}
]);