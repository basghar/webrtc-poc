/* global SimpleWebRTC */
angular.module('webrtcPoc').factory('conference', function ($rootScope) {
    var UPDATE_ATTRS_MESSAGE = 'sendPeerAttributesUpdate',
        localVideoElement = document.createElement('video'),
        conferenceInfo = {
            videoConstraints: {
                width: 320,
                height: 180,
                frameRate: 25
            },
            localPeer: {
                video: localVideoElement,
                privacy: false,
                local: true
            },
            participants: {}
        },
        webRTC = new SimpleWebRTC({
            localVideoEl: localVideoElement,
            remoteVideosEl: '',
            autoRequestMedia: true,
            media: {
                audio: true,
                video: {
                    mandatory: {
                        maxWidth: conferenceInfo.videoConstraints.width,
                        maxHeight: conferenceInfo.videoConstraints.height,
                        maxFrameRate: conferenceInfo.videoConstraints.frameRate
                    },
                    optional: []
                }
            }
        }),
        conference = {
            info: conferenceInfo,
            sendLocalPeerPrivacyUpdate: function (to) {
                conference.sendPeerAttributesUpdate(conferenceInfo.localPeer, {
                    privacy: conferenceInfo.localPeer.privacy
                }, to);
            },
            sendPeerAttributesUpdate: function (peer, attributes, to) {
                var swrtcPeer, message = {};
                message[peer.id] = attributes;
                if (to) {
                    if (to.channels) {
                        swrtcPeer = to;
                    } else {
                        swrtcPeer = findPeer(peer.id);
                    }
                    swrtcPeer.send(UPDATE_ATTRS_MESSAGE, message);
                } else {
                    webRTC.sendToAll(UPDATE_ATTRS_MESSAGE, message);
                }
            }
        };

    function findPeer(id) {
        var peers = webRTC.getPeers();
        for (var i = 0; i < peers.length; i++) {
            if (peers.id === id) {
                return peers[i];
            }
        }
    }

    localVideoElement.autoplay = true;

    $rootScope.conferenceInfo = conferenceInfo;

    webRTC.on('connectionReady', function (localId) {
        console.log('=================================== Got connectionReady event', arguments);
        localVideoElement.id = localId;
        conferenceInfo.localPeer.id = localId;
    });
    webRTC.on('readyToCall', function () {
        console.log('=================================== Got readyToCall event', arguments);
        webRTC.joinRoom('AsayaaPOC');
    });
    webRTC.on('joinedRoom', function (roomName) {
        console.log('=================================== Got joinedRoom event', arguments, webRTC);
        conferenceInfo.room = {
            name: roomName
        };
        conferenceInfo.participants[conferenceInfo.localPeer.id] = conferenceInfo.localPeer;
        $rootScope.safeApply();
        conference.sendLocalPeerPrivacyUpdate();
    });

    webRTC.on('createdPeer', function (peer) {
        console.log('=================================== Got createdPeer event', arguments);
        conferenceInfo.participants[peer.id] = {
            id: peer.id,
            privacy: false
        };
        $rootScope.safeApply();
        conference.sendLocalPeerPrivacyUpdate(peer);
    });

    webRTC.on('videoAdded', function (videoEl, peer) {
        console.log('=================================== Got videoAdded event', arguments);
        var participant = conferenceInfo.participants[peer.id];
        participant.video = peer.videoEl;
        $rootScope.safeApply();
    });

    webRTC.on('videoRemoved', function (videoEl, peer) {
        console.log('=================================== Got videoRemoved event', arguments);
        delete conferenceInfo.participants[peer.id];
        $rootScope.safeApply();
    });

    webRTC.connection.on('message', function (message) {
        var attrChangeMessage;
        if (message.type === UPDATE_ATTRS_MESSAGE) {
            console.log('=================================== Got message event', message);
            attrChangeMessage = message.payload;
            angular.forEach(attrChangeMessage, function (attrs, id) {
                var peer = conferenceInfo.participants[id];
                if (peer) {
                    angular.extend(peer, attrs);
                }
            });
            $rootScope.safeApply();
        }
    });

    webRTC.on('stunservers', function () {
        console.log('=================================== Got stunservers event', arguments);
    });
    webRTC.on('turnservers', function () {
        console.log('=================================== Got turnservers event', arguments);
    });
    webRTC.on('localScreenAdded', function () {
        console.log('=================================== Got localScreenAdded event', arguments);
    });
    webRTC.on('leftRoom', function () {
        console.log('=================================== Got leftRoom event', arguments);
    });
    webRTC.on('localMediaError', function () {
        console.log('=================================== Got localMediaError event', arguments);
    });
    webRTC.on('unshareScreen', function () {
        console.log('=================================== Got unshareScreen event', arguments);
    });
    webRTC.on('error', function () {
        console.log('=================================== Got error event', arguments);
    });

    return conference;
});
