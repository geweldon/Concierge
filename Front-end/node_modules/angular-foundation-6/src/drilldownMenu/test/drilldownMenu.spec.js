import angular from 'angular';
import mocks from 'angular-mocks';

import 'src/drilldownMenu/drilldownMenu.js';

describe('drilldownMenu', () => {
    const inject = mocks.inject;
    const module = mocks.module;

    beforeEach(module('mm.foundation.drilldownMenu'));

    let elm;
    let scope;

    /**
     * Gets the nodeName for an angular.element
     *
     * @param {Object} element  - angular.element wrapped Element
     *
     * @returns {String}        - the nodeName
     */
    function getNodeName(element) {
        return element[0] ? element[0].nodeName : '';
    }

    describe('drilldown with auto-added wrapper and back links', () => {
        beforeEach(inject(($compile, $rootScope) => {
            scope = $rootScope.$new();
            elm = $compile([
                '<ul class="drilldown menu" drilldown-menu>',
                '  <li>',
                '    <a>Item 1</a>',
                '    <ul class="menu">',
                '      <li><a href="#">Item 1A</a></li>',
                '      <li>',
                '        <a href="#">Item 1B</a>',
                '        <ul class="menu">',
                '          <li><a href="#">Item 1B i</a></li>',
                '          <li><a href="#">Item 1B ii</a></li>',
                '          <li>',
                '            <a href="#">Item 1B iii</a>',
                '            <ul class="menu">',
                '              <li><a href="#">Item 1B iii alpha</a></li>',
                '              <li><a href="#">Item 1B iii omega</a></li>',
                '            </ul>',
                '          </li>',
                '          <li>',
                '            <a href="#">Item 1B iv</a>',
                '            <ul class="menu">',
                '              <li><a href="#">Item 1B iv alpha</a></li>',
                '            </ul>',
                '          </li>',
                '        </ul>',
                '      </li>',
                '      <li><a href="#">Item 1C</a></li>',
                '    </ul>',
                '  </li>',
                '  <li>',
                '    <a href="#">Item 2</a>',
                '    <ul class="menu">',
                '      <li><a href="#">Item 2A</a></li>',
                '      <li><a href="#">Item 2B</a></li>',
                '    </ul>',
                '  </li>',
                '  <li><a href="#">Item 3</a></li>',
                '  <li><a href="#">Item 4</a></li>',
                '</ul>',
            ].join('\n'))(scope);
            scope.$apply();
            return elm;
        }));

        it('should wrap the menu in a div', () => {
            const parent = elm.parent();
            expect(parent).toHaveClass('is-drilldown');
            expect(getNodeName(parent)).toBe('DIV');
        });

        it('should set the height of the wrapper div', () => {
            const parent = elm.parent();
            const minHeight = parent.css('min-height');
            expect(minHeight).toBeDefined();
        });

        it('should set the width of the wrapper div', () => {
            const parent = elm.parent();
            const maxWidth = parent.css('max-width');
            expect(maxWidth).toBeDefined();
        });

        it('should insert a back link into the first menu', () => {
            const firstMenuBack = angular.element(elm[0].querySelector('ul > li > ul > li'));
            expect(firstMenuBack).toHaveClass('js-drilldown-back');
        });

        it('should set the text of the back link to `back`', () => {
            const backLink = angular.element(elm[0].querySelector('ul > li > ul > li > a'));
            expect(backLink).toHaveText('Back');
        });

        it('should insert 5 back links across the menu tree', () => {
            const backLinks = elm[0].querySelectorAll('li.js-drilldown-back');
            expect(backLinks.length).toBe(5);
        });
    });

    describe('drilldown with manually-added wrapper and back links', () => {
        beforeEach(inject(($compile, $rootScope) => {
            scope = $rootScope.$new();
            const fullElm = $compile([
                '<div class="is-drilldown" id="manual-wrapper">',
                '  <ul class="drilldown menu" drilldown-menu>',
                '    <li>',
                '      <a>Item 1</a>',
                '      <ul class="menu">',
                '        <li class="js-drilldown-back manual-back" id="manual-back-1">',
                '          <a href="#">Manual Back</a>',
                '        </li > ',
                '        <li><a href="#">Item 1A</a></li>',
                '        <li>',
                '          <a href="#">Item 1B</a>',
                '          <ul class="menu">',
                '            <li class="js-drilldown-back manual-back">',
                '              <a href="#">Manual Back</a>',
                '            </li > ',
                '            <li><a href="#">Item 1B i</a></li>',
                '            <li><a href="#">Item 1B ii</a></li>',
                '            <li>',
                '              <a href="#">Item 1B iii</a>',
                '              <ul class="menu">',
                '                <li><a href="#">Item 1B iii alpha</a></li>',
                '                <li><a href="#">Item 1B iii omega</a></li>',
                '              </ul>',
                '            </li>',
                '            <li>',
                '              <a href="#">Item 1B iv</a>',
                '              <ul class="menu">',
                '                <li><a href="#">Item 1B iv alpha</a></li>',
                '              </ul>',
                '            </li>',
                '          </ul>',
                '        </li>',
                '        <li><a href="#">Item 1C</a></li>',
                '      </ul>',
                '    </li>',
                '    <li>',
                '      <a href="#">Item 2</a>',
                '      <ul class="menu">',
                '        <li><a href="#">Item 2A</a></li>',
                '        <li><a href="#">Item 2B</a></li>',
                '      </ul>',
                '    </li>',
                '    <li><a href="#">Item 3</a></li>',
                '    <li><a href="#">Item 4</a></li>',
                '  </ul>',
                '</div>',
            ].join('\n'))(scope);
            scope.$apply();

            /**
             * For consistency with the previous tests, we still return the UL level,
             * not the div wrapper.
             */
            elm = angular.element(fullElm[0].querySelector('ul'));
            return elm;
        }));

        it('should keep the manually added div', () => {
            const parent = elm.parent();
            expect(parent).toHaveClass('is-drilldown');
            expect(parent.attr('id')).toBe('manual-wrapper');
        });

        it('should set the height of the wrapper div', () => {
            const parent = elm.parent();
            const minHeight = parent.css('min-height');
            expect(minHeight).toBeDefined();
        });

        it('should set the width of the wrapper div', () => {
            const parent = elm.parent();
            const maxWidth = parent.css('max-width');
            expect(maxWidth).toBeDefined();
        });

        it('should keep the back link in the first menu', () => {
            const firstMenuBack = angular.element(elm[0].querySelector('ul > li > ul > li'));
            expect(firstMenuBack).toHaveClass('js-drilldown-back');
            expect(firstMenuBack).toHaveClass('manual-back');
            expect(firstMenuBack.attr('id')).toBe('manual-back-1');
        });

        it('should keep the text of the back link', () => {
            const backLink = angular.element(elm[0].querySelector('ul > li > ul > li > a'));
            expect(backLink).toHaveText('Manual Back');
        });

        it('should keep the 2 manual back links', () => {
            const backLinks = elm[0].querySelectorAll('li.manual-back');
            expect(backLinks.length).toBe(2);
        });

        it('should insert 3 other auto back links, for a total of 5', () => {
            const backLinks = elm[0].querySelectorAll('li.js-drilldown-back');
            expect(backLinks.length).toBe(5);
        });
    });
});
