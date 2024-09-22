(function(n,o){typeof exports=="object"&&typeof module<"u"?o(exports,require("react"),require("react-dom")):typeof define=="function"&&define.amd?define(["exports","react","react-dom"],o):(n=typeof globalThis<"u"?globalThis:n||self,o(n.CalendpayWidget={},n.React,n.ReactDOM))})(this,function(n,o,y){"use strict";var u={exports:{}},i={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _=o,x=Symbol.for("react.element"),v=Symbol.for("react.fragment"),I=Object.prototype.hasOwnProperty,R=_.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,h={key:!0,ref:!0,__self:!0,__source:!0};function f(r,e,s){var t,c={},a=null,m=null;s!==void 0&&(a=""+s),e.key!==void 0&&(a=""+e.key),e.ref!==void 0&&(m=e.ref);for(t in e)I.call(e,t)&&!h.hasOwnProperty(t)&&(c[t]=e[t]);if(r&&r.defaultProps)for(t in e=r.defaultProps,e)c[t]===void 0&&(c[t]=e[t]);return{$$typeof:x,type:r,key:a,ref:m,props:c,_owner:R.current}}i.Fragment=v,i.jsx=f,i.jsxs=f,u.exports=i;var d=u.exports,p,l=y;p=l.createRoot,l.hydrateRoot;const j=({productId:r,organizationId:e})=>d.jsxs("div",{children:[d.jsx("p",{children:"Kalendarz"}),d.jsxs("p",{children:["productId: ",r]}),d.jsxs("p",{children:["organizationId: ",e]})]}),O=r=>{const e=document.getElementById(r.containerId);if(!e){console.error(`Element with ID ${r.containerId} not found.`);return}p(e).render(d.jsx(j,{productId:r.productId,organizationId:r.organizationId}))};n.renderCalendarWidget=O,Object.defineProperty(n,Symbol.toStringTag,{value:"Module"})});
