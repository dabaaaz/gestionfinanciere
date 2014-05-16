angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Factures', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var factures = [
    { id: 0, name: 'Scruff McGruff', totalFacture: 1600, tva: 20, charges: 30, payee: 0, date: 1400151149},
    { id: 1, name: 'G.I. Joe', totalFacture: 2200, tva: 20, charges: 30, payee: 1, date: 1400161149},
    { id: 2, name: 'Miss Frizzle', totalFacture: 4200, tva: 20, charges: 30, payee: 0, date: 1400160149},
    { id: 3, name: 'Ash Ketchum', totalFacture: 200, tva: 20, charges: 30, payee: 1, date: 1400161049}
  ];

  return {
    all: function() {
      return factures;
    },
    get: function(factureId) {
      // Simple index lookup
      return factures[factureId];
    }
  };
}) ;