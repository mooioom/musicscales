window.DOM = function(name,props,root){

    var tag = name.match(/^[a-zA-Z0-9]+/),
        o   = props,
        el  = document.createElement( tag ? tag[0] : 'div' ),
        attr;
    
    name.split(/(?=\.)|(?=#)|(?=\[)/).forEach(function(c){
        c[0]=='#'&&(el.id=c.substr(1));
        c[0]=='.'&&(el.classList.add(c.substr(1)));
        c[0]=='['&&(attr=c.substr(1,c.length-2).split('='), el.setAttribute(attr[0],attr[1]));
    }); 
    
    root&&(el.root=root,root[name]=el);

    for(var p in o.style) el.style[p] = o.style[p]; delete o.style;

    if(o.name && root) root['$'+o.name] = el;

    for(var x in o) x[0] == '/' ? el.appendChild(DOM(x.substr(1),o[x],root||el)) : el[x] = o[x];

    return el;

}