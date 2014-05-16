angular.module('starter.controllers', [])

.controller('ContentController', function($scope, $ionicSideMenuDelegate){

	// Sliding the left menu
	$scope.toggleLeft = function() {
		$ionicSideMenuDelegate.toggleLeft();
	};

})

.controller('DashCtrl', function($scope, $state) {
	$scope.goto = function(stateName) {
    	$state.go(stateName);
  	};
})

.controller('FacturesCtrl', function($scope, Factures, $state) {
  $scope.factures = Factures.all();
  $scope.goto = function(stateName) {
  	$state.go(stateName);
  };
  $scope.data = {
    showDelete: false
  };
  // Éditer une facture
  $scope.edit = function(facture) {
    $state.go("tab.facture-edit", {factureId:facture.id});
  };
  // Valider une facture
  $scope.valid = function(facture) {
  	alert('Facture validée !');
  };
  // Supprimer une facture
  $scope.onItemDelete = function(facture) {
    $scope.factures.splice($scope.factures.indexOf(facture), 1);
  };
})

.controller('FactureDetailCtrl', function($scope, $stateParams, Factures, $ionicNavBarDelegate) {
  $scope.facture = Factures.get($stateParams.factureId);
  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };
})

.controller('FactureEditCtrl', function($scope, $stateParams, Factures, $ionicNavBarDelegate) {
  $scope.facture = Factures.get($stateParams.factureId);
  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };
})

// Cache la tab bar
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