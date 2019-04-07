(window.webpackJsonp=window.webpackJsonp||[]).push([[1],{OkJo:function(t,e,i){"use strict";i.d(e,"e",function(){return h}),i.d(e,"b",function(){return l}),i.d(e,"c",function(){return u}),i.d(e,"d",function(){return a}),i.d(e,"a",function(){return f});var s=i("LiEJ"),r=i("D57K"),n=i("LoAr"),o={vertical:"vertical",horizontal:"horizontal"},c="window",h=function(){function t(){var t=this;this._items={},this._streams={},this._$streamListener={},this._streams[c]=this._generateStream(c,new n.k(document.documentElement||document.body),o.vertical),this._$streamListener[c]=new s.a(null),window.addEventListener("scroll",function(e){t._windowScroll(e)})}return t.prototype._windowScroll=function(t){this.updateStream(c)},t.prototype._generateStream=function(t,e,i,s){return void 0===s&&(s=0),{id:t,elementRef:e,direction:i,offset:s}},t.prototype.setOffset=function(t,e){this._checkStreamExists(t),this._streams[t].offset=e},t.prototype.setStream=function(t,e,i,r){void 0===r&&(r=0),this._checkStreamNotExists(t),this._streams[t]=this._generateStream(t,e,i,r),this._$streamListener[t]=new s.a(null)},t.prototype._checkStreamNotExists=function(t){if(null!=this._streams[t])throw new Error("ScrollSpyService: The stream with the id ["+t+"] exists.")},t.prototype.setItem=function(t,e,i){void 0===i&&(i=c),this._checkItemNotExists(t),this._items[t]=this._generateScrollObject(t,e,i)},t.prototype._checkItemNotExists=function(t){if(null!=this._items[t])throw new Error("ScrollSpyService: The element with the id ["+t+"] exists.")},t.prototype._generateScrollObject=function(t,e,i){return{id:t,stream:i,elementRef:e,nativeElement:e.nativeElement}},t.prototype.observe=function(t){return void 0===t&&(t=c),this._checkStreamExists(t),this._$streamListener[t].asObservable()},t.prototype._checkStreamExists=function(t){if(null==this._streams[t])throw new Error("ScrollSpyService: The stream with the id ["+t+"] doesn't exist.")},t.prototype.updateStream=function(t){var e=this;this._checkStreamExists(t);var i=this._streams[t],s=this._getStreamItems(t),r=this._getActiveItem(i,s),n=this._$streamListener[t].getValue();null==n?null!=r&&setTimeout(function(){return e._$streamListener[t].next(r)}):null!=r&&n.id!==r.id&&setTimeout(function(){return e._$streamListener[t].next(r)})},t.prototype._getStreamItems=function(t){var e=[];for(var i in this._items){var s=this._items[i];s.stream===t&&e.push(s)}return e},t.prototype._getActiveItem=function(t,e){var i=t.direction,s=null,r=t.elementRef.nativeElement;return e.forEach(function(e){var n=!1;switch(i){case o.horizontal:n=e.nativeElement.offsetLeft<=r.scrollLeft+t.offset;break;default:n=e.nativeElement.offsetTop<=r.scrollTop+t.offset}n&&(s=e)}),s},t.prototype.deleteStream=function(t){"window"===t?this._$streamListener[t].next(null):(this._checkStreamExists(t),delete this._streams[t],delete this._$streamListener[t])},t.prototype.deleteItem=function(t){this._checkItemExists(t),delete this._items[t]},t.prototype._checkItemExists=function(t){if(null==this._items[t])throw new Error("ScrollSpyService: The element with the id ["+t+"] doesn't exist.")},t}(),l=function(){function t(t,e){this._el=t,this._scrollSpyService=e,this.direction=o.vertical}return t.prototype.onScroll=function(t){this._scrollSpyService.updateStream(this.streamId)},t.prototype.ngOnInit=function(){this._scrollSpyService.setStream(this.streamId,this._el,this.direction),this._el.nativeElement.setAttribute("id",this.streamId)},t.prototype.ngOnDestroy=function(){this._scrollSpyService.deleteStream(this.streamId)},t}(),u=function(){function t(t){this._scrollSpyService=t,this.classActive=!1,this.stream="window",this.activeEvent=new n.m}return t.prototype.ngOnDestroy=function(){this._subscriber&&this._subscriber.unsubscribe(),this._scrollSpyService.deleteItem(this.itemId)},t.prototype.ngAfterViewInit=function(){var t=this;this._subscriber=this._scrollSpyService.observe(this.stream).subscribe(function(e){if(null!=e){var i=e.id===t.itemId;t.activeEvent.emit(i),setTimeout(function(){return t.classActive=i})}})},t}(),a=function(){function t(t,e){this._el=t,this._scrollSpyService=e,this.classActive=!1,this.stream="window"}return t.prototype.ngOnDestroy=function(){this._subscriber&&this._subscriber.unsubscribe()},t.prototype.ngAfterViewInit=function(){var t=this;this._subscriber=this._scrollSpyService.observe(this.stream).subscribe(function(e){if(null!=e){var i=e.id===t.itemId;setTimeout(function(){return t.classActive=i})}}),this._scrollSpyService.setItem(this.itemId,this._el,this.stream),this._el.nativeElement.setAttribute("id",this.itemId)},t}(),m=[h],f=function(){function t(){}return t.forRoot=function(){return{ngModule:t,providers:Object(r.g)(m)}},t}()}}]);