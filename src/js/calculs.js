angular.module('starter.calculs', [])

.factory('Calcul', function() {
  return {
  	chiffresAnneeEnCours: function(allFactures) {
  		// Get today DD/MM/YYYY
		var today = new Date();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();

		//today = yyyy+'-'+mm+'-'+dd;
		var charges = 0, tva = 0, ca = 0, net = 0, /*ttc = 0,*/ tabAverageBenefParMois = [], averageNet = 0;

		// Additions pour les totaux de TVA, CA et Charges
		for (var key in allFactures) {
			var facture = allFactures[key];
			var yearFacture = new Date(facture.date).getFullYear();
			var monthFacture = new Date(facture.date).getMonth()+1;
			if(monthFacture<10) {
			  monthFacture='0'+monthFacture;
			}

			if(yearFacture == yyyy && facture.payee) {
			  var tvaCourante = 0, chargesCourantes = 0, netCourant = 0;

			  // TTC
			  //ttc = ttc + parseInt(facture.totalFacture);
			  // TVA
			  tvaCourante = parseInt(this.toTva(facture.totalFacture, facture.tva));
			  tva = tva + tvaCourante;
			  // CA
			  ca = ca + parseInt(facture.totalFacture) - tvaCourante;
			  // Charges
			  chargesCourantes = this.toCharges((facture.totalFacture - tvaCourante), facture.charges);
			  charges = charges + chargesCourantes;
			  // BENEF NET
			  netCourant = facture.totalFacture - tvaCourante - chargesCourantes;
			  net = net + netCourant;
			}
		}

		// On calcule la moyenne NETTE par mois depuis le mois de Janvier
		averageNet = net / mm;

		return {"charges": charges, "tva": tva, "ca": ca, "average": averageNet};
  	},
  	toTtc: function(ht, tva) {
  		var newValTtc = parseInt(ht) + parseInt(ht) * parseInt(tva) / 100;
      	return parseInt(newValTtc.toFixed(2));

      	/*var newValTtc = parseInt(ht) + parseInt(ht) * charges / 100;
		newValTtc = newValTtc + newValTtc * tva / 100;
		newValTtc = newValTtc.toFixed(2);*/
  	},
  	toHt: function(ttc, tva) {
  		var newValHt = parseInt(ttc) * 100 / (parseInt(tva) + 100);
  		return parseInt(newValHt.toFixed(2));

		/*var newValHt = ttc * 100/(tva + 100);
		newValHt = newValHt * 100/(charges + 100);
		newValHt = newValHt.toFixed(2);*/
  	},
  	toTva: function(ttc, tva) {
  		return parseInt(ttc - (ttc / (1 + tva / 100))).toFixed(2);
  	},
  	toCharges: function(ht, charges) {
  		return parseInt((charges / 100 * ht).toFixed(2));
  	}
  };
});