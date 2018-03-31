A directive that provides the [Foundation Drilldown Menu](http://foundation.zurb.com/sites/docs/drilldown-menu.html) component.

The directive relies on the same markup as the original Foundation Drilldown Menu. It implements some, but not all of the features of the Foundation Drilldown Menu.

See the demo page for example on how to use this and visit the [Foundation docs](http://foundation.zurb.com/sites/docs/drilldown-menu.html) for more details.

#### Supported Features:
- Automatically add a wrapper div around the menu, _if not already provided in the html_.
- Automatically add _back_ entries to the top of submenus, _if not already provided in the html_.
- Wrapper div sized to the min-height required to show the largest sub-menu.
  - Automatically resizes as the viewport size changes.
  - WARNING: show/hide via `ng-show` or similar **DOES NOT** cause a resize.  See notes below.
- API exposed via `drilldown-menu-api` two-way binding.
- Events `emit`-ed on the $scope (i.e. upwards towards parent scopes).

#### API
The API for programmatic control of the drilldown menu is exposed to the parent
scope via the `drilldown-menu-api` two-way binding. See the 3rd example html and
associated js for an example.

The available methods are:
- `resizeMenu()` to trigger a resize.
- `show(element)` to show the submenu under the given _angular.element_.
- `hide(element)` to hide the submenu under the given _angular.element_.
- `hideAll()` to collapse all submenus.

#### Events
The controller `emit-s` events on the $scope (i.e. upwards towards the parent scope).  The available events are similarly named to the Foundation for Sites equivalents.
- `'resize.mm.foundation.drilldownMenu'` when the menu resizes. The event listener function format is `function(event, menuElement)`:
    - `event` - Standard [Angular `event` object](https://code.angularjs.org/1.6.5/docs/api/ng/type/$rootScope.Scope#$on)
    - `menuElement` - [angular.element](https://code.angularjs.org/1.6.5/docs/api/ng/function/angular.element) for the top level _UL_ element of the menu.
- `'open.mm.foundation.drilldownMenu'` when a submenu is opened. The event listener function format is `function(event, menuElement, submenuElement)`:
    - `event` - Standard [Angular `event` object](https://code.angularjs.org/1.6.5/docs/api/ng/type/$rootScope.Scope#$on)
    - `menuElement` - [angular.element](https://code.angularjs.org/1.6.5/docs/api/ng/function/angular.element) for the top level _UL_ element of the menu.
    - `submenuElement` - [angular.element](https://code.angularjs.org/1.6.5/docs/api/ng/function/angular.element) for the _UL_ element at the top of the submenu that has just been opened.
- `'hide.mm.foundation.drilldownMenu'` when a submenu is closed. The event listener function format is `function(event, menuElement, submenuElement)` as above.

#### Usage Notes
Be careful when dynamically showing and hiding this component.  The component only resizes when created, when the viewport size changes, or when the resize() API is triggered. If it is hidden via css when created it will initialse with 0 height and width.  If it is then shown (using `ng-show` or similar), it will remain as 0 height and width and thus not appear to be visible!

This can be resolved by using the API to resize as part of the reveal.

Alternatively, use `ng-if` instead of `ng-show`.  This re-creates the component when showing, and
thus the size is set correctly as part of the initialisation.

#### NOT implemented:
The following features of the Foundation Drilldown Menu are NOT implemented:
- _back_ entries at the bottom of submenus.
- templates for auto-added _back_ entries.
- `autoHeight`.
- `ScrollTop`.
- Handling of keyboard events (up/down/etc.)
- Automatic addition of aria attributes.
- Any of the plugin options.
- `scrollme` and `closed` events.
- `_scrollTop` and `_destroy` methods.
