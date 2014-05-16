// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

/*.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})*/

// The fadeBar directive
.directive('fadeBar', function($timeout) {
  return {
    restrict: 'E',
    template: '<div class="fade-bar"></div>',
    replace: true,
    link: function($scope, $element, $attr) {
      // Run in the next scope digest
      $timeout(function() {
        // Watch for changes to the openRatio which is a value between 0 and 1 that says how "open" the side menu is
        $scope.$watch('sideMenuController.getOpenRatio()', function(ratio) {
          // Set the transparency of the fade bar
          $element[0].style.opacity = Math.abs(ratio);
        });
      });
    }
  };
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html",
      controller: 'HideCtrl'
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl',
        }
      }
    })

    // Liste des factures vue basique
    .state('tab.factures', {
      url: '/factures',
      views: {
        'tab-factures': {
          templateUrl: 'templates/tab-factures.html',
          controller: 'FacturesCtrl'
        }
      }
    })

    // Liste des factures vue CA
    .state('tab.factures-ca', {
      url: '/factures-ca',
      views: {
        'tab-factures': {
          templateUrl: 'templates/tab-factures-ca.html',
          controller: 'FacturesCtrl'
        }
      }
    })

    // Liste des factures vue TVA
    .state('tab.factures-tva', {
      url: '/factures-tva',
      views: {
        'tab-factures': {
          templateUrl: 'templates/tab-factures-tva.html',
          controller: 'FacturesCtrl'
        }
      }
    })

    // Liste des factures vue charges
    .state('tab.factures-charges', {
      url: '/factures-charges',
      views: {
        'tab-factures': {
          templateUrl: 'templates/tab-factures-charges.html',
          controller: 'FacturesCtrl'
        }
      }
    })

    // Afficher en détails une facture
    .state('tab.facture-detail', {
      url: '/facture/:factureId',
      views: {
        'tab-factures': {
          templateUrl: 'templates/facture-detail.html',
          controller: 'FactureDetailCtrl'
        }
      }
    })

    // Éditer une facture
    .state('tab.facture-edit', {
      url: '/facture-edit/:factureId',
      views: {
        'tab-factures': {
          templateUrl: 'templates/facture-edit.html',
          controller: 'FactureEditCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});