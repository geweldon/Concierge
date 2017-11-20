angular.module('mm.foundation.drilldownMenu', [])
.directive('drilldownMenu', ($compile, $timeout) => {
    'ngInject';
    return {
        bindToController: {},
        scope: {},
        restrict: 'A',
        controllerAs: 'vm',
        controller: function controller($scope, $element) {
            'ngInject';
            const vm = this;

            vm.maxHeight = -1;
            vm.maxWidth = -1;
            vm.childMenus = [];

            vm.openMenu = openMenu;
            vm.closeMenu = closeMenu;
            vm.reportChild = reportChild;

            vm.$postLink = $postLink;
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
            const elementWrapper = angular.element(wrapper);
            $element.wrap(elementWrapper);
        }

        /**
         * Compile the element so that angular knows about it and will apply the
         * the li directive below
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
     * Called when everything is finished linking.  We use this to calculate the
     * height of the sub mnenus so that we can size the wrapper div appropriately
     * so that the largest submenu is visible.
     */
    function $postLink() {
        const vm = this;
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

        const parent = vm.$element.parent();

        parent.css(css);
    }
})
.directive('ul', ($compile) => {
    'ngInject';
    return {
        require: '?^^drilldownMenu',  // Must be in an ancestor UL, not *this* UL
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
            const backButton = '<li class="js-drilldown-back"><a tabindex="0">Back</a></li>';
            elementBack = angular.element(backButton);
            $element.prepend(elementBack);

            /**
             * Compile the element so that angular knows about it and will apply the
             * the li directive below
             */
            $compile(elementBack)($scope);
        }

        /**
         * Add the event handler to the `back` element (whether added or existing)
         */
        elementBack.on('click', (event) => {
            drilldownMenu.closeMenu($element);
            event.stopImmediatePropagation();
            event.preventDefault();
        });

        /**
         * Report this element to the controller for tracking
         */
        drilldownMenu.reportChild($element);

        /**
         * Now set the styles
         */
        $element.addClass(
            'menu vertical nested submenu is-drilldown-submenu ' +
            'drilldown-submenu-cover-previous invisible'
        );

        /**
         * Find the parent LI, and set the event handler to open this level
         */
        const parent = $element.parent();
        parent.addClass('is-drilldown-submenu-parent');
        parent.on('click', (event) => {
            drilldownMenu.openMenu($element);
            // $element.attr('data-is-click', 'true');
            event.stopImmediatePropagation();
            event.preventDefault();
        });
    }
});
