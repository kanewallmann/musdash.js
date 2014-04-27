/*!
 * musdash.js - Stupidly quick logic-less {{mustache}} templates for JavaScript
 * Some code borrowed from: http://github.com/janl/mustache.js
 */

var Mustache = (typeof module !== "undefined" && module.exports) || {};

(function (exports) {

    exports.name = "musdash.js";
    exports.version = "0.1.6-dev";
    exports.compile = compile;
    exports.options = options;
    exports.render = render;
    
    var regx = /&(?!\w+;)|[<>"']/g;
    
    var escapeMap = {
        "&" : "&amp;",
        "<": "&lt;",
        ">" : "&gt;",
        '"' : '&quot;',
        "'" : '&#39;'
    };
            
    var opts = {
        open: '{{',
        close: '}}',
        cache: true
    };
    
    var cache = {};
    
    function render( template, view, partials )
    {
        var tpl = _compile( template );
        return tpl.parse( view, partials );
    }
    
    function options( val )
    {
        for( var key in val )
            this.opts[key] = val[key];
    }
    
    function proc( code, name, inverted, content )
    {
        this.code = code;
        this.name = name;
        this.inverted = inverted;
        this.content = content;

        this.parse = function( view, partials )
        {
            return this._render( [view], partials );
        };
        
        this._dorender = function( scope, partials )
        {
            var a = 1;
            var l = this.code.length;
            var res = this.code[0];
            
            for( ; a < l; a += 2 )
            {
               if( this.code[a] !== null )
                   res += this.code[a]._render( scope, partials );

               if( a != l-1 )
            	   res += this.code[a+1];
            }
            
            return res;
        };

        this._render = function( stack, partials )
        {
            var a = 0;
            
            var current = stack[0];
            
            if( this.name !== null )
            {
                for( ; a < stack.length; a++ )
                {
                    if( stack[a][this.name] !== undefined )
                    {
                        current = stack[a][this.name];
                        break;
                    }
                }
            }

            if( typeof current == "function" )
            {
                var writer = current.apply( null );
                
                return writer.apply( null, [ this.content, function( text ){ return _compile( text )._render( stack, partials ); } ] );
            }
            else if( current instanceof Array )
            {
                var res = "";
                var count = current.length;
      
                if( count === 0 )
                {
                    if( !this.inverted ) return "";

                    return this._dorender( stack, partials );
                }
                else
                {
                    if( this.inverted ) return "";

                    for( a = 0; a < count; a++ )
                    {
                        stack.unshift( current[a] );
                        stack[0]._i = a+1;
                        stack[0]._c = count;
                        res += this._dorender( stack, partials );
                        stack.shift();
                    }
                }

                return res;
            }
            else
            {
                if( this.name !== null )
                    stack.unshift( current );
                
                return this._dorender( stack, partials );
            }
        };
    }

    function partial( name )
    {
        this.name = name;
        
        this._render = function( stack, partials )
        {
            var partial = partials[ name ];
            
            if( partial === undefined ) throw new Error( 'Partial `' + name + '` is not defined' );
            
            return _compile( partial ).parse( stack );
        };
    }
    
    function value( name, escape )
    {
        this.name = name;
        this.escape = escape;

        this._render = function( stack, partials )
        {
            var val = this._findSymbol( stack, this.name );

            if( val === null ) return "";

            if( typeof val == "function" )
                return val.apply( stack[0], [] );
            else
                return this.escape ? escapeHTML( val ) : val;
        };

        this._findSymbol = function( stack, symbol )
        {
            if( symbol == '.' ) return stack[0];

            // Quick out (most common)
            if( stack[0][symbol] !== undefined )
                return stack[0][symbol];
            
            var names = symbol.split( '.' );
            var names_count = names.length;

            for( var a = 0, len = stack.length; a < len; a++ )
            {
                var t = stack[a];
                
                for( var b = 0; b < names_count; b++ )
                {                    
                    t = t[names[b]];

                    if( t === undefined ) break;
                }

                if( t !== undefined ) return t;
            }

            return null;
        };
    }

    function escapeHTML( string )
    {
        return new String(string).replace( regx, function( s )
        {
            return escapeMap[s] || s;
        });
    }
    
    function compile( template )
    {
    	var tpl = _compile( template );
    	return function( view, partials ){ return tpl.parse( view, partials ); }
    }
    
    function _compile( template )
    {
        if( opts.cache )
        {
            var compiled = cache[ template ];
            
            if( compiled !== undefined )
                return compiled;
        }
        
        var delim = template.indexOf( opts.open + '=' );
        
        var parts = [];
        
        var open = opts.open;
        var close = opts.close;
                
        var delim_part, delim_parts, delim_trim, part, left_parts, i;
        
        while( delim != -1 )
        {
        	if( open == close )
        		throw new Error( 'Delimeters cannot be the same' );
        	
        	if( delim != 0 )
        	{
        		if( parts.length % 2 == 1 )
        			parts.push( '' );
        		
	        	part = template.substring( 0, delim );
	        	
	        	left_parts = part.split( open );
	        	
	        	for( i in left_parts )
	    		{
	        		parts = parts.concat( left_parts[i].split( close ) );
	    		}
	        	
	            if( parts.length % 2 == 1 )
	    			parts.push( '' );
        	}
             
        	if( delim != template.length )
        	{
	        	delim_part = template.substring( delim );
	        	delim_part = delim_part.substring( open.length + 1 );
	        	delim_part = delim_part.substring( 0, delim_part.indexOf( '=' + close ) );
	        	
	        	delim_parts = delim_part.split( ' ' );
	        
	        	delim_trim = delim + open.length + 2 + close.length;
	        	
	        	open = delim_parts[0];
	        	close = delim_parts[1];
	        	
	        	delim_trim += open.length + close.length + 1;
	
	        	template = template.substring( delim_trim );
        	}
        	
        	delim = template.indexOf( open + '=' );
        }
        
        if( open == close )
    		throw new Error( 'Delimeters cannot be the same' );
        		    	
    	var left_parts = template.split( open );
    	
    	for( i in left_parts )
		{
    		parts = parts.concat( left_parts[i].split( close ) );
		}
        
        var l = parts.length;
        var a = 1;
        var c, content;
        
        var scope = {
            code: [ parts[0] ],
            parent: null,
            content: parts[0],
            name: null,
            inverted: false,
        };
        
        for( ; a < l; a+=2 )
        {
        	part = parts[ a ];
    	
            c = part[0];
            
            content = opts.open + part;
            
            if( c == '/' )
            {
                if( '/' + scope.name != part ) throw new Error( "Expecting `/" + scope.name + "` not `" + part + "`" );
                scope.parent.code.push( new proc( scope.code, scope.name, scope.inverted, scope.content ) );
                scope.parent.content+=scope.content;
                scope = scope.parent;
                scope.content += content;
            }
            else
            {
                scope.content += content;
                
                if( c == '#' )
                {
                    scope = { code : [], parent : scope, name : part.substring( 1 ), inverted : false, content: "" };
                }
                else if( c == '^' )
                {
                    scope = { code : [], parent : scope, name : part.substring( 1 ), inverted : true, content: "" };
                }
                else if( c == '>' )
                {
                    scope.code.push( new partial( part.substring( 1 ) ) );
                }
                else if( c == '!' )
                {
                    scope.code.push( null );
                }
                else if( c == '&' )
                {
                    scope.code.push( new value( part.substring( 1 ), false ) );
                }
                else if( c == '{' )
                {
                    if( parts[a+1][0] == '}' )
                    {
                        scope.code.push( new value( part.substring( 1 ), false ) );
                        parts[a+1] = parts[a+1].substring( 1 );
                    }
                    else
                    {
                        scope.code.push( new value( part.substring( 1 ), true ) );
                    }
                }
                else
                {
                    scope.code.push( new value( part, true ) );
                }
            }

            if( a < l-1 )
            	scope.code.push( parts[ a+1 ] );
        }

        if( scope.parent !== null ) throw new Error( "`" + scope.name + "` was left open" );

        var ret = new proc( scope.code, null, null, scope.content );
        
        if( opts.cache )
            cache[ template ] = ret;
        
        return ret;
    }
    
})(Mustache);