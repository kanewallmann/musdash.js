// Partials

var partials = {
        
        'partial1' : 'Hello, World',
        'partial2' : '{{first}} {{second}}',
        'partial3' : '{{#bold}}{{first}}{{/bold}} {{second}}',
};

// Functions

var bold_func = function(  )
{
    return function( text,render )
    {
    	return '<b>' + render( text ) + '</b>'
    };
}

var hello_func = function()
{
    return 'Hello,';
}

var world_func = function()
{
    return 'World';
}

var concat_func = function()
{
    return this.first + " " + this.second;
}

var concat_n_func = function()
{
    return this.first + " " + this.second + ( this._i != this._c ? ', ' : '' );
}


// Tests

var tests = [
                  
     { 
         desc: "Basic", 
         view: { first: "Hello,", second: "World" },
         template: "{{first}} {{second}}",
         result: "Hello, World"
     },

     { 
         desc: "Nested", 
         view: { data: {  first: "Hello,", second: "World" } },
         template: "{{data.first}} {{data.second}}",
         result: "Hello, World"
     },

     { 
         desc: "Double Nested", 
         view: { data: { subdata: {  first: "Hello,", second: "World" } } },
         template: "{{data.subdata.first}} {{data.subdata.second}}",
         result: "Hello, World"
     },
     
     { 
         desc: "Object Loop", 
         view: { data: [ { first: "Hello,", second: "World" }, { first: "Hello,", second: "World" } ] },
         template: "{{#data}}* {{first}} {{second}}{{/data}}",
         result: "* Hello, World* Hello, World"
     },
     
     { 
         desc: "String Loop", 
         view: [ "Hello, ", "World" ],
         template: "{{.}}",
         result: "Hello, World"
     },
     
     { 
         desc: "Function (Value)", 
         view: { first: hello_func, second: world_func },
         template: "{{first}} {{second}}",
         result: "Hello, World"
     },
     
     { 
         desc: "Function (Value w/ Scope)", 
         view: { func: concat_func, data: [ { first: "Hello,", second: "World" }, { first: "Hello,", second: "World" }  ] },
         template: "{{#data}}{{func}}{{/data}}",
         result: "Hello, WorldHello, World"
     },
     
     { 
         desc: "Function (Value w/ Util Vars)", 
         view: { func: concat_n_func, data: [ { first: "Hello", second: "World" }, { first: "Hello", second: "World" }  ] },
         template: "{{#data}}{{_i}}. {{func}}{{/data}}",
         result: "1. Hello World, 2. Hello World"
     },
     
     { 
         desc: "Function (Wrapper)", 
         view: { bold: bold_func, first: "Hello,", second: "World" },
         template: "{{#bold}}{{first}}{{/bold}} {{second}}",
         result: "<b>Hello,</b> World"
     },

     { 
         desc: "Nested Function", 
         view: { bold: bold_func, data: [ { first: "Hello,", second: "World" }, { first: "Hello,", second: "World" } ] },
         template: "{{#data}}* {{#bold}}{{first}}{{/bold}} {{second}}{{/data}}",
         result: "* <b>Hello,</b> World* <b>Hello,</b> World"
     },
     
     { 
         desc: "Inversion (Without Data)", 
         view: { data: [] },
         template: "{{#data}}{{.}}{{/data}}{{^data}}No Data.{{/data}}",
         result: "No Data."
     },
     
     { 
         desc: "Inversion (With Data)", 
         view: { data: [ "Hello, ", "World" ] },
         template: "{{#data}}{{.}}{{/data}}{{^data}}No Data.{{/data}}",
         result: "Hello, World"
     },
     
     { 
         desc: "Comments", 
         view: { data: [ "Hello, ", "World" ] },
         template: "{{!comment outside loop}}{{#data}}{{!comment inside loop}}{{.}}{{/data}}",
         result: "Hello, World"
     },
          
     { 
         desc: "String Escaping (Enabled)", 
         view: { first: "<Hello>,", second: "&World&" },
         template: "{{first}} {{second}}",
         result: "&lt;Hello&gt;, &amp;World&amp;"
     },
     
     { 
         desc: "String Escaping (Disabled w/ Triple Mustache)", 
         view: { first: "<Hello>,", second: "&World&" },
         template: "{{{first}}} {{{second}}}",
         result: "<Hello>, &World&"
     },
     
     { 
         desc: "Triple Mustache Open, Double Close", 
         view: { first: "<Hello>,", second: "&World&" },
         template: "{{{first}} {{{second}}",
         result: "&lt;Hello&gt;, &amp;World&amp;"
     },
     
     { 
         desc: "String Escaping (Disabled)", 
         view: { first: "<Hello>,", second: "&World&" },
         template: "{{&first}} {{&second}}",
         result: "<Hello>, &World&"
     },
     
     { 
         desc: "Partial Basic", 
         view: {  },
         template: "{{>partial1}}",
         result: "Hello, World"
     },
     
     { 
         desc: "Partial Stack Access", 
         view: { first: "Hello,", second: "World" },
         template: "{{>partial2}}",
         result: "Hello, World"
     },
     
     { 
         desc: "Partial Function", 
         view: { bold: bold_func, first: "Hello,", second: "World" },
         template: "{{>partial3}}",
         result: "<b>Hello,</b> World"
     },
     
     { 
         desc: "Set Delimeter", 
         view: { first: "Hello,", second: "World" },
         template: "{{first}}{{=<% %>=}} <%second%> <%={{ }}=%>{{second}}",
         result: "Hello, World World"
     },
     
     { 
         desc: "Set Delimeter (Complex)", 
         view: { data: [ { first: "Hello,", second: "World" } ] },
         template: "{{#data}}{{first}}{{=<% %>=}} <%second%> <%={{ }}=%>{{second}}{{/data}}",
         result: "Hello, World World"
     },
     
     { 
         desc: "Bad Delimeter", 
         view: { first: "Hello,", second: "World" },
         template: "{{first}}{{=%% %%=}} <%second%>",
         result: "Error: Delimeters cannot be the same"
     },
     
     { 
         desc: "Mustache Left Open", 
         view: { data: [ "Hello,", "World" ] },
         template: "{{#data}}",
         result: "Error: `data` was left open"
     },
     
     { 
         desc: "Bad Closing Mustache", 
         view: { data: [ "Hello,", "World" ] },
         template: "{{#data}}{{/dta}}",
         result: "Error: Expecting `/data` not `/dta`"
     },
     
     { 
         desc: "Unknown Partial", 
         view: { },
         template: "{{>not-a-partial}}",
         result: "Error: Partial `not-a-partial` is not defined"
     },
];

// Test suite

document.write( "<table width=100%>" );

document.write( "<tr style='font-weight: bold;'><td>Test</td><td>Expected Result</td><td>Actual Result</td><td>Result</td></tr>")

var tpl, result, pass;

for( var a = 0; a < tests.length; a++ )
{
    try
    {
        tpl = Mustache.compile( tests[a].template );
        result = tpl( tests[a].view, partials );
    }
    catch( e )
    {
        result = e;
    }
    
    pass = (result == tests[a].result);
    
    document.write( "<tr>" );
    
    document.write( "<td>" + tests[a].desc + "</td>" );

    document.write( "<td><textarea cols=60 rows=1>" + tests[a].result + "</textarea></td>" );
    document.write( "<td><textarea cols=60 rows=1>" + result + "</textarea></td>" );
    
    if( pass )
        document.write( "<td style='color: green;'>Pass.</td>" );
    else
        document.write( "<td style='color: red;'>Fail.</td>" );
    
    
    document.write( "</tr>" );
}

document.write( "</table>" );

var start = new Date();

for( var b = 0; b < 1000; b++ )
{
    for( var a = 0; a < tests.length; a++ )
    {
        try
        {
            tpl = Mustache.compile( tests[a].template );
            tpl( tests[a].view );
        }
        catch(e)
        {}
    }
}

var end = new Date() - start;

document.write( "<h2>1000 Iterations Took: " + end + "ms</h2>" );
