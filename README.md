# musdash.js - Stupidly quick logic-less {{mustache}} templates for JavaScript

musdash.js is an implementation of the [Mustache](http://mustache.github.com/) template system for JavaScript.

musdash.js was designed to be extremely fast at compiling and parsing {{mustache}} templates and is almost completely compatible with mustache.js except for a few little things.

## Usage

Here is an example of how to use musdash.js:

	var view = {
		data: [ 
			{ first: "Jane", last: "Doe" }, 
			{ first: "Joe", last: "Blogs" }
		],
		bold: function( text )
		{
			return '<b>' + text + '</b>';
		}
	};

	var template = Musdash.compile( '<ul>{{#data}}<li>{{#bold}}{{first}}{{/bold}} {{last}}</li>{{/data}}</ul>' );
	var output = template.parse( view );

	// `template` can be used as many times as necessary to avoid re-compiling (even though compiling is super fast anyway)

## Links

[Comparison of speed against mustach.js](http://jsperf.com/musdash-js-vs-mustache-js/4)
	
[Test cases](http://tocsick.github.com/musdash.js/test)

## Restrictions

Currently musdash.js supports most of the same features of mustache.js. The big one missing is partials, these are coming soon.

## Differences

musdash.js handles functions a little differently, see the example usage above for clarification.

## Note

musdash.js is still an infant and care should be taken using it in a production environment.