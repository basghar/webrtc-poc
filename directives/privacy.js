angular.module('webrtcPoc').directive('privacy', function () {

    return {
        restrict: 'A',
        require: 'videoSrc',
        link: function (scope, element, attrs, videoSourceCtrl) {
            var privacy = false,
                canvasElement = element[0],
                canvasContext = canvasElement.getContext('2d');

            function renderPrivacy() {
                if (privacy) {
                    var oldGA = canvasContext.globalAlpha;
                    canvasContext.globalAlpha = 0.7;
                    canvasContext.fillStyle = "white";
                    canvasContext.fillRect(0, 0, canvasElement.width, canvasElement.height);
                    canvasContext.globalAlpha = oldGA;
                }
            }

            videoSourceCtrl.addFilter(renderPrivacy);

            scope.$watch(attrs.privacy, function (changedPrivacy) {
                privacy = !!(changedPrivacy);
            });
        }
    };
});
