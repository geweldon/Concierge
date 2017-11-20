A directive that provides the [Foundation Drilldown Menu](http://foundation.zurb.com/sites/docs/drilldown-menu.html) component.

The directive relies on the same markup as the original Foundation Drilldown Menu. It implements some, but not all of the features of the Foundation Drilldown Menu.

#### Implemented:
- Automatically add a wrapper div around the menu, _if not already provided in the html_
- Automatically add _back_ entries to the top of submenus, _if not already provided in the html_
- Wrapper div sized to the min-height required to show the largest sub-menu

#### NOT implemented:
- _back_ entries at the bottom of submenus
- templates for auto-added _back_ entries
- `autoHeight`
- `ScrollTop`
- Handling of keyboard events (up/down/etc.)
- Automatic addition of aria attributes
- Any of the plugin options, events, or methods

See the demo page for example on how to use this and visit the [Foundation docs](http://foundation.zurb.com/sites/docs/drilldown-menu.html) for more details.
