angular.module('webrtcPoc').directive('videoSrc', function () {

    return {
        restrict: 'A',
        controller: function ($scope, $element, $attrs) {
            var videoElement,
                filters = [],
                canvasElement = $element[0],
                canvasContext = canvasElement.getContext('2d');

            function initialize(videoEl) {
                videoElement = videoEl;

                videoElement.addEventListener('play', onPlay);
                videoElement.addEventListener('playing', onPlaying);

                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                renderVideo();
            }

            function onPlay() {
                requestAnimationFrame(renderVideo);
            }

            function onPlaying() {
                canvasElement.width = videoElement.videoWidth;
                canvasElement.height = videoElement.videoHeight;
                videoElement.removeEventListener('playing', onPlaying, false);
            }

            function cleanUp() {
                if (videoElement) {
                    videoElement.onplay = null;
                }
            }

            function renderVideo() {
                var i;

                //canvasContext.translate(width, 0);
                //canvasContext.scale(-1, 1);
                canvasContext.drawImage(videoElement, 0, 0);
                for (i = 0; i < filters.length; i++) {
                    filters[i]();
                }

                if (!(videoElement.paused || videoElement.ended)) {
                    requestAnimationFrame(renderVideo);
                }
            }

            this.addFilter = function (filter) {
                filters.push(filter);
            };

            canvasContext.font = "20px serif";
            canvasContext.fillText("Loading", 10, 50);

            videoElement = $scope.$eval($attrs.videoSrc);
            if(videoElement){
                cleanUp();
                initialize(videoElement)
            }

            $scope.$watch($attrs.videoSrc, function (videoElement) {
                if (videoElement) {
                    cleanUp();
                    initialize(videoElement)
                }
            });
        }
    };
});
