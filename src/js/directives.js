angular.module('starter.directives', [])

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

.directive('onValidSubmit', ['$parse', '$timeout', function($parse, $timeout) {
  return {
    require: '^form',
    restrict: 'A',
    link: function(scope, element, attrs, form) {
      form.$submitted = false;
      var fn = $parse(attrs.onValidSubmit);
      element.on('submit', function(event) {
        scope.$apply(function() {
          element.addClass('ng-submitted');
          form.$submitted = true;
          if (form.$valid) {
            if (typeof fn === 'function') {
              fn(scope, {$event: event});
            }
          }
        });
      });
    }
  };
}])

.directive('validated', ['$parse', function($parse) {
  return {
    require: '^form',
    restrict: 'AEC',
    link: function(scope, element, attrs, form) {
      var inputs = element.find("*");
      var processInput = function(input){
        var attributes = input.attributes;
        if (attributes.getNamedItem('ng-model') != void 0 && attributes.getNamedItem('name') != void 0) {
          var field = form[attributes.name.value];
          if (field != void 0) {
            scope.$watch(function() {
              return form.$submitted + "_" + field.$valid;
            }, function() {
              if (form.$submitted !== true) return;
              var inp = angular.element(input);
              if (inp.hasClass('ng-invalid')) {
                element.removeClass('has-success');
                element.addClass('has-error');
              } else {
                element.removeClass('has-error').addClass('has-success');
              }
            });
          }
        }
      };
      for(var i = 0, max=inputs.length; i < max; i++) {
        processInput(inputs[i]);
      }
    }
  };
}])

.directive("initFromForm", function ($parse) {
  return {
    link: function (scope, element, attrs) {
      var attr = attrs.initFromForm || attrs.ngModel || element.attrs('name'),
      val = attrs.value;
      $parse(attr).assign(scope, val);
    }
  };
})

.directive('contenteditable', ['$sce', function($sce) {
	return {
	  restrict: 'A', // only activate on element attribute
	  require: '?ngModel', // get a hold of NgModelController
	  link: function(scope, element, attrs, ngModel) {
	    if(!ngModel) return; // do nothing if no ng-model

	    // Specify how UI should be updated
	    ngModel.$render = function() {
	      element.html($sce.getTrustedHtml(ngModel.$viewValue || ''));
	    };

	    // Listen for change events to enable binding
	    element.on('blur keyup change', function() {
	      scope.$apply(read);
	    });
	    read(); // initialize

	    // Write data to the model
	    function read() {
	      var html = element.html();
	      // When we clear the content editable the browser leaves a <br> behind
	      // If strip-br attribute is provided then we strip this out
	      if( attrs.stripBr && html == '<br>' ) {
	        html = '';
	      }
	      ngModel.$setViewValue(html);
	    }
	  }
	};
}]);