![OpenUI5](http://openui5.org/images/OpenUI5_new_big_side.png)

# less-openui5

> Build OpenUI5 themes with [Less.js](http://lesscss.org).

## Install

```
npm install less-openui5
```

## Usage

```js
var lessOpenUI5 = require('less-openui5');

lessOpenUI5.build('@var: #ffffff; .class { color: @var; float: left }', function(err, result) {

  console.log(result.css); // => regular css
  /*
  .class {
   color: #ffffff;
   float: left;
  }
  */

  console.log(result.cssRtl); // => mirrored css for right-to-left support
  /*
  .class {
    color: #ffffff;
    float: right;
  }
  */

  console.log(result.variables); // => less variables with their values (only global ones)
  /*
  { var: "#ffffff" }
  */

  console.log(result.imports); // => paths to files imported via @import directives
  /*
  []
  */

});
```

## API

### build(input, [options,] callback)

#### input

*Required*  
Type: `string`

Input less content.

#### options

##### rtl

Type: `boolean`  
Default: `true`

Create mirrored css for right-to-left support.

##### rootPaths

Type: `array` of `string`

Root paths to use for import directives.

This option differs from the less `compiler.paths` option.  
It is useful if less files are located in separate folders but referenced as they would all be in one.  
If `rootPaths` are provided and a file can not be found, the `compiler.paths` option will be used instead.

*Note:* `parser.filename` has to be set to the path of the `input` file in order to get this working.

###### Example

```js
rootPaths: [ './lib1', './lib2' ]
```

Folder structure

```
lib1
 my
  themes
   foo
    foo.less
lib2
 my
  themes
   bar
    bar.less
```
`lib2/my/themes/bar/bar.less`
```css
@import "../foo/foo.less"; /* lib1/my/themes/foo/foo.less will be imported */
```

##### parser

Type: `object`

Options for the [less](http://lesscss.org) parser (`less.Parser`).

##### compiler

Type `object`

Options for the [less](http://lesscss.org) compiler (`tree.toCss`).

#### callback(error, result)

*Required*  
Type: `function`

##### result.css

Type: `string`

Regular css output.

##### result.cssRtl

Type: `string`

Mirrored css for right-to-left support (if rtl option was enabled).

##### result.variables

Type: `object`

Key-value map of all global less variables (without @ prefix).

##### result.imports

Type: `array`

Paths to files imported via import directives.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Lisense

[Apache License 2.0](http: //www.apache.org/licenses/LICENSE-2.0) © 2014 [SAP SE](http://www.sap.com)