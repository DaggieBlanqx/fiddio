angular.module('fiddio')

.directive('stars', [
  '$http',
  '$rootScope',
  '$timeout',
  function($http, $rootScope, $timeout) {
    return {
      restrict: 'E',
      template: "<div><span ng-if=\"userData.authenticated\"><i class=\"fa\" data-toggle=\"tooltip\" tooltip data-placement=\"top\" title=\"Star this question\" ng-class=\"{'fa-star': starred, 'fa-star-o': !starred}\" ng-click=\"toggleStar()\"></i></span></div>",
      replace: true,
      scope: {
        questionId: '@'
      },
      link: function(scope, elm, attr) {
        scope.starred = false;
        scope.userData = $rootScope.userData;
        // fetch current star from server and store it on $scope
        if ($rootScope.userData.authenticated) {
          $http({ method: 'GET', url: '/api/question/' + attr.questionId + '/star' })
          .then( function(response) {
            scope.starred = response.data.starred;
          }, function(error) {
            console.error('Error', error);
          });
        }

        // set up function to up- and downstar
        scope.toggleStar = function() {
          // TODO: Error popup if not logged in
          if ($rootScope.userData.authenticated) {
            $timeout( $http({ method: 'POST',
              url: '/api/question/' + attr.questionId + '/star',
              data: { star: !scope.starred + 0 }
            }).then( function(response) {
              scope.starred = !scope.starred;
            }, function(error) {
              console.error('Error', error);
            }));
          }
        };
      }
    };
  }
]);