﻿Type.registerNamespace("Sys.Extended.UI");Sys.Extended.UI.IDragSource=function(){};Sys.Extended.UI.IDragSource.prototype={get_dragDataType:function(){throw Error.notImplemented();},getDragData:function(){throw Error.notImplemented();},get_dragMode:function(){throw Error.notImplemented();},onDragStart:function(){throw Error.notImplemented();},onDrag:function(){throw Error.notImplemented();},onDragEnd:function(){throw Error.notImplemented();}};Sys.Extended.UI.IDragSource.registerInterface("Sys.Extended.UI.IDragSource");Sys.Extended.UI.IDropTarget=function(){};Sys.Extended.UI.IDropTarget.prototype={get_dropTargetElement:function(){throw Error.notImplemented();},canDrop:function(){throw Error.notImplemented();},drop:function(){throw Error.notImplemented();},onDragEnterTarget:function(){throw Error.notImplemented();},onDragLeaveTarget:function(){throw Error.notImplemented();},onDragInTarget:function(){throw Error.notImplemented();}};Sys.Extended.UI.IDropTarget.registerInterface("Sys.Extended.UI.IDropTarget");Sys.Extended.UI.DragMode=function(){throw Error.invalidOperation();};Sys.Extended.UI.DragMode.prototype={Copy:0,Move:1};Sys.Extended.UI.DragMode.registerEnum("Sys.Extended.UI.DragMode");Sys.Extended.UI.DragDropEventArgs=function(n,t,i){this._dragMode=n;this._dataType=t;this._data=i};Sys.Extended.UI.DragDropEventArgs.prototype={get_dragMode:function(){return this._dragMode||null},get_dragDataType:function(){return this._dataType||null},get_dragData:function(){return this._data||null}};Sys.Extended.UI.DragDropEventArgs.registerClass("Sys.Extended.UI.DragDropEventArgs");Sys.Extended.UI._DragDropManager=function(){this._instance=null;this._events=null};Sys.Extended.UI._DragDropManager.prototype={add_dragStart:function(n){this.get_events().addHandler("dragStart",n)},remove_dragStart:function(n){this.get_events().removeHandler("dragStart",n)},get_events:function(){return this._events||(this._events=new Sys.EventHandlerList),this._events},add_dragStop:function(n){this.get_events().addHandler("dragStop",n)},remove_dragStop:function(n){this.get_events().removeHandler("dragStop",n)},_getInstance:function(){return this._instance||(this._instance=Sys.Browser.agent===Sys.Browser.InternetExplorer?new Sys.Extended.UI.IEDragDropManager:new Sys.Extended.UI.GenericDragDropManager,this._instance.initialize(),this._instance.add_dragStart(Function.createDelegate(this,this._raiseDragStart)),this._instance.add_dragStop(Function.createDelegate(this,this._raiseDragStop))),this._instance},startDragDrop:function(n,t,i,r){this._getInstance().startDragDrop(n,t,i,r)},registerDropTarget:function(n){this._getInstance().registerDropTarget(n)},unregisterDropTarget:function(n){this._getInstance().unregisterDropTarget(n)},dispose:function(){delete this._events;Sys.Application.unregisterDisposableObject(this);Sys.Application.removeComponent(this)},_raiseDragStart:function(n,t){var i=this.get_events().getHandler("dragStart");i&&i(this,t)},_raiseDragStop:function(n,t){var i=this.get_events().getHandler("dragStop");i&&i(this,t)}};Sys.Extended.UI._DragDropManager.registerClass("Sys.Extended.UI._DragDropManager");Sys.Extended.UI.DragDropManager=new Sys.Extended.UI._DragDropManager;Sys.Extended.UI.IEDragDropManager=function(){Sys.Extended.UI.IEDragDropManager.initializeBase(this);this._dropTargets=null;this._radius=10;this._useBuiltInDragAndDropFunctions=!0;this._activeDragVisual=null;this._activeContext=null;this._activeDragSource=null;this._underlyingTarget=null;this._oldOffset=null;this._potentialTarget=null;this._isDragging=!1;this._mouseUpHandler=null;this._documentMouseMoveHandler=null;this._documentDragOverHandler=null;this._dragStartHandler=null;this._mouseMoveHandler=null;this._dragEnterHandler=null;this._dragLeaveHandler=null;this._dragOverHandler=null;this._dropHandler=null};Sys.Extended.UI.IEDragDropManager.prototype={add_dragStart:function(n){this.get_events().addHandler("dragStart",n)},remove_dragStart:function(n){this.get_events().removeHandler("dragStart",n)},add_dragStop:function(n){this.get_events().addHandler("dragStop",n)},remove_dragStop:function(n){this.get_events().removeHandler("dragStop",n)},initialize:function(){Sys.Extended.UI.IEDragDropManager.callBaseMethod(this,"initialize");this._mouseUpHandler=Function.createDelegate(this,this._onMouseUp);this._documentMouseMoveHandler=Function.createDelegate(this,this._onDocumentMouseMove);this._documentDragOverHandler=Function.createDelegate(this,this._onDocumentDragOver);this._dragStartHandler=Function.createDelegate(this,this._onDragStart);this._mouseMoveHandler=Function.createDelegate(this,this._onMouseMove);this._dragEnterHandler=Function.createDelegate(this,this._onDragEnter);this._dragLeaveHandler=Function.createDelegate(this,this._onDragLeave);this._dragOverHandler=Function.createDelegate(this,this._onDragOver);this._dropHandler=Function.createDelegate(this,this._onDrop)},dispose:function(){if(this._dropTargets){for(var n=0;n<this._dropTargets;n++)this.unregisterDropTarget(this._dropTargets[n]);this._dropTargets=null}Sys.Extended.UI.IEDragDropManager.callBaseMethod(this,"dispose")},startDragDrop:function(n,t,i,r){var s=window._event,e,h,u,f,c,o;this._isDragging||(this._underlyingTarget=null,this._activeDragSource=n,this._activeDragVisual=t,this._activeContext=i,this._useBuiltInDragAndDropFunctions=typeof r!="undefined"?r:!0,e={x:s.clientX,y:s.clientY},t.originalPosition=t.style.position,t.style.position="absolute",document._lastPosition=e,t.startingPoint=e,h=this.getScrollOffset(t,!0),t.startingPoint=this.addPoints(t.startingPoint,h),u=parseInt(t.style.left),f=parseInt(t.style.top),isNaN(u)&&(u="0"),isNaN(f)&&(f="0"),t.startingPoint=this.subtractPoints(t.startingPoint,{x:u,y:f}),this._prepareForDomChanges(),n.onDragStart(),c=new Sys.Extended.UI.DragDropEventArgs(n.get_dragMode(),n.get_dragDataType(),n.getDragData(i)),o=this.get_events().getHandler("dragStart"),o&&o(this,c),this._recoverFromDomChanges(),this._wireEvents(),this._drag(!0))},_stopDragDrop:function(n){var i=window._event,t;if(this._activeDragSource!=null){this._unwireEvents();n||(n=this._underlyingTarget==null);n||this._underlyingTarget==null||this._underlyingTarget.drop(this._activeDragSource.get_dragMode(),this._activeDragSource.get_dragDataType(),this._activeDragSource.getDragData(this._activeContext));this._activeDragSource.onDragEnd(n);t=this.get_events().getHandler("dragStop");t&&t(this,Sys.EventArgs.Empty);this._activeDragVisual.style.position=this._activeDragVisual.originalPosition;this._activeDragSource=null;this._activeContext=null;this._activeDragVisual=null;this._isDragging=!1;this._potentialTarget=null;i.preventDefault()}},_drag:function(n){var r=window._event,u={x:r.clientX,y:r.clientY},f,t,i;(document._lastPosition=u,f=this.getScrollOffset(this._activeDragVisual,!0),t=this.addPoints(this.subtractPoints(u,this._activeDragVisual.startingPoint),f),n||parseInt(this._activeDragVisual.style.left)!=t.x||parseInt(this._activeDragVisual.style.top)!=t.y)&&($common.setLocation(this._activeDragVisual,t),this._prepareForDomChanges(),this._activeDragSource.onDrag(),this._recoverFromDomChanges(),this._potentialTarget=this._findPotentialTarget(this._activeDragSource,this._activeDragVisual),i=this._potentialTarget!=this._underlyingTarget||this._potentialTarget==null,i&&this._underlyingTarget!=null&&this._leaveTarget(this._activeDragSource,this._underlyingTarget),this._potentialTarget!=null?i?(this._underlyingTarget=this._potentialTarget,this._enterTarget(this._activeDragSource,this._underlyingTarget)):this._moveInTarget(this._activeDragSource,this._underlyingTarget):this._underlyingTarget=null)},_wireEvents:function(){this._useBuiltInDragAndDropFunctions?($addHandler(document,"mouseup",this._mouseUpHandler),$addHandler(document,"mousemove",this._documentMouseMoveHandler),$addHandler(document.body,"dragover",this._documentDragOverHandler),$addHandler(this._activeDragVisual,"dragstart",this._dragStartHandler),$addHandler(this._activeDragVisual,"dragend",this._mouseUpHandler),$addHandler(this._activeDragVisual,"drag",this._mouseMoveHandler)):($addHandler(document,"mouseup",this._mouseUpHandler),$addHandler(document,"mousemove",this._mouseMoveHandler))},_unwireEvents:function(){this._useBuiltInDragAndDropFunctions?($removeHandler(this._activeDragVisual,"drag",this._mouseMoveHandler),$removeHandler(this._activeDragVisual,"dragend",this._mouseUpHandler),$removeHandler(this._activeDragVisual,"dragstart",this._dragStartHandler),$removeHandler(document.body,"dragover",this._documentDragOverHandler),$removeHandler(document,"mousemove",this._documentMouseMoveHandler),$removeHandler(document,"mouseup",this._mouseUpHandler)):($removeHandler(document,"mousemove",this._mouseMoveHandler),$removeHandler(document,"mouseup",this._mouseUpHandler))},registerDropTarget:function(n){this._dropTargets==null&&(this._dropTargets=[]);Array.add(this._dropTargets,n);this._wireDropTargetEvents(n)},unregisterDropTarget:function(n){this._unwireDropTargetEvents(n);this._dropTargets&&Array.remove(this._dropTargets,n)},_wireDropTargetEvents:function(n){var t=n.get_dropTargetElement();t._dropTarget=n;$addHandler(t,"dragenter",this._dragEnterHandler);$addHandler(t,"dragleave",this._dragLeaveHandler);$addHandler(t,"dragover",this._dragOverHandler);$addHandler(t,"drop",this._dropHandler)},_unwireDropTargetEvents:function(n){var t=n.get_dropTargetElement();t._dropTarget&&(t._dropTarget=null,$removeHandler(t,"dragenter",this._dragEnterHandler),$removeHandler(t,"dragleave",this._dragLeaveHandler),$removeHandler(t,"dragover",this._dragOverHandler),$removeHandler(t,"drop",this._dropHandler))},_onDragStart:function(n){var i,r,t;window._event=n;document.selection.empty();i=n.dataTransfer;!i&&n.rawEvent&&(i=n.rawEvent.dataTransfer);r=this._activeDragSource.get_dragDataType().toLowerCase();t=this._activeDragSource.getDragData(this._activeContext);t&&(r!="text"&&r!="url"&&(r="text",t.innerHTML!=null&&(t=t.innerHTML)),i.effectAllowed="move",i.setData(r,t.toString()))},_onMouseUp:function(n){window._event=n;this._stopDragDrop(!1)},_onDocumentMouseMove:function(n){window._event=n;this._dragDrop()},_onDocumentDragOver:function(n){window._event=n;this._potentialTarget&&n.preventDefault()},_onMouseMove:function(n){window._event=n;this._drag()},_onDragEnter:function(n){var i,t;if(window._event=n,this._isDragging)n.preventDefault();else for(i=Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget(this._getDropTarget(n.target)),t=0;t<i.length;t++)this._dropTarget.onDragEnterTarget(Sys.Extended.UI.DragMode.Copy,i[t].type,i[t].value)},_onDragLeave:function(n){var i,t;if(window._event=n,this._isDragging)n.preventDefault();else for(i=Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget(this._getDropTarget(n.target)),t=0;t<i.length;t++)this._dropTarget.onDragLeaveTarget(Sys.Extended.UI.DragMode.Copy,i[t].type,i[t].value)},_onDragOver:function(n){var i,t;if(window._event=n,this._isDragging)n.preventDefault();else for(i=Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget(this._getDropTarget(n.target)),t=0;t<i.length;t++)this._dropTarget.onDragInTarget(Sys.Extended.UI.DragMode.Copy,i[t].type,i[t].value)},_onDrop:function(n){var i,t;if(window._event=n,!this._isDragging)for(i=Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget(this._getDropTarget(n.target)),t=0;t<i.length;t++)this._dropTarget.drop(Sys.Extended.UI.DragMode.Copy,i[t].type,i[t].value);n.preventDefault()},_getDropTarget:function(n){while(n){if(n._dropTarget!=null)return n._dropTarget;n=n.parentNode}return null},_dragDrop:function(){this._isDragging||(this._isDragging=!0,this._activeDragVisual.dragDrop(),document.selection.empty())},_moveInTarget:function(n,t){this._prepareForDomChanges();t.onDragInTarget(n.get_dragMode(),n.get_dragDataType(),n.getDragData(this._activeContext));this._recoverFromDomChanges()},_enterTarget:function(n,t){this._prepareForDomChanges();t.onDragEnterTarget(n.get_dragMode(),n.get_dragDataType(),n.getDragData(this._activeContext));this._recoverFromDomChanges()},_leaveTarget:function(n,t){this._prepareForDomChanges();t.onDragLeaveTarget(n.get_dragMode(),n.get_dragDataType(),n.getDragData(this._activeContext));this._recoverFromDomChanges()},_findPotentialTarget:function(n){var i=window._event,t;if(this._dropTargets==null)return null;var f=n.get_dragDataType(),e=n.get_dragMode(),o=n.getDragData(this._activeContext),r=this.getScrollOffset(document.body,!0),s=i.clientX+r.x,h=i.clientY+r.y,c={x:s-this._radius,y:h-this._radius,width:this._radius*2,height:this._radius*2},u;for(t=0;t<this._dropTargets.length;t++)if(u=$common.getBounds(this._dropTargets[t].get_dropTargetElement()),$common.overlaps(c,u)&&this._dropTargets[t].canDrop(e,f,o))return this._dropTargets[t];return null},_prepareForDomChanges:function(){this._oldOffset=$common.getLocation(this._activeDragVisual)},_recoverFromDomChanges:function(){var n=$common.getLocation(this._activeDragVisual),t;(this._oldOffset.x!=n.x||this._oldOffset.y!=n.y)&&(this._activeDragVisual.startingPoint=this.subtractPoints(this._activeDragVisual.startingPoint,this.subtractPoints(this._oldOffset,n)),scrollOffset=this.getScrollOffset(this._activeDragVisual,!0),t=this.addPoints(this.subtractPoints(document._lastPosition,this._activeDragVisual.startingPoint),scrollOffset),$common.setLocation(this._activeDragVisual,t))},addPoints:function(n,t){return{x:n.x+t.x,y:n.y+t.y}},subtractPoints:function(n,t){return{x:n.x-t.x,y:n.y-t.y}},getScrollOffset:function(n,t){var r=n.scrollLeft,u=n.scrollTop,i;if(t)for(i=n.parentNode;i!=null&&i.scrollLeft!=null;){if(r+=i.scrollLeft,u+=i.scrollTop,i==document.body&&r!=0&&u!=0)break;i=i.parentNode}return{x:r,y:u}},getBrowserRectangle:function(){var n=window.innerWidth,t=window.innerHeight;return n==null&&(n=document.documentElement.clientWidth),t==null&&(t=document.documentElement.clientHeight),{x:0,y:0,width:n,height:t}},getNextSibling:function(n){for(n=n.nextSibling;n!=null;n=n.nextSibling)if(n.innerHTML!=null)return n;return null},hasParent:function(n){return n.parentNode!=null&&n.parentNode.tagName!=null}};Sys.Extended.UI.IEDragDropManager.registerClass("Sys.Extended.UI.IEDragDropManager",Sys.Component);Sys.Extended.UI.IEDragDropManager._getDataObjectsForDropTarget=function(n){var t,u;if(n==null)return[];var f=window._event,e=[],i=["URL","Text"],r;for(t=0;t<i.length;t++)u=f.dataTransfer,!u&&f.rawEvent&&(u=f.rawEvent.dataTransfer),r=u.getData(i[t]),n.canDrop(Sys.Extended.UI.DragMode.Copy,i[t],r)&&r&&Array.add(e,{type:i[t],value:r});return e};Sys.Extended.UI.GenericDragDropManager=function(){Sys.Extended.UI.GenericDragDropManager.initializeBase(this);this._dropTargets=null;this._scrollEdgeConst=40;this._scrollByConst=10;this._scroller=null;this._scrollDeltaX=0;this._scrollDeltaY=0;this._activeDragVisual=null;this._activeContext=null;this._activeDragSource=null;this._oldOffset=null;this._potentialTarget=null;this._mouseUpHandler=null;this._mouseMoveHandler=null;this._keyPressHandler=null;this._scrollerTickHandler=null};Sys.Extended.UI.GenericDragDropManager.prototype={initialize:function(){Sys.Extended.UI.GenericDragDropManager.callBaseMethod(this,"initialize");this._mouseUpHandler=Function.createDelegate(this,this._onMouseUp);this._mouseMoveHandler=Function.createDelegate(this,this._onMouseMove);this._keyPressHandler=Function.createDelegate(this,this._onKeyPress);this._scrollerTickHandler=Function.createDelegate(this,this._onScrollerTick);this._scroller=new Sys.Timer;this._scroller.set_interval(10);this._scroller.add_tick(this._scrollerTickHandler)},startDragDrop:function(n,t,i){this._activeDragSource=n;this._activeDragVisual=t;this._activeContext=i;Sys.Extended.UI.GenericDragDropManager.callBaseMethod(this,"startDragDrop",[n,t,i])},_stopDragDrop:function(n){this._scroller.set_enabled(!1);Sys.Extended.UI.GenericDragDropManager.callBaseMethod(this,"_stopDragDrop",[n])},_drag:function(n){Sys.Extended.UI.GenericDragDropManager.callBaseMethod(this,"_drag",[n]);this._autoScroll()},_wireEvents:function(){$addHandler(document,"mouseup",this._mouseUpHandler);$addHandler(document,"mousemove",this._mouseMoveHandler);$addHandler(document,"keypress",this._keyPressHandler)},_unwireEvents:function(){$removeHandler(document,"keypress",this._keyPressHandler);$removeHandler(document,"mousemove",this._mouseMoveHandler);$removeHandler(document,"mouseup",this._mouseUpHandler)},_wireDropTargetEvents:function(){},_unwireDropTargetEvents:function(){},_onMouseUp:function(n){window._event=n;this._stopDragDrop(!1)},_onMouseMove:function(n){window._event=n;this._drag()},_onKeyPress:function(n){window._event=n;var t=n.keyCode?n.keyCode:n.rawEvent.keyCode;t==27&&this._stopDragDrop(!0)},_autoScroll:function(){var t=window._event,n=this.getBrowserRectangle();n.width>0&&(this._scrollDeltaX=this._scrollDeltaY=0,t.clientX<n.x+this._scrollEdgeConst?this._scrollDeltaX=-this._scrollByConst:t.clientX>n.width-this._scrollEdgeConst&&(this._scrollDeltaX=this._scrollByConst),t.clientY<n.y+this._scrollEdgeConst?this._scrollDeltaY=-this._scrollByConst:t.clientY>n.height-this._scrollEdgeConst&&(this._scrollDeltaY=this._scrollByConst),this._scrollDeltaX!=0||this._scrollDeltaY!=0?this._scroller.set_enabled(!0):this._scroller.set_enabled(!1))},_onScrollerTick:function(){var t=document.body.scrollLeft,i=document.body.scrollTop;window.scrollBy(this._scrollDeltaX,this._scrollDeltaY);var r=document.body.scrollLeft,u=document.body.scrollTop,n=this._activeDragVisual,f={x:parseInt(n.style.left)+(r-t),y:parseInt(n.style.top)+(u-i)};$common.setLocation(n,f)}};Sys.Extended.UI.GenericDragDropManager.registerClass("Sys.Extended.UI.GenericDragDropManager",Sys.Extended.UI.IEDragDropManager);