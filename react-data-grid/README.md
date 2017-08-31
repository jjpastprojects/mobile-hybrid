Installation
------------

```sh
npm install react-data-grid
```

This library is written with CommonJS modules. If you are using
browserify, webpack, or similar, you can consume it like anything else
installed from npm.

Overview 
--------
ReactDataGrid is an advanced JavaScript spreadsheet-like grid component built using React

Exported Modules
--------
ReactDataGrid exposes two possible modules, `react-data-grid` and `react-data-grid/addons`.
What's included in each module depends on ReactDataGrid's version you're using.
We have made a major change to this in v1, so please read below.

### 0.X.X

  - You can import `react-data-grid` **or** `react-data-grid/addons`  depending if you want to have access to the add-ons or not. 
  - `react-data-grid/addons` contains `react-data-grid` so in 0.X.X you *only* need to imort this module to get the addon extras *and* the grid itself.
  - `react-data-grid/addons` points to `react-data-grid-with-addons.js` on dist folder.  
  - #### Known Issues:
    -  Some external dependencies in `react-data-grid/addons` don't offer support for older browsers like **IE8**, so you *cannot* use this on a page with IE* as babel generated script will break (using `default` and other issues that break in IE8)
    -  This also includes a much deeper set of dependencies that get bunlded, which in simple use cases, causes a lot of bloat

### 1.0.0
 We have made a breaking change, so `react-data-grid/addons` will *not* include the grid itself, it is *only* for importing the addons and you need to also import `react-data-grid`
 This solves for the issues above, as well as laying the groundwork for allowing more fine grained imports.
 This will allow you to simply include `react-data-grid/addons` to get everything, but also to include single addons (a la lodash)
  - If you just want the basic grid import `react-data-grid`
  - If you want the addons (ruich editors, etc) import `react-data-grid` **and** `react-data-grid/addons`
  - Both modules are **completely independent and can be used separately**.
  - `react-data-grid/addons` points to `react-data-grid.ui-plugins.js`` on dist folder. 

#### Migration from 0.X to 1.X
  If you previously had an import for `react-data-grid/addons` you will need to now add `react-data-grid` as well
  
Features
--------

- Lightning fast virtual rendering
- [Can render hundreds of thousands of rows with no lag]
- Keyboard navigation
- [Fully editable grid]
- [Rich cell editors like autocomplete, checkbox and dropdown editors, complete with keyboard navigation]
- Custom cell Editors - Easily create your own
- [Custom cell Formatters]
- [Frozen columns]
- [Resizable columns]
- [Sorting]
- [Filtering]
- [Context Menu]
- Copy and Paste values into other cells
- [Multiple cell updates using cell dragdown]
- [Association of events of individual columns]


Check out the `examples` directory to see how simple previously complex UI
and workflows are to create.
