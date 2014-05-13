angular.module('starter.services', [])

/**
 * A simple example service that returns some data.
 */
.factory('Factures', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var factures = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
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
});