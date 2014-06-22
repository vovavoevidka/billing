(function(window, document) {
    'use strict';
    var app = window.app;

    app.factory('Friends', function() {
        var friends = [{
            id: 0,
            name: 'Scruff McGruff'
        }, {
            id: 1,
            name: 'G.I. Joe'
        }, {
            id: 2,
            name: 'Miss Frizzle'
        }, {
            id: 3,
            name: 'Ash Ketchum'
        }];

        return {
            all: function() {
                return friends;
            },
            get: function(friendId) {
                // Simple index lookup
                return friends[friendId];
            }
        }
    });

}(window, document));