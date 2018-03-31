angular.module('mm.foundation.drilldownMenu', [])
.directive('drilldownMenu', ($compile, $timeout, $window) => {
    'ngInject';
    const EVENT_BASE = 'mm.foundation.drilldownMenu';

    return {
        bindToController: {
            drilldownMenuApi: '=?',
        },
        scope: {},
        restrict: 'A',
        controllerAs: 'vm',
        controller: function controller($scope, $element) {
            'ngInject';
            const vm = this;

            vm.maxHeight = -1;
            vm.maxWidth = -1;
            vm.childMenus = [];
            vm.generatedWrapper = null;

            vm.reportChild = reportChild;

            vm.$onInit = $onInit.bind(vm, $scope, $element);
            vm.$postLink = $postLink;
            vm.$onDestroy = $onDestroy;
        },
        link: dmLinkFunction,
    };

    /**
     * Link function for `ul` which heads up the drilldown menu.
     * We use this to add the wrapper element around the menu
     *
     *
     * @param {Object} $scope           - The scope for this directive
     * @param {Object} $element         - The element the directive is attached to
     * @param {any[]} $attrs            - The attributes list for the element
     * @param {?Object} drilldownMenu   - The drilldownMenu controller
     */
    function dmLinkFunction($scope, $element, $attrs, drilldownMenu) {
        if (!drilldownMenu) {
            return;
        }

        /**
         * Check if our parent is already a wrapper div with the right class
         */
        const parent = $element.parent();
        if (
            !parent ||
            !parent[0] ||
            parent[0].nodeName !== 'DIV' ||
            !parent.hasClass('is-drilldown')
        ) {
            /**
             * Add a wrapper element to hide the overflowed menu items
             */
            const wrapper = '<div class="is-drilldown"></div>';
            drilldownMenu.generatedWrapper = angular.element(wrapper);
            $element.wrap(drilldownMenu.generatedWrapper);
        }

        /**
         * Store the root element so we have access to it elsewhere
         */
        drilldownMenu.$element = $element;
    }

    /**
     * Opens the UL representing the menu.
     *
     * @param {Object} ulChild  - The child UL menu to open
     */
    function openMenu(ulChild) {
        ulChild.removeClass('invisible');
        ulChild.addClass('is-active');

        this.EVENTS._emitEvent(this.EVENTS.open, ulChild);
    }

    /**
     * Closes the UL representing the menu.
     *
     * @param {Object} ulParent - The UL parent menu to close
     */
    function closeMenu(ulParent) {
        ulParent.addClass('is-closing');
        ulParent.one('transitionend', () => {
            ulParent.removeClass('is-active is-closing');
            ulParent.addClass('invisible');
        });

        this.EVENTS._emitEvent(this.EVENTS.hide, ulParent);
    }

    /**
     * Returns to the top level in the menu.
     */
    function doCloseAll(vm) {
        for (let i = 0; i < vm.childMenus.length; ++i) {
            const child = vm.childMenus[i];
            if (child.hasClass('is-active')) {
                vm.drilldownMenuApi.hide(child);
            }
        }
    }

    /**
     * The main controller gets notified of child menus so that it can manage
     * them appropriately.
     *
     * @param {Object} child   - the child element (as an angular.element).
     */
    function reportChild(child) {
        this.childMenus.push(child);
    }

    /**
     * Does a resize of the control based on the dimensions of the largest
     * submenu (or the top level if its the biggest(.
     *
     * @param {Object} vm   - the view model for this directive
     */
    function doResize(vm) {
        const parent = vm.$element.parent();

        /**
         * Reset any hardcoded styles so the children can achieve their natural size
         */
        parent.css({
            'max-width': 'none',
            'min-height': 'none',
        });
        vm.maxHeight = -1;
        vm.maxWidth = -1;

        /**
         * Calculate the height of each menu and work out the maxes.
         */
        function sizeChild(child) {
            const rect = child[0].getBoundingClientRect();
            vm.maxHeight = Math.max(vm.maxHeight, rect.height);
            vm.maxWidth = Math.max(vm.maxWidth, rect.width);
        }
        sizeChild(vm.$element);
        angular.forEach(vm.childMenus, sizeChild);

        /**
         * Turn the sizes into css and apply to the wrapper element (so the
         * largest submenus are fully visible when shown and don't jump around)
         */
        const css = {
            minHeight: `${vm.maxHeight}px`,
            maxWidth: `${vm.maxWidth}px`,
        };

        parent.css(css);

        /**
         * Emit an event to say we have been resized
         */
        vm.drilldownMenuApi.EVENTS._emitEvent(vm.drilldownMenuApi.EVENTS.resize);
    }

    /**
     * Called to initialise the directive.
     * We use this to setup to the API once the binding has been initialised
     *
     * @param {Object} $scope   - the current scope
     * @param {Object} $element - the element
     */
    function $onInit($scope, $element) {
        const vm = this;
        vm.drilldownMenuApi = {
            show: openMenu,
            hide: closeMenu,
            hideAll: function hideAll() {
                return doCloseAll(vm);
            },
            resizeMenu: function resizeMenu() {
                return doResize(vm, $scope);
            },

            EVENTS: {
                resize: `resize.${EVENT_BASE}`,
                open: `open.${EVENT_BASE}`,
                hide: `hide.${EVENT_BASE}`,

                _emitEvent: emitEvent.bind(vm, $scope, $element),
            },
        };
    }

    /**
     * Called when everything is finished linking.  We use this to calculate the
     * height of the sub mnenus so that we can size the wrapper div appropriately
     * so that the largest submenu is visible.
     */
    function $postLink() {
        const vm = this;

        /**
         * Set the sizes the first time
         */
        doResize(vm);

        /**
         * Handle window resizes and do it whenever the window size changes.
         */
        angular.element($window).on('resize', vm.drilldownMenuApi.resizeMenu);
    }

    /**
     * Called when we are being destroyed.
     *  We use this to do cleanup of the various changes we made
     */
    function $onDestroy() {
        const vm = this;

        /**
         * Remove the resize event handler
         */
        angular.element($window).off('resize', vm.drilldownMenuApi.resizeMenu);

        /**
         * Find out if we need to remove the generated wrapper element
         */
        if (vm.generatedWrapper) {
            delete vm.generatedWrapper;
        }

        /**
         * Cleanup the API functions as they hold the controller by context
         * and stop the controller deleting properly
         */
        delete vm.drilldownMenuApi.hideAll;
        delete vm.drilldownMenuApi.resizeMenu;
        delete vm.drilldownMenuApi.EVENTS._emitEvent;
        vm.drilldownMenuApi = {};

        delete vm.$onInit;
    }

    /**
     * Wrapper for $emit to simplify including the base element to identify
     * the source of our emits.
     *
     * @param {Object} $scope               - The scope
     * @param {angular.element} $element    - The element at the top of the menu
     * @param {string} name                 - The name of the event to emit
     * @param {...*} args                   - optional list of arguments to pass on
     */
    function emitEvent($scope, $element, name, ...args) {
        //
        // Add our root element as the first extra argument
        //
        const newArgs = [$element].concat(args);
        $scope.$emit(name, ...newArgs);
    }
})
.directive('ul', ($compile) => {
    'ngInject';
    return {
        require: '?^^drilldownMenu', // Must be in an ancestor UL, not *this* UL
        restrict: 'E',
        link: ulLinkFunction,
    };

    /**
     * Link function for `ul` which may (or may not) be in a drilldown menu.
     * We use this to add in the li for moving backwards in the list, and set
     * the appropriate styles and click handlers.
     *
     * NOTE: we require the `drilldownMenu` control to be in an ancestor UL because
     *       the top level menu doesn't need an automatically added back entry.
     *
     * @param {Object} $scope           - The scope for this directive
     * @param {Object} $element         - The element the directive is attached to
     * @param {any[]} $attrs            - The attributes list for the element
     * @param {?Object} drilldownMenu   - The drilldownMenu controller (if any)
     */
    function ulLinkFunction($scope, $element, $attrs, drilldownMenu) {
        if (!drilldownMenu) {
            return;
        }

        /**
         * Check if the dom already contains a "back" link with the right class
         */
        let elementBack = null;
        let generatedBack = false;
        const children = $element.children();
        for (let i = 0; i < children.length; ++i) {
            const elementChild = angular.element(children[i]);
            if (
                elementChild[0].nodeName === 'LI' &&
                elementChild.hasClass('js-drilldown-back')
            ) {
                elementBack = elementChild;
            }
        }

        if (!elementBack) {
            /**
             * No existing one, so add in the automatic `back` element
             */
            generatedBack = true;
            const backButton = '<li class="js-drilldown-back"><a tabindex="0">Back</a></li>';
            elementBack = angular.element(backButton);
            $element.prepend(elementBack);

            /**
             * Compile the element so that angular knows about it
             */
            $compile(elementBack)($scope);
        }

        /**
         * Add the event handler to the `back` element (whether added or existing)
         */
        function onClickBack(event) {
            drilldownMenu.drilldownMenuApi.hide($element);
            event.stopImmediatePropagation();
            event.preventDefault();
        }
        elementBack.on('click', onClickBack);

        /**
         * Report this element to the controller for tracking
         */
        drilldownMenu.reportChild($element);

        /**
         * Now set the styles
         */
        const elementClasses =
            'vertical nested submenu is-drilldown-submenu ' +
            'drilldown-submenu-cover-previous invisible';
        $element.addClass(elementClasses);

        /**
         * Find the parent LI, and set the event handler to open this level
         */
        const parent = $element.parent();
        parent.addClass('is-drilldown-submenu-parent');

        function onClickOpen(event) {
            drilldownMenu.drilldownMenuApi.show($element);
            event.stopImmediatePropagation();
        }
        parent.on('click', onClickOpen);

        /**
         * Handler for $destroy event
         */
        $scope.$on('$destroy', () => {
            /**
             * Remove the open event handler from our parent.
             */
            parent.off('click', onClickOpen);

            /**
             * Remove the back event handler
             */
            elementBack.off('click', onClickBack);

            /**
             * Remove any back element we dynamically added in
             */
            if (generatedBack) {
                elementBack.remove();
            }

            /**
             * Remove the classes we added to the element
             */
            $element.removeClass(elementClasses);
        });
    }
});
