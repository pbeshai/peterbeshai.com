(window.webpackJsonp=window.webpackJsonp||[]).push([[4],{132:function(e,t,a){"use strict";a.r(t),a.d(t,"query",function(){return h});a(28);var n=a(142),r=a.n(n),i=(a(74),a(0)),o=a.n(i),c=a(141),l=a.n(c),s=a(136),p=a(146),f=a(139),d=function(e){var t=e.githubUrl.split("github.com/")[1].split("/"),a=t[0],n=t[1];return o.a.createElement("iframe",{src:"https://ghbtns.com/github-btn.html?user="+a+"&repo="+n+"&type=star&count=true",title:"GitHub Stars for @"+a+"/"+n,frameBorder:"0",scrolling:"0",width:"170px",height:"20px"})},m=function(e){var t=e.header,a=e.children,n=r()(e,["header","children"]);return o.a.createElement(s.a,Object.assign({pt:3,pb:6,px:3},n),o.a.createElement(s.d,{pl:3,my:3},t),a)},u=function(e){var t=e.gridSize,a=void 0===t?4:t,n=e.children,i=r()(e,["gridSize","children"]);return o.a.createElement(m,i,o.a.createElement(s.c,{p:3,gridGap:4,gridTemplateColumnsFill:a},n))},g=function(e){var t=e.url,a=e.banner,n=e.title,r=e.subhead;return o.a.createElement(s.k,{lineHeight:1.5},o.a.createElement(s.h,{to:t},a&&o.a.createElement(s.e,{mb:2,fluid:a.childImageSharp.fluid}),o.a.createElement(s.k,{as:"span"},n)),o.a.createElement(s.k,{color:"gray.6",fontSize:1,mt:1},r))},b=function(e){var t=e.url,a=e.github,n=e.title,r=e.subhead;return o.a.createElement(s.k,{lineHeight:1.5},o.a.createElement(s.h,{to:t},o.a.createElement(s.k,{as:"span"},n)),o.a.createElement(s.a,{mt:2},o.a.createElement(d,{githubUrl:a},"Star")),o.a.createElement(s.a,{mt:1},o.a.createElement("img",{alt:"npm",src:"https://img.shields.io/npm/v/"+n+".svg"})," ",o.a.createElement("img",{alt:"npm",src:"https://img.shields.io/npm/dm/"+n+".svg"})),o.a.createElement(s.k,{color:"gray.6",fontSize:1},r))};t.default=function(e){var t=e.data,a=t.blog,n=t.projects,r=t.experiments,i=t.page;return o.a.createElement(p.a,{hideNavTitle:!0,hideNav:!0},o.a.createElement(l.a,null,o.a.createElement("meta",{property:"og:type",content:"website"})),o.a.createElement(s.b,{minHeight:"100vh",flexDirection:"column"},o.a.createElement(s.b,{minHeight:"80vh",py:50,alignItems:"center",justifyContent:"center"},o.a.createElement(s.a,{width:350,px:3},o.a.createElement(s.d,null,"Peter Beshai"),o.a.createElement("p",null,"I'm the Director of Engineering and Design at"," ",o.a.createElement(s.h,{to:"https://cortico.ai"},"Cortico")," in Cambridge, MA."),o.a.createElement("p",null,"I make usable tools and visualizations with code."))),o.a.createElement(f.a,{showTitle:!1,hideHome:!0}),o.a.createElement(u,{id:"writing",header:"Writing",bg:"gray.0",gridSize:4},a&&a.edges.map(function(e){var t=e.node;return o.a.createElement(g,{key:t.id,url:t.frontmatter.url||t.fields.slug,banner:t.frontmatter.banner,title:t.frontmatter.title,subhead:o.a.createElement(o.a.Fragment,null,t.frontmatter.date,o.a.createElement(s.k,{color:"gray.6",fontSize:1,display:"inline"},t.frontmatter.host&&" on "+t.frontmatter.host))})})),o.a.createElement(u,{id:"projects",header:"Projects",bg:"gray.1",gridSize:6},n&&n.edges.map(function(e){var t=e.node;return o.a.createElement(g,{key:t.id,url:t.frontmatter.url||t.fields.slug,banner:t.frontmatter.banner,title:t.frontmatter.title,subhead:o.a.createElement(o.a.Fragment,null,t.frontmatter.date,o.a.createElement(s.k,{color:"gray.6",fontSize:1,display:"inline"},t.frontmatter.company&&" at "+t.frontmatter.company))})})),o.a.createElement(u,{id:"experiments",header:"Experiments",bg:"gray.0",gridSize:3},r&&r.edges.map(function(e){var t=e.node;return o.a.createElement(g,{key:t.id,url:t.frontmatter.url||t.fields.slug,banner:t.frontmatter.banner,title:t.frontmatter.title,subhead:t.frontmatter.date})})),o.a.createElement(u,{id:"open-source",header:"Open Source",bg:"gray.1",gridSize:3},i.frontmatter.open_source&&i.frontmatter.open_source.map(function(e){return o.a.createElement(b,{key:e.url,url:e.url,github:e.github,title:e.title,subhead:e.description})}))))};var h="1868253839"},135:function(e,t,a){"use strict";a.r(t),a.d(t,"graphql",function(){return u}),a.d(t,"StaticQueryContext",function(){return d}),a.d(t,"StaticQuery",function(){return m});var n=a(0),r=a.n(n),i=a(4),o=a.n(i),c=a(134),l=a.n(c);a.d(t,"Link",function(){return l.a}),a.d(t,"withPrefix",function(){return c.withPrefix}),a.d(t,"navigate",function(){return c.navigate}),a.d(t,"push",function(){return c.push}),a.d(t,"replace",function(){return c.replace}),a.d(t,"navigateTo",function(){return c.navigateTo});var s=a(138),p=a.n(s);a.d(t,"PageRenderer",function(){return p.a});var f=a(29);a.d(t,"parsePath",function(){return f.a});var d=r.a.createContext({}),m=function(e){return r.a.createElement(d.Consumer,null,function(t){return e.data||t[e.query]&&t[e.query].data?(e.render||e.children)(e.data?e.data.data:t[e.query].data):r.a.createElement("div",null,"Loading (StaticQuery)")})};function u(){throw new Error("It appears like Gatsby is misconfigured. Gatsby related `graphql` calls are supposed to only be evaluated at compile time, and then compiled away,. Unfortunately, something went wrong and the query was left in the compiled code.\n\n.Unless your site has a complex or custom babel/Gatsby configuration this is likely a bug in Gatsby.")}m.propTypes={data:o.a.object,query:o.a.string.isRequired,render:o.a.func,children:o.a.func}},136:function(e,t,a){"use strict";a.d(t,"a",function(){return m}),a.d(t,"b",function(){return u}),a.d(t,"k",function(){return g}),a.d(t,"d",function(){return b}),a.d(t,"h",function(){return y}),a.d(t,"e",function(){return v}),a.d(t,"c",function(){return k}),a.d(t,"i",function(){return w}),a.d(t,"j",function(){return S}),a.d(t,"f",function(){return j}),a.d(t,"g",function(){return O});a(149),a(150);var n=a(142),r=a.n(n),i=(a(28),a(0)),o=a.n(i),c=a(137),l=a(151),s=a.n(l),p=a(135),f=a(140),d=function(e){return function(t){return t.theme[e]}},m=Object(c.d)("div")(f.O,f.m,f.T,f.r,f.q,f.l,f.n,f.N,f.b,f.H,f.L,f.K,f.x,f.A,f.t,d("Box"));m.propTypes=Object.assign({},f.O.propTypes,f.T.propTypes,f.r.propTypes,f.l.propTypes,f.n.propTypes,f.N.propTypes,f.b.propTypes,f.x.propTypes,f.A.propTypes,f.t.propTypes);var u=Object(c.d)(m)({display:"flex"},f.p,f.o,f.a,f.G,d("Flex"));u.propTypes=Object.assign({},f.p.propTypes,f.o.propTypes,f.a.propTypes,f.G.propTypes);var g=Object(c.d)(m)(f.q,f.s,f.Q,f.J,f.I,f.R,d("Text"));g.propTypes=Object.assign({},f.q.propTypes,f.s.propTypes,f.Q.propTypes,f.J.propTypes,f.I.propTypes,f.R.propTypes);var b=Object(c.d)(g)(d("Header"));b.defaultProps={as:"h2",m:0,fontSize:3,fontWeight:"bold",fontFamily:"header",textStyle:"caps"};var h=Object(c.d)(g)(d("Link"),Object(c.c)(["color:",";border-bottom:2px solid ",";text-decoration:none;background:transparent;transition:0.2s background linear,0.2s border-color linear;&:hover{color:",";background:",";border-color:",";}"],function(e){return e.theme.colors.gray[7]},function(e){return e.theme.colors.gray[2]},function(e){return e.theme.colors.gray[8]},function(e){return e.theme.colors.cyan[0]},function(e){return e.theme.colors.cyan[2]}));h.defaultProps={as:"a"};var y=function(e){var t=e.children,a=e.to,n=e.activeClassName,i=r()(e,["children","to","activeClassName"]);!a&&i.href&&(a=i.href,delete i.href);var c=/^\/(?!\/)/.test(a);return console.log((c?"INTERNAL":"external--")+"  "+a,i),c?o.a.createElement(h,Object.assign({as:p.Link,to:a,activeClassName:n},i),"INT",t):o.a.createElement(h,Object.assign({href:a},i),"EXT",t)},E=Object(c.d)(m)({appearance:"none",display:"inline-block",textAlign:"center",lineHeight:"inherit",textDecoration:"none"},f.s,f.i,f.g,f.h,f.k,d("Button"));E.propTypes=Object.assign({},f.s.propTypes,f.i.propTypes,f.g.propTypes,f.h.propTypes,f.k.propTypes),E.defaultProps={as:"button",fontSize:"inherit",fontWeight:"bold",m:0,px:3,py:2,color:"white",bg:"blue",border:0,borderRadius:4};var v=Object(c.d)(m)({maxWidth:"100%",height:"auto"},f.F,f.h,d("Image"));v.propTypes=Object.assign({},f.F.propTypes,f.h.propTypes),v.defaultProps={as:s.a,m:0};var T=Object(f.S)({key:"cards"});Object(c.d)(m)(f.i,f.g,f.h,f.j,f.c,f.f,f.d,f.e,f.M,T,d("Card")).propTypes=Object.assign({},f.i.propTypes,f.g.propTypes,f.h.propTypes,f.j.propTypes,f.c.propTypes,f.f.propTypes,f.d.propTypes,f.e.propTypes,f.M.propTypes,T.propTypes);var x=Object(f.P)({prop:"gridTemplateColumnsFill",cssProperty:"gridTemplateColumns",key:"gridColumnSizes",transformValue:function(e){return"repeat(auto-fill, minmax("+(Number.isNaN(e)?e:e+"px")+", 1fr))"},scale:[0,120,180,240,300,360,420,480,540,600]}),k=Object(c.d)(m)({display:"grid"},f.z,f.y,f.B,f.v,f.u,f.w,f.D,f.E,f.C,x,d("Grid"));k.defaultProps={gridGap:3},k.propTypes=Object.assign({},f.z.propTypes,f.y.propTypes,f.B.propTypes,f.v.propTypes,f.u.propTypes,f.w.propTypes,f.D.propTypes,f.E.propTypes,f.C.propTypes);var w=Object(c.d)(m).withConfig({displayName:"core__List",componentId:"eqpeba-0"})(["list-style-type:",";"],function(e){return e.listStyleType});w.defaultProps={as:"ul"};var S=function(e){return o.a.createElement(m,Object.assign({as:"li"},e))},j=Object(c.d)(w).withConfig({displayName:"core__InlineList",componentId:"eqpeba-1"})(["list-style-type:none;padding-left:0;"]),O=Object(c.d)(g).withConfig({displayName:"core__InlineListItem",componentId:"eqpeba-2"})(["display:inline-block;&:last-child{margin-right:0;}&::before{content:'•';color:",";margin-right:","px;}&:first-child::before{content:'';margin-right:0;}"],function(e){return e.theme.colors.gray[3]},function(e){return e.theme.space[e.mr]});O.defaultProps={as:"li",mr:3}},138:function(e,t,a){var n;e.exports=(n=a(143))&&n.default||n},139:function(e,t,a){"use strict";var n=a(0),r=a.n(n),i=(a(135),a(136));t.a=function(e){var t=e.showTitle,a=e.hideHome;return r.a.createElement(i.a,{p:3,mx:"auto",maxWidth:800},r.a.createElement(i.k,{textAlign:"center"},t&&r.a.createElement(i.d,null,"Peter Beshai"),r.a.createElement(i.f,null,!a&&r.a.createElement(i.g,null,r.a.createElement(i.h,{to:"/",activeClassName:"active"},"Home")),r.a.createElement(i.g,null,r.a.createElement(i.h,{to:"/#writing",activeClassName:"active"},"Writing")),r.a.createElement(i.g,null,r.a.createElement(i.h,{to:"/#projects",activeClassName:"active"},"Projects")),r.a.createElement(i.g,null,r.a.createElement(i.h,{to:"/#experiments",activeClassName:"active"},"Experiments")),r.a.createElement(i.g,null,r.a.createElement(i.h,{to:"/#open-source",activeClassName:"active"},"Open Source")))))}},143:function(e,t,a){"use strict";a.r(t);a(28);var n=a(0),r=a.n(n),i=a(4),o=a.n(i),c=a(46),l=a(2),s=function(e){var t=e.location,a=l.default.getResourcesForPathnameSync(t.pathname);return r.a.createElement(c.a,Object.assign({location:t,pageResources:a},a.json))};s.propTypes={location:o.a.shape({pathname:o.a.string.isRequired}).isRequired},t.default=s},144:function(e){e.exports={data:{site:{siteMetadata:{title:"Peter Beshai"}}}}},145:function(e,t,a){},146:function(e,t,a){"use strict";var n=a(144),r=a(0),i=a.n(r),o=a(4),c=a.n(o),l=a(141),s=a.n(l),p=a(137),f=a(135),d=a(152),m=a.n(d),u=(a(28),a(153)),g=a.n(u),b=a(154),h=a.n(b),y={textStyles:{caps:{textTransform:"uppercase",letterSpacing:"0.035em"},contentHeader:{textTransform:"none",letterSpacing:"0.035em"}},fontSizes:[12,16,19,23,27,32,48,64,96,128],space:[0,4,8,16,32,64,128,256],colors:Object.assign({darken:g.a,lighten:h.a,darken1:g()(.1),darken2:g()(.15),darken3:g()(.2)},{white:"#ffffff",black:"#000000",gray:["#f8f9fa","#f1f3f5","#e9ecef","#dee2e6","#ced4da","#adb5bd","#868e96","#495057","#343a40","#212529"],red:["#fff5f5","#ffe3e3","#ffc9c9","#ffa8a8","#ff8787","#ff6b6b","#fa5252","#f03e3e","#e03131","#c92a2a"],pink:["#fff0f6","#ffdeeb","#fcc2d7","#faa2c1","#f783ac","#f06595","#e64980","#d6336c","#c2255c","#a61e4d"],grape:["#f8f0fc","#f3d9fa","#eebefa","#e599f7","#da77f2","#cc5de8","#be4bdb","#ae3ec9","#9c36b5","#862e9c"],violet:["#f3f0ff","#e5dbff","#d0bfff","#b197fc","#9775fa","#845ef7","#7950f2","#7048e8","#6741d9","#5f3dc4"],indigo:["#edf2ff","#dbe4ff","#bac8ff","#91a7ff","#748ffc","#5c7cfa","#4c6ef5","#4263eb","#3b5bdb","#364fc7"],blue:["#e7f5ff","#d0ebff","#a5d8ff","#74c0fc","#4dabf7","#339af0","#228be6","#1c7ed6","#1971c2","#1864ab"],cyan:["#e3fafc","#c5f6fa","#99e9f2","#66d9e8","#3bc9db","#22b8cf","#15aabf","#1098ad","#0c8599","#0b7285"],teal:["#e6fcf5","#c3fae8","#96f2d7","#63e6be","#38d9a9","#20c997","#12b886","#0ca678","#099268","#087f5b"],green:["#ebfbee","#d3f9d8","#b2f2bb","#8ce99a","#69db7c","#51cf66","#40c057","#37b24d","#2f9e44","#2b8a3e"],lime:["#f4fce3","#e9fac8","#d8f5a2","#c0eb75","#a9e34b","#94d82d","#82c91e","#74b816","#66a80f","#5c940d"],yellow:["#fff9db","#fff3bf","#ffec99","#ffe066","#ffd43b","#fcc419","#fab005","#f59f00","#f08c00","#e67700"],orange:["#fff4e6","#ffe8cc","#ffd8a8","#ffc078","#ffa94d","#ff922b","#fd7e14","#f76707","#e8590c","#d9480f"]}),fonts:{body:"Karla,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",header:"'IBM Plex Sans',-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Cantarell,Fira Sans,Droid Sans,Helvetica Neue,sans-serif",code:"Menlo,Monaco,Consolas,Courier New,monospace"}};function E(){var e=m()(["\n  html,\n  body,\n  #___gatsby {\n    background-color: #fff;\n    width: 100%;\n    height: 100%;\n    padding: 0;\n    margin: 0;\n    color: #000;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n    font-family: ",";\n    line-height: 1.7;\n    font-size: ","px;\n  }\n  * {\n    box-sizing: border-box;\n  }\n  #___gatsby > div {\n    height: 100%;\n  }\n  img.full-width-image {\n    width: 100%;\n  }\n  a {\n    color: #495057;\n  }\n"]);return E=function(){return e},e}var v=Object(p.b)(E(),y.fonts.body,y.fontSizes[2]),T=a(139),x=a(136),k=function(){return i.a.createElement(x.a,{px:3,py:5,mx:"auto"},i.a.createElement(x.k,{textAlign:"center"},i.a.createElement(x.f,null,i.a.createElement(x.g,null,i.a.createElement(x.h,{to:"mailto:peter.beshai@gmail.com"},"peter.beshai@gmail.com")),i.a.createElement(x.g,null,i.a.createElement(x.h,{to:"https://twitter.com/pbesh"},"Twitter")),i.a.createElement(x.g,null,i.a.createElement(x.h,{to:"https://www.linkedin.com/in/pbeshai"},"LinkedIn")),i.a.createElement(x.g,null,i.a.createElement(x.h,{to:"https://github.com/pbeshai"},"GitHub")),i.a.createElement(x.g,null,i.a.createElement(x.h,{to:"https://instagram.com/pbeshasketch"},"Instagram")))))},w=(a(145),"https://peterbeshai.com"),S=function(e){var t=e.children,a=e.hideNavTitle,r=e.hideNav,o=e.pageTitle,c=e.description,l=void 0===c?"Peter Beshai makes usable tools and visualizations with code.":c,d=e.metaImage,m=e.slug,u=void 0===m?"":m;return i.a.createElement(i.a.Fragment,null,i.a.createElement(v,null),i.a.createElement(f.StaticQuery,{query:"2994927498",render:function(e){var n=e.site.siteMetadata.title,c=o?o+" - "+n:n;return i.a.createElement(i.a.Fragment,null,i.a.createElement(s.a,{title:c},i.a.createElement("link",{href:"https://fonts.googleapis.com/css?family=IBM+Plex+Sans:700|Karla:400,400i,700",rel:"stylesheet"}),i.a.createElement("html",{lang:"en"}),i.a.createElement("meta",{name:"description",content:l}),i.a.createElement("meta",{name:"twitter:description",content:l}),i.a.createElement("meta",{property:"og:description",content:l}),i.a.createElement("meta",{name:"keywords",content:"data vis, visualization, creative coding, generative art, nba, basketball"}),i.a.createElement("meta",{name:"twitter:site",content:"@pbesh"}),i.a.createElement("meta",{name:"twitter:creator",content:"@pbesh"}),i.a.createElement("meta",{property:"og:title",content:o||n}),i.a.createElement("meta",{property:"twitter:title",content:o||n}),i.a.createElement("meta",{property:"og:url",content:""+w+u}),d&&i.a.createElement("meta",{property:"og:image",content:""+w+d}),d&&i.a.createElement("meta",{name:"twitter:image",content:""+w+d})),i.a.createElement(p.a,{theme:y},i.a.createElement("div",null,!r&&i.a.createElement(T.a,{showTitle:!a}),t,i.a.createElement(k,null))))},data:n}))};S.propTypes={children:c.a.node.isRequired};t.a=S}}]);
//# sourceMappingURL=component---src-pages-index-js-eabe9a699c47fdfcd431.js.map