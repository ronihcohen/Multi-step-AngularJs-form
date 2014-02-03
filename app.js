'use strict';
var app = angular.module('superForm', ['ngAnimate']);

/* Controllers */
function MainCtrl($scope, $http) {
  $scope.master = {
    name: "Ronny"
  };
  $scope.update = function(user,nextStage) {
    $scope.master = angular.copy(user);
    $scope.selection = nextStage;
  };
  $scope.reset = function() {
    $scope.user = angular.copy($scope.master);
  };
  $scope.isUnchanged = function(user) {
    return angular.equals(user, $scope.master);
  };
  $scope.reset();
  $scope.backTo = function(stage) {
    $scope.selection = stage;
  };
  $scope.method = 'JSONP';
  $scope.url ='http://www.mocky.io/v2/52ea5a9a7cf0cd6806540819?callback=JSON_CALLBACK';
  $scope.fetch = function() {
    $scope.code = null;
    $scope.response = null;
// cache set to false for IE
var httpHeaders = { 'If-Modified-Since': "0" };
// Data sent to the server
var myParams = {a:"q",did:"1",l:"ja-jp"};
$http({
  method: $scope.method,
  url: $scope.url,
  cache: false,
  headers: httpHeaders,
  params: myParams
}).
success(function(data, status) {
  $scope.status = status;
  $scope.questions = data.questions;
}).
error(function(data, status) {
  $scope.questions = data.questions || "Request failed";
  $scope.status = status;
});
};
$scope.fetch();
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