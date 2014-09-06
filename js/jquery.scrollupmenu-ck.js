/**
 *  Project:      Scroll Up For Menu
 *  Description:  A simple mobile optimised menuing system which gets out of the way when you're not using it.
 *  Author:       David Simpson <david@davidsimpson.me>
 *  License:      Apache License, Version 2.0 <http://www.apache.org/licenses/LICENSE-2.0.html>
 *  Source:       http://github.com/dvdsmpsn/scroll-up-for-menu
 *
 *  Usage:        $('#top').scrollUpForMenu(options);
 *      
 *
 *
 */(function(e,t,n,r){function l(t,n){this.element=t;this.settings=e.extend({},s,n);this._defaults=s;this._name=i;this.init()}var i="scrollUpMenu",s={waitTime:200,transitionTime:150,menuCss:{position:"fixed",top:"0"}},o=0,u,a,f;l.prototype={init:function(){var n=this;u=e(this.element);u.css(n.settings.menuCss);f=u.height();u.next().css({"margin-top":f});e(t).bind("scroll",function(){clearTimeout(a);a=setTimeout(function(){n.refresh(n.settings)},n.settings.waitTime)})},refresh:function(n){var r=e(t).scrollTop();r>o&&r>f?u.slideUp(n.transitionTime):u.slideDown(n.transitionTime);o=r}};e.fn[i]=function(t){return this.each(function(){e.data(this,"plugin_"+i)||e.data(this,"plugin_"+i,new l(this,t))})}})(jQuery,window,document);