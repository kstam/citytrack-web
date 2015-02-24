'use strict';

require('angular');
var sinon = require('sinon');
var expect = require('../../testCommons/chaiExpect');
var NgEventService = require('client/services/NgEventService');

describe('NgEventService', function() {
    var ngEventService, $rootScope;

    beforeEach(function() {
        var $injector = angular.injector(['ng']);
        $rootScope = $injector.get('$rootScope');
        ngEventService = NgEventService($rootScope);
    });

    describe('exposes broadcastEvent method that', function() {
        it('fires given event under the $rootScope', function() {
            $rootScope.$broadcast = sinon.spy();
            ngEventService.broadcastEvent('event');
            expect($rootScope.$broadcast).to.have.been.calledWith('event');
        });

        it('does not accept non string object as the first parameter', function() {
            expect(function() {
                ngEventService.broadcastEvent(123);
            }).to.throw();
        });

        it('can broadcast an event with multiple arguments', function() {
            $rootScope.$broadcast = sinon.spy();
            ngEventService.broadcastEvent('event', 1, 2);
            expect($rootScope.$broadcast).to.have.been.calledWith('event', 1, 2);
        });
    });

    describe('exposes on method which allows subscribing to events and', function() {
        it('correctly propagates events', function() {
            var spy = sinon.spy();
            ngEventService.on('thisEvent', spy);

            ngEventService.broadcastEvent('thisEvent', 1);
            expect(spy).to.have.callCount(1);
        });

        it('throws error if callback is not a function', function() {
            expect(function() {
                ngEventService.on('eventName', {})
            }).to.throw();
        });

        it('throws error if eventName is not a string', function() {
            expect(function() {
                ngEventService.on(123, function() {
                })
            }).to.throw();
        });

        it('throws error if eventName empty string', function() {
            expect(function() {
                ngEventService.on('', function() {
                })
            }).to.throw();
        });
    });
});
