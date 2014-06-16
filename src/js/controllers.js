angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, $state, $ionicSideMenuDelegate, Factures, Preferences, Settings, Calcul, $ionicPopup, $ionicLoading) {
  // Init the localStorage
  //Factures.clearAll();

  // Sliding the left menu
  $scope.toggleLeft = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };

	$scope.goto = function(stateName) {
    	$state.go(stateName);
  };

  // A utility function for creating a new facture
  // with the given parameters
  var createFacture = function(name, totalFacture, tva, charges, payee, date) {
    var newFacture = Factures.newFacture($scope.factures.length, name, totalFacture, tva, charges, payee, date);
    $scope.factures.push(newFacture);
    Factures.save($scope.factures);
    $scope.selectFacture(newFacture, $scope.factures.length-1);

    if(!settings.modalAddFacture) {
      $scope.modalAddFacture = { checked: false };
      $scope.modalAddFactureChange = function() {
        // If the "do not show again" is checked we put the modalAddFacture to 1
        Settings.updateSettings($scope.modalAddFacture.checked, settings.homeTuto);
      };
      var alertPopup = $ionicPopup.alert({
        title: 'Facture ajoutée',
        scope: $scope,
        subTitle: 'Celle-ci apparaîtra dans la liste de vos factures',
        template: '<ion-checkbox ng-model="modalAddFacture.checked" ng-change="modalAddFactureChange()">Ne plus afficher</ion-checkbox>'
      });
    }
    $ionicSideMenuDelegate.toggleRight();
    document.getElementById('ajoutfacture').reset();
  };

  // Load or initialize factures, settings and preferences
  $scope.factures = allFactures = Factures.all();
  $scope.preferences = Preferences.all();
  var settings = Settings.all();

  // On envoie le tout dans la vue
  $scope.chiffresThatYear = Calcul.chiffresAnneeEnCours(allFactures);

  // Grab the last active, or the first facture
  $scope.activeFacture = $scope.factures[Factures.getLastActiveIndex()];

  // When the TVA or Charges are updating
  $scope.updateTvaAndCharges = function(){
    var tva = $scope.preferences.tva;
    var charges = $scope.preferences.charges;
    
    document.getElementById('tva').value = tva;
    document.getElementById('charges').value = charges;

    Preferences.updateTvaAndCharges(tva, charges);

    // Setup the loader
    $ionicLoading.show({
      content: 'Enregistré',
      animation: 'fade-in',
      showBackdrop: true,
      maxWidth: 200,
      showDelay: 1000
    });
    
    // Set a timeout to clear loader, however you would actually call the $ionicLoading.hide(); method whenever everything is ready or loaded.
    $timeout(function () {
      $ionicLoading.hide();
    }, 2000);

  };

  $scope.newFacture = function(facture) {
    var payee = false, total = 0;
    if(facture.validation)
      payee = facture.validation;
    if(facture.ttc) {
      total = facture.totalFacture;
    } else {
      total = Calcul.toTtc(facture.totalFacture, facture.tva);
      //total = facture.totalFacture + facture.totalFacture * facture.charges / 100;
    }
    createFacture(facture.name, total, facture.tva, facture.charges, payee, facture.date);
    facture.name = facture.date = facture.totalFacture = "";
  };

  // Called to select the given facture
  $scope.selectFacture = function(facture, index) {
    $scope.activeFacture = facture;
    Factures.setLastActiveIndex(index);
  };

  // Try to create the first facture, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.factures.length === 0 && settings.homeTuto === 0) {
      var alertPopup = $ionicPopup.alert({
        title: 'Ajouter une facture',
        template: 'Un petit slide sur la droite vous permettra d\'ajouter une facture'
      });
      Settings.updateSettings(settings.modalAddFacture, 1);
    }
  });

})

.controller('FacturesCtrl', function($scope, Factures, Calcul, $state) {

  // Get all the factures
  var allFactures = Factures.all();
  // Update / add the amounts needed to the view
  for (var index in allFactures) {
    var facture = allFactures[index];
    facture.ht = Calcul.toHt(parseInt(facture.totalFacture), parseInt(facture.tva));
    facture.ttc = parseInt(facture.totalFacture);
    facture.tva = Calcul.toTva(facture.totalFacture, facture.tva);
    facture.charges = Calcul.toCharges(facture.ht, facture.charges);
  }
  $scope.factures = allFactures;

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
  /*$scope.valid = function(facture) {
    facture.payee = true;
    Factures.editIndex(facture);
  };*/
  $scope.valid = function(factureId, facturePayee) {
    // Update the date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;

    // We update the payee bool in the view
    facture.payee = facturePayee;

    // We launch the services
    Factures.editPayee(factureId, facturePayee, today);
  };
  // Supprimer une facture
  $scope.onItemDelete = function(facture) {
    $scope.factures.splice($scope.factures.indexOf(facture), 1);
    Factures.removeIndex(facture.id);
  };
})

.controller('FactureDetailCtrl', function($scope, $stateParams, Factures, Calcul, $ionicNavBarDelegate) {
  var facture = Factures.get($stateParams.factureId);

  facture.ht = Calcul.toHt(parseInt(facture.totalFacture), parseInt(facture.tva));
  facture.tva = Calcul.toTva(facture.totalFacture, facture.tva);
  facture.charges = Calcul.toCharges(facture.ht, facture.charges);

  $scope.facture = facture;

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.valid = function(factureId, facturePayee) {
    // Update the date
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    if(dd<10) {
        dd='0'+dd;
    } 

    if(mm<10) {
        mm='0'+mm;
    } 
    today = yyyy+'-'+mm+'-'+dd;

    // We update the date
    $scope.facture.date = newDate = today;

    // We launch the services
    Factures.editPayee(factureId, facturePayee, newDate);
  };
})

.controller('FactureEditCtrl', function($scope, $stateParams, Factures, Calcul, $ionicNavBarDelegate) {
  var facture = Factures.get($stateParams.factureId);

  facture.ht = Calcul.toHt(parseInt(facture.totalFacture), parseInt(facture.tva));
  //facture.tva = Calcul.toTva(facture.totalFacture, facture.tva);
  //facture.charges = Calcul.toCharges(facture.ht, facture.charges);

  $scope.facture = facture;

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };
  $scope.editFacture = function(newFacture) {
    // We convert the TTC, then we remove the ht index we no need to save
    newFacture.totalFacture = Calcul.toTtc(newFacture.ht, newFacture.tva);
    delete newFacture.ht;

    Factures.editIndex(newFacture);
    console.log("rrr", newFacture);
    $ionicNavBarDelegate.back();
  };
  // When the totalHT or totalTTC are updating
  $scope.updatettc = function() {
      var ttc = document.getElementById('totalttc');
      ttc.value = Calcul.toTtc($scope.facture.ht, $scope.facture.tva);
  };
  $scope.updateht = function() {
      var ht = document.getElementById('totalht');
      ht.value = Calcul.toHt($scope.facture.totalFacture, $scope.facture.tva);
  };
})

.controller('FactureCreerCtrl', function($scope, $ionicNavBarDelegate, Factures, Preferences, Calcul) {

  $scope.preferences = Preferences.all();
  $scope.factures = Factures.all();

  $scope.goBack = function() {
    $ionicNavBarDelegate.back();
  };

  $scope.createFacture = function(facture) {

    var payee = false, total = 0;
    if(facture.validation)
      payee = facture.validation;
    if(facture.ttc) {
      total = facture.totalFacture;
    } else {
      total = Calcul.toTtc(facture.totalFacture, facture.tva);
      //total = facture.totalFacture + facture.totalFacture * facture.charges / 100;
    }

    var newFacture = Factures.newFacture($scope.factures.length, facture.name, total, facture.tva, facture.charges, payee, facture.date);
    $scope.factures.push(newFacture);
    Factures.save($scope.factures);
    $ionicNavBarDelegate.back();
  };
})

// Cache la tab bar
.controller('HideCtrl', function($scope) {
  // Nav hide like http://codepen.io/anon/pen/BcyJw
  var tabs = document.querySelectorAll('div.tabs')[0];
  tabs = angular.element(tabs);
  tabs.css('display', 'none');
  
  $scope.$on('$destroy', function() {
    tabs.css('display', '');
  });
});