angular.module('starter.services', [])

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
      // Add a new facture
      return {
        id: id,
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
            factures[key] = newFacture;
            break;
          }
      }

      // We save the array of factures
      this.save(factures);
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
    }
  };
});