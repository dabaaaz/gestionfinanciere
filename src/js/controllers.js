angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $timeout, $state, $ionicSideMenuDelegate, Factures, $ionicPopup) {
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

    var alertPopup = $ionicPopup.alert({
      title: 'Facture ajoutée',
      template: 'Celle-ci apparaîtra bien dans la liste de vos factures'
    });
    alertPopup.then(function(res) {
     location.reload();
    });

  };

  // Load or initialize factures
  $scope.factures = allFactures = Factures.all();

  // Get today DD/MM/YYYY
  var today = new Date();
  //var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  /*if(dd<10) {
      dd='0'+dd;
  } */

  /*if(mm<10) {
      mm='0'+mm;
  }*/

  //today = yyyy+'-'+mm+'-'+dd;
  var charges = 0, tva = 0, ca = 0, tabAverageBenefParMois = [], averageNet = 0, size = 0;

  // Additions pour les totaux de TVA, CA et Charges
  for (var key in allFactures) {
    var facture = allFactures[key];
    var yearFacture = new Date(facture.date).getFullYear();
    var monthFacture = new Date(facture.date).getMonth()+1;
    if(monthFacture<10) {
      monthFacture='0'+monthFacture;
    }
    if(yearFacture == yyyy) {
      tva = tva + facture.tva;
      charges = charges + facture.charges;
      ca = ca + parseInt(facture.totalFacture);
      if(tabAverageBenefParMois[monthFacture] === undefined)
        tabAverageBenefParMois[monthFacture] = 0;
      tabAverageBenefParMois[monthFacture] = tabAverageBenefParMois[monthFacture] + parseInt(facture.totalFacture);
    }
  }

  // On calcul la moyenne NETTE par mois depuis le mois de Janvier
  for (var month in tabAverageBenefParMois) {
    averageNet = averageNet + tabAverageBenefParMois[month];
    size++;
  }
  averageNet = averageNet / size;

  // On envoie le tout dans la vue
  $scope.chiffresThatMonth = {"charges": charges, "tva": tva, "ca": ca, "average": averageNet};

  // Grab the last active, or the first facture
  $scope.activeFacture = $scope.factures[Factures.getLastActiveIndex()];


  $scope.newFacture = function(facture) {
    var payee = false, total = 0;
    if(facture.validation)
      payee = facture.validation;
    if(facture.ttc) {
      total = facture.totalFacture;
    } else {
      total = facture.totalFacture + (facture.tva/100 * facture.totalFacture);
      //total = facture.totalFacture + facture.totalFacture * facture.charges / 100;
    }
    createFacture(facture.name, total, facture.tva, facture.charges, payee, facture.date);
  };

  // Called to select the given facture
  $scope.selectFacture = function(facture, index) {
    $scope.activeFacture = facture;
    Factures.setLastActiveIndex(index);
  };


  // Try to create the first facture, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  /*$timeout(function() {
    if($scope.factures.length === 0) {
      while(true) {
        alert('première facture :o');
        //var factureName = prompt('Your first facture name:');
        //if(factureName) {
        //  createProject(projectTitle);
        //  break;
        //}
      }
    }
  });*/

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
    facture.payee = true;
    Factures.editIndex(facture);
  };
  // Supprimer une facture
  $scope.onItemDelete = function(facture) {
    $scope.factures.splice($scope.factures.indexOf(facture), 1);
    Factures.removeIndex(facture.id);
  };

  $scope.updateHt = function (total, tva) {
      $scope.updateHt = "okk";
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
  $scope.editFacture = function(newFacture) {
    Factures.editIndex(newFacture);
    $ionicNavBarDelegate.back();
    /*if(newFacture.validation)
      payee = newFacture.validation;
    if(newFacture.ttc) {
      // Faire le calcul en fonction du TTC.....
    }*/
  };
  // When the totalHT or totalTTC are updating
  $scope.updatettc = function(){
      var newValTtc = parseInt($scope.facture.ht) + parseInt($scope.facture.ht) * $scope.facture.tva / 100;
      newValTtc = newValTtc.toFixed(2);

      /*var newValTtc = parseInt($scope.facture.ht) + parseInt($scope.facture.ht) * $scope.facture.charges / 100;
      newValTtc = newValTtc + newValTtc * $scope.facture.tva / 100;
      newValTtc = newValTtc.toFixed(2);*/

      document.getElementById('totalttc').value = newValTtc;
  };
  $scope.updateht = function(){
      var newValHt = ($scope.facture.totalFacture * (100/($scope.facture.tva + 100))).toFixed(2);

      /*var newValHt = $scope.facture.totalFacture * 100/($scope.facture.tva + 100);
      newValHt = newValHt * 100/($scope.facture.charges + 100);
      newValHt = newValHt.toFixed(2);*/

      document.getElementById('totalht').value = newValHt;
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