angular.module('foundationDemoApp')
.controller('DrillDownDemoCtrl', function($scope, $element, $timeout, $log) {
    'ngInject';
    const vm = {
        ddmApi: null,
        shouldShow: false,
        haveShown: false,
        haveResized: false,
        alerts: [],

        showHideMenu: showHideMenu,

        showSubmenu1: showSubmenu1,
        hideSubmenu1: hideSubmenu1,

        closeAlert: closeAlert,
    };
    $scope.vm = vm;

    /**
     * Initial alert used as part of the API Usage demo
     */
    vm.alerts = [{
        type: 'alert',
        msg: 'The menu below is hidden with css. Press the button to show it (using ng-show).',
    }];

    /**
     * Event handlers for the menu events
     */
    $scope.$on('resize.mm.foundation.drilldownMenu', onMenuResized);
    $scope.$on('open.mm.foundation.drilldownMenu', onSubmenuOpen);
    $scope.$on('hide.mm.foundation.drilldownMenu', onSubmenuClosed);

    /**
     * Sets the variable to show or hide the menu block
     */
    function showHideMenu() {
        vm.shouldShow = !vm.shouldShow;

        if (!vm.haveShown) {
            closeAlert(0);
            addAlert(
                'alert',
                'The menu is now "shown", but because it was hidden initially it will start with ' +
                '"max-width: 0px" and doesn\'t appear! Press the resize button to trigger ' +
                'a resize via the API'
            );
            vm.haveShown = true;
        }
    }

    /**
     * Get the UL for submenu 1.
     * NOTE: You MUST use the UL for the submenu to show/hide, NOT the parent LI!
     *
     * @returns {angular.element}   - The element for submenu 1 in the API section
     */
    function getSubmenu1() {
        return angular.element($element[0].querySelector('ul#drilldown-api-submenu-1'));
    }

    /**
     * Function to use the API to open a specific menu item
     */
    function showSubmenu1() {
        //
        // Find the item
        //
        var element = getSubmenu1();

        //
        // Use the API to open it
        //
        vm.ddmApi.show(element);
    }

    /**
     * Function to use the API to close a specific menu item
     */
    function hideSubmenu1() {
        //
        // Find the item
        //
        var element = getSubmenu1();

        //
        // Use the API to open it
        //
        vm.ddmApi.hide(element);
    }

    /**
     * Handler for the resized event from the menu
     *
     * @param {Object} event                - Angular `event` object (see $rootScope.$on)
     * @param {angular.element} menuElement - The root element of the menu
     */
    function onMenuResized(event, menuElement) {
        if (menuElement.attr('id') !== 'drilldown-api-menu') {
            return; // One of the other menus
        }
        if (vm.haveShown && !vm.haveResized) {
            closeAlert(0);
            addAlert(
                'success',
                'Congratulations! The menu should now be visible!'
            );
            addAlert(
                'alert',
                'The same 0-width problem will happen again if the menu is hidden then ' +
                'resized (via the API or via a viewport size change). ' +
                'You MUST trigger a resize via the API after showing it again if this happens.'
            );
            vm.haveResized = true;
        }
    }

    /**
     * Example handler for the submenu open event
     *
     * @param {Object} event                    - Angular `event` object (see $rootScope.$on)
     * @param {angular.element} menuElement     - The root element of the menu
     * @param {angular.element} submenuElement  - The submenu element that has just opened
     */
    function onSubmenuOpen(event, menuElement, submenuElement) {
        if (submenuElement.attr('id') === 'drilldown-api-submenu-1') {
            $log.log('Submenu 1 has been opened!');
        }
    }

    /**
     * Example handler for the submenu close event
     *
     * @param {Object} event                    - Angular `event` object (see $rootScope.$on)
     * @param {angular.element} menuElement     - The root element of the menu
     * @param {angular.element} submenuElement  - The submenu element that has just closed
     */
    function onSubmenuClosed(event, menuElement, submenuElement) {
        if (submenuElement.attr('id') === 'drilldown-api-submenu-1') {
            $log.log('Submenu 1 has been closed!');
        }
    }

    /**
     * Closes the specific alert
     *
     * @param {number} index    - The index of the alert to close
     */
    function closeAlert(index) {
        vm.alerts.splice(index, 1);
    }

    /**
     * Adds a new alert programmatically.
     * Used of the explanations of the drilldown menu API and functionality.
     *
     * @param {string} type     - the type of alert
     * @param {string} msg      - the alert message
     */
    function addAlert(type, msg) {
        vm.alerts.push({ type: type, msg: msg });
    }
});
