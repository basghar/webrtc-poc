angular.module('webrtcPoc').controller('ConferenceCtrl', function ($scope, $rootScope, conference) {
    $scope.changeLocalPrivacy = function () {
        conference.info.localPeer.privacy = !conference.info.localPeer.privacy;
        conference.sendLocalPeerPrivacyUpdate();
    }
});
