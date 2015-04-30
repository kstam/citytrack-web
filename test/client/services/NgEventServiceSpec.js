'use strict';

require('client/shims/angular');
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

    describe('exposes off method that', function() {
        it('should allow de-registering an event handler when the eventHandler is passed', function() {
            var eventHandler = function() {};
            ngEventService.on('event', eventHandler);
            expect(ngEventService.off('event', eventHandler)).to.equal(1);
        });

        it('should return zero when the given handler is not found', function() {
            var eventHandler = function() {};
            var otherEventHandler = function() {};
            ngEventService.on('event', eventHandler);
            expect(ngEventService.off('event', otherEventHandler)).to.equal(0);
        });

        it('should return the correct amound when removing multiple listeners', function() {
            var eventHandler = function() {};
            ngEventService.on('event', eventHandler);
            ngEventService.on('event', eventHandler);
            expect(ngEventService.off('event', eventHandler)).to.equal(2);
        });
    });

    describe('exposes once method that', function() {
        it('should fire the listener only one time', function() {
            var eventHandler = sinon.spy();
            ngEventService.once('event', eventHandler);
            ngEventService.broadcastEvent('event');
            ngEventService.broadcastEvent('event');
            ngEventService.broadcastEvent('event');
            expect(eventHandler).to.have.callCount(1);
        });
    });
});
