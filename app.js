angular.module('webrtcPoc', ['ui.bootstrap','ui.utils','ngRoute','ngAnimate']);

angular.module('webrtcPoc').config(function($routeProvider) {

    $routeProvider.when('/home',{templateUrl: 'partials/conference/conference.html'});
    /* Add New Routes Above */
    $routeProvider.otherwise({redirectTo:'/home'});

});

angular.module('webrtcPoc').run(function($rootScope) {

    $rootScope.safeApply = function(fn) {
        var phase = $rootScope.$$phase;
        if (phase === '$apply' || phase === '$digest') {
            if (fn && (typeof(fn) === 'function')) {
                fn();
            }
        } else {
            this.$apply(fn);
        }
    };

});
