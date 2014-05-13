angular.module('starter.controllers', [])

.controller('ContentController', ['$scope',function($scope, $ionicSideMenuDelegate){

	// Sliding the left menu
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

}])

.controller('DashCtrl', function($scope, $state) {
	$scope.goto = function(stateName) {
    	$state.go(stateName);
  	};
})

.controller('FacturesCtrl', function($scope, Factures) {
  $scope.factures = Factures.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('HideCtrl', function($scope) {
  // Nav hide like http://codepen.io/anon/pen/BcyJw
  console.log('HideCtrl');
  var tabs = document.querySelectorAll('div.tabs')[0];
  tabs = angular.element(tabs);
  tabs.css('display', 'none');
  
  $scope.$on('$destroy', function() {
    console.log('HideCtrl destroy');
    tabs.css('display', '');
  });
});