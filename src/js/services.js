angular.module('starter.services', [])

// Factures CRUD
.factory('Factures', function() {
  return {
    all: function() {
      var factureString = window.localStorage.factures;
      if(factureString) {
        console.log(angular.fromJson(factureString));
        return angular.fromJson(factureString);
      }
      return [];
    },
    save: function(factures) {
      window.localStorage.factures = angular.toJson(factures);
    },
    newFacture: function(id, name, totalFacture, tva, charges, payee, date) {
      // If the facture ID already exists
      var i = 0;
      while(this.get(id + i)) {
        i++;
      }
      var newId = id + i;

      // Otherwise we can add the facture
      return {
        id: newId,
        name: name,
        totalFacture: totalFacture,
        tva: tva,
        charges: charges,
        payee: payee,
        date: date
      };
    },
    get: function(factureId) {
      // We take the array of factures
      var factures = this.all();
      for (var key in factures) {
          var facture = factures[key];
          if(facture.id == factureId) {
            return facture;
          }
      }
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage.lastActiveFactures) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage.lastActiveFactures = index;
    },
    editIndex: function(newFacture) {
      // We take the array of factures
      var factures = this.all();

      // We update the item
      for (var key in factures) {
          var facture = factures[key];
          if(facture.id == newFacture.id) {
            console.log(facture.id, facture, newFacture.id, newFacture);
            factures[key] = newFacture;
          }
      }

      // We save the array of factures
      this.save(factures);
    },
    editPayee: function(factureId, facturePayee, newDate) {
      // We take the array of factures
      var factures = this.all();

      // We get the index in the array
      var thisFacture = this.get(factureId);

      // We update the payee and date
      thisFacture.payee = facturePayee;
      thisFacture.date = newDate;

      // We edit
      this.editIndex(thisFacture);
    },
    removeIndex: function(index) {
      // We take the array of factures
      var factures = this.all();

      // We remove the item
      for (var key in factures) {
          var facture = factures[key];
          if(facture.id == index) {
            factures.splice(key, 1);
            break;
          }
      }

      // We save the array of factures
      this.save(factures);
    },
    clearAll: function() {
      window.localStorage.clear();
      alert("Init");
    }
  };
})

// Preferences CRUD
.factory('Preferences', function() {
  return {
    all: function() {
      var preferencesString = window.localStorage.preferences;
      if(!preferencesString) {
        // Set preferences by default (tva == 20 & charges == 30)
        return this.save({"tva": 20, "charges": 30});
      } else {
        console.log(angular.fromJson(preferencesString));
        return angular.fromJson(preferencesString);
      }
    },
    save: function(preferences) {
      window.localStorage.preferences = angular.toJson(preferences);
    },
    updateTvaAndCharges: function(tva, charges) {
      this.save({"tva": tva, "charges": charges});
      var preferencesString = window.localStorage.preferences;
      console.log(angular.fromJson(preferencesString));
    }
  };
})

// Settings CRUD
.factory('Settings', function() {
  return {
    all: function() {
      var settingsString = window.localStorage.settings;
      if(!settingsString) {
        // Set settings by default (modalAddFacture == 0 & homeTuto == 0)
        return this.save({"modalAddFacture": 0, "homeTuto": 0});
      } else {
        console.log(angular.fromJson(settingsString));
        return angular.fromJson(settingsString);
      }
    },
    save: function(settings) {
      window.localStorage.settings = angular.toJson(settings);
    },
    updateSettings: function(modalAddFacture, homeTuto) {
      this.save({"modalAddFacture": modalAddFacture, "homeTuto": homeTuto});
      var settingsString = window.localStorage.settings;
      console.log(angular.fromJson(settingsString));
    }
  };
});