/**
 * DEVELOPED BY
 * GIL LOPES BUENO
 * gilbueno.mail@gmail.com
 *
 * WORKS WITH:
 * IE 9+, FF 4+, SF 5+, WebKit, CH 7+, OP 12+, BESEN, Rhino 1.7+
 *
 * FORK:
 * https://github.com/melanke/Watch.JS
 */

"use strict";
(function (factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals
        window.WatchJS = factory();
        window.watch = window.WatchJS.watch;
        window.unwatch = window.WatchJS.unwatch;
        window.callWatchers = window.WatchJS.callWatchers;
    }
}(function () {

    var WatchJS = {
            noMore: false
        },
        lengthsubjects = [];

    var isFunction = function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    };

    var isInt = function (x) {
        return x % 1 === 0;
    };

    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var getObjDiff = function(a, b){
        var aplus = [],
            bplus = [];

        if(!(typeof a == "string") && !(typeof b == "string")){

            if (isArray(a)) {
                for (var i=0; i<a.length; i++) {
                    if (b[i] === undefined) aplus.push(i);
                }
            } else {
                for(var i in a){
                    if (a.hasOwnProperty(i)) {
                        if(b[i] === undefined) {
                            aplus.push(i);
                        }
                    }
                }
            }

            if (isArray(b)) {
                for (var j=0; j<b.length; j++) {
                    if (a[j] === undefined) bplus.push(j);
                }
            } else {
                for(var j in b){
                    if (b.hasOwnProperty(j)) {
                        if(a[j] === undefined) {
                            bplus.push(j);
                        }
                    }
                }
            }
        }

        return {
            added: aplus,
            removed: bplus
        }
    };

    var clone = function(obj){

        if (null == obj || "object" != typeof obj) {
            return obj;
        }

        var copy = obj.constructor();

        for (var attr in obj) {
            copy[attr] = obj[attr];
        }

        return copy;

    }

    var defineGetAndSet = function (obj, propName, getter, setter) {
        try {

            Object.observe(obj[propName], function(data){
                setter(data); //TODO: adapt our callback data to match Object.observe data spec
            });

        } catch(e) {

            try {
                Object.defineProperty(obj, propName, {
                    get: getter,
                    set: setter,
                    enumerable: true,
                    configurable: true
                });
            } catch(e2) {
                try{
                    Object.prototype.__defineGetter__.call(obj, propName, getter);
                    Object.prototype.__defineSetter__.call(obj, propName, setter);
                } catch(e3) {
                    throw new Error("watchJS error: browser not supported :/")
                }
            }

        }
    };

    var defineProp = function (obj, propName, value) {
        try {
            Object.defineProperty(obj, propName, {
                enumerable: false,
                configurable: true,
                writable: false,
                value: value
            });
        } catch(error) {
            obj[propName] = value;
        }
    };

    var watch = function () {

        if (isFunction(arguments[1])) {
            watchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            watchMany.apply(this, arguments);
        } else {
            watchOne.apply(this, arguments);
        }

    };


    var watchAll = function (obj, watcher, level, addNRemove) {

        if(level == undefined)
            level = 1;

        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        var props = [];


        if(isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
            for (var prop2 in obj) { //for each attribute if obj is an object
                if (obj.hasOwnProperty(prop2)) {
                    props.push(prop2); //put in the props
                }
            }
        }

        watchMany(obj, props, watcher, level, addNRemove); //watch all items of the props

        if (addNRemove) {
            pushToLengthSubjects(obj, "$$watchlengthsubjectroot", watcher, level);
        }
    };


    var watchMany = function (obj, props, watcher, level, addNRemove) {

        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        for (var prop in props) { //watch each attribute of "props" if is an object
            if (props.hasOwnProperty(prop)) {
                watchOne(obj, props[prop], watcher, level, addNRemove);
            }
        }

    };

    var watchOne = function (obj, prop, watcher, level, addNRemove) {

        if ((typeof obj == "string") || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        if(isFunction(obj[prop])) { //dont watch if it is a function
            return;
        }

        if(obj[prop] != null && (level === undefined || level > 0)){
            watchAll(obj[prop], watcher, level!==undefined? level-1 : level); //recursively watch all attributes of this
        }

        defineWatcher(obj, prop, watcher, level);

        if(addNRemove && (level === undefined || level > 0)){
            pushToLengthSubjects(obj, prop, watcher, level);
        }

    };

    var unwatch = function () {

        if (isFunction(arguments[1])) {
            unwatchAll.apply(this, arguments);
        } else if (isArray(arguments[1])) {
            unwatchMany.apply(this, arguments);
        } else {
            unwatchOne.apply(this, arguments);
        }

    };

    var unwatchAll = function (obj, watcher) {

        if (obj instanceof String || (!(obj instanceof Object) && !isArray(obj))) { //accepts only objects and array (not string)
            return;
        }

        var props = [];


        if (isArray(obj)) {
            for (var prop = 0; prop < obj.length; prop++) { //for each item if obj is an array
                props.push(prop); //put in the props
            }
        } else {
            for (var prop2 in obj) { //for each attribute if obj is an object
                if (obj.hasOwnProperty(prop2)) {
                    props.push(prop2); //put in the props
                }
            }
        }

        unwatchMany(obj, props, watcher); //watch all itens of the props
    };


    var unwatchMany = function (obj, props, watcher) {

        for (var prop2 in props) { //watch each attribute of "props" if is an object
            if (props.hasOwnProperty(prop2)) {
                unwatchOne(obj, props[prop2], watcher);
            }
        }
    };

    var defineWatcher = function (obj, prop, watcher, level) {

        var val = obj[prop];

        watchFunctions(obj, prop);

        if (!obj.watchers) {
            defineProp(obj, "watchers", {});
        }

        if (!obj.watchers[prop]) {
            obj.watchers[prop] = [];
        }

        for (var i=0; i<obj.watchers[prop].length; i++) {
            if(obj.watchers[prop][i] === watcher){
                return;
            }
        }


        obj.watchers[prop].push(watcher); //add the new watcher in the watchers array


        var getter = function () {
            return val;
        };


        var setter = function (newval) {
            var oldval = val;
            val = newval;

            if (level !== 0 && obj[prop]){
                // watch sub properties
                if(prop!="PropertyChanged")
                 watchAll(obj[prop], watcher, (level===undefined)?level:level-1);
            }

            watchFunctions(obj, prop);

            if (!WatchJS.noMore){
                //if (JSON.stringify(oldval) !== JSON.stringify(newval)) {
                if (oldval !== newval) {
                    callWatchers(obj, prop, "set", newval, oldval);
                    WatchJS.noMore = false;
                }
            }
        };

        defineGetAndSet(obj, prop, getter, setter);

    };

    var callWatchers = function (obj, prop, action, newval, oldval) {
        if (prop) {
            for (var wr=0; wr<obj.watchers[prop].length; wr++) {
                obj.watchers[prop][wr].call(obj, prop, action, newval, oldval);
            }
        } else {
            for (var prop in obj) {//call all
                if (obj.hasOwnProperty(prop)) {
                    callWatchers(obj, prop, action, newval, oldval);
                }
            }
        }
    };

    // @todo code related to "watchFunctions" is certainly buggy
    var methodNames = ['pop', 'push', 'reverse', 'shift', 'sort', 'slice', 'unshift'];
    var defineArrayMethodWatcher = function (obj, prop, original, methodName) {
        defineProp(obj[prop], methodName, function () {
            var response = original.apply(obj[prop], arguments);
            watchOne(obj, obj[prop]);
            if (methodName !== 'slice') {
                callWatchers(obj, prop, methodName,arguments);
            }
            return response;
        });
    };

    var watchFunctions = function(obj, prop) {

        if ((!obj[prop]) || (obj[prop] instanceof String) || (!isArray(obj[prop]))) {
            return;
        }

        for (var i = methodNames.length, methodName; i--;) {
            methodName = methodNames[i];
            defineArrayMethodWatcher(obj, prop, obj[prop][methodName], methodName);
        }

    };

    var unwatchOne = function (obj, prop, watcher) {
        for (var i=0; i<obj.watchers[prop].length; i++) {
            var w = obj.watchers[prop][i];

            if(w == watcher) {
                obj.watchers[prop].splice(i, 1);
            }
        }

        removeFromLengthSubjects(obj, prop, watcher);
    };


    var loop = function(){

        for(var i=0; i<lengthsubjects.length; i++) {

            var subj = lengthsubjects[i];

            if (subj.prop === "$$watchlengthsubjectroot") {

                var difference = getObjDiff(subj.obj, subj.actual);

                if(difference.added.length || difference.removed.length){
                    if(difference.added.length){
                        watchMany(subj.obj, difference.added, subj.watcher, subj.level - 1, true);
                    }

                    subj.watcher.call(subj.obj, "root", "differentattr", difference, subj.actual);
                }
                subj.actual = clone(subj.obj);


            } else {

                var difference = getObjDiff(subj.obj[subj.prop], subj.actual);

                if(difference.added.length || difference.removed.length){
                    if(difference.added.length){
                        for (var j=0; j<subj.obj.watchers[subj.prop].length; j++) {
                            watchMany(subj.obj[subj.prop], difference.added, subj.obj.watchers[subj.prop][j], subj.level - 1, true);
                        }
                    }

                    callWatchers(subj.obj, subj.prop, "differentattr", difference, subj.actual);
                }

                subj.actual = clone(subj.obj[subj.prop]);

            }

        }

    };

    var pushToLengthSubjects = function(obj, prop, watcher, level){

        var actual;

        if (prop === "$$watchlengthsubjectroot") {
            actual =  clone(obj);
        } else {
            actual = clone(obj[prop]);
        }

        lengthsubjects.push({
            obj: obj,
            prop: prop,
            actual: actual,
            watcher: watcher,
            level: level
        });
    };

    var removeFromLengthSubjects = function(obj, prop, watcher){

        for (var i=0; i<lengthsubjects.length; i++) {
            var subj = lengthsubjects[i];

            if (subj.obj == obj && subj.prop == prop && subj.watcher == watcher) {
                lengthsubjects.splice(i, 1);
            }
        }

    };

    setInterval(loop, 50);

    WatchJS.watch = watch;
    WatchJS.unwatch = unwatch;
    WatchJS.callWatchers = callWatchers;

    return WatchJS;

}));


//删除数组后找不到对象的问题
Array.prototype.__ondelItem__={};
//增加remove方法(可用自定义列表处理)
Array.prototype.remove = function(item) {
    item.__ondel__ = true;
    this.sort(function(a,b){
        if(a.__ondel__)
            return 1;
        return 0;
    });
    this.__ondelItem__=item;
    this.pop();
};

//服务端转换对象
if(window!=undefined && window.Clr){
    window.IsClient = function(){
        return false;
    }

    global.OpLogItem= function(baseObj){
        this.OpStr = null;
        this.Op=0;
        this.RId=null;
        this.Ts=0;
        if(baseObj){
            this.Op = baseObj._Op;
            this.RId = baseObj._RId;
            this.Ts = baseObj._Ts;
            if(baseObj._opStr)
            {
                this.OpStr =  baseObj._opStr._Target;

            }
            if(baseObj._Ns){
                this.Ns=baseObj._Ns.substr(8);
            }

            if(baseObj._OId){
                this.OId=baseObj._OId;
            }
        }
    };

    global.OpLogItems=function(array){
        var resultArray= [];
        for(var item in array){
            if(array[item]._Op != undefined)
            {
                var newitem= new OpLogItem(array[item]);
                if(newitem.Op == 1 && JSON.stringify(newitem.OpStr)=="{}")
                {
                    continue;
                }
                resultArray.push(newitem);
            }
        }
        return resultArray;
    }
}
else
{
    window.IsClient = function(){
        return true;
    }
}

var uuidList= [];
//opSession for Client
var opSession = function(opitem,opid,svurl){
    this.Opid = opid;
    opitem._OpId = opid;
    this.BindItem = opitem;
    this.Ts = 0;
    var self = this;
    this.connected = false;
    this.url=svurl;

    this.socket;

    uuidList.push(this);

    this.Init=function(){
        if (typeof io == 'undefined') {
            this.socket = comet.connect(this.url);
        } else {
            this.socket = io.connect();
        }


        this.socket.on('connect', function() {
            console.log('connected');
            self.connected = true;
        }).on('sync.message', function (data)
            {
               if(self.connected)
               {
                    dochange(data,self);
                    var item={
                        Ts:self.Ts,
                        Opid:self.Opid,
                        count:data.count
                    };
                   self.socket.emit('sync.response', item);
                   console.log("do sync..");
                }

        });
    }

    this.doRpcCall=function ( fun , args){
        var rpcfun = {
            fun : fun ,
            args : JSON.stringify(args)
        };

        self.socket.emit("rpc.response",rpcfun);
        console.log("do Rcp:" + fun + " " + JSON.stringify(rpcfun));
    }

    var isFunction = function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    };

    var isInt = function (x) {
        return x % 1 === 0;
    };

    var isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    var buildSubItem = function(subitem,tagitem){
        if(typeof subitem == "string")
            return subitem;
        else if(isFunction(subitem))
            return subitem;

        else if(isArray(subitem))
        {
            var doret =false;
            if(tagitem == undefined || !isArray(tagitem))
            {
                tagitem = [];
                doret=true;
            }
            subitem.forEach(function(item){
                 var ret= buildSubItem(item, tagitem);
                    if(ret!=undefined)
                    {
                        tagitem.push(ret);
                    }
            });
            if(!doret)
                return undefined;
            else
                return tagitem;
        }
        else if(isInt(subitem))
            return subitem;
        else
        {
            var newItem = {};
            /*if(subitem.__type!=undefined)
            {
                eval(subitem.__type + ".call(newItem)");
            }*/

            if(tagitem!=undefined && tagitem.__type)
               tagitem.__type.call(newItem);
            for(var prop in subitem){
               var ret= buildSubItem(subitem[prop],newItem);
               if(ret != undefined)
                   newItem[prop]=ret;
            }

            return newItem;

        }
    };

    var findItem = function(root,opid,level){

        level--;
        if(level<=0)
            return null;

        if(root._OpId && root._OpId==opid)
            return root;

        for(var prop in root){
            var subitem = root[prop];
            if(subitem._OpId){
                if(subitem._OpId==opid)
                    return subitem;
                var ret = findItem(subitem,opid,level - 1);
                if(ret!=null)
                    return ret;
            }
            if(isArray(subitem)){
                for(var i= 0;i<=subitem.length ;i++){
                    var ret = findItem(subitem[i],opid,level - 1);
                    if(ret!=null)
                        return ret;
                }
            }
        }

        return null;
    }

    var dochange = function(changeData,bindItem){
        var count=0;

        for(var item in changeData){
            count++;
            if(count==1)
                console.log("dochange..:" + bindItem.BindItem._OpId);
            if(changeData[item].Ts && changeData[item].Ts>bindItem.Ts)
                bindItem.Ts=changeData[item].Ts;
            if(changeData[item].Op != undefined){
                var opitem=changeData[item];
                switch (opitem.Op){
                    case 0:
                    case 1:
                        var rootobj = bindItem.BindItem;

                        if(opitem.Op==0 && rootobj._OpId!=opitem.RId)
                            break;

                        if(opitem.Op==1) {
                           rootobj = findItem(rootobj,opitem.RId,5);
                        }
                        if(rootobj!=null){
                            for(var subitem in opitem.OpStr){
                               var ret= buildSubItem(opitem.OpStr[subitem],rootobj[subitem]);
                               if(ret!=undefined)
                                   rootobj[subitem]=ret;
                            }
                        }
                        break;

                    case 2:
                        var rootobj = findItem(bindItem.BindItem,opitem.RId,5);
                        rootobj[opitem.Ns].push(buildSubItem(opitem.OpStr,rootobj[opitem.Ns]));
                        break;
                    case 3:
                        var rootobj = findItem(bindItem.BindItem,opitem.RId,5);
                        rootobj[opitem.Ns].forEach(function(item){
                            if(item._OpId==opitem.OId){
                                rootobj[opitem.Ns].remove(item);
                            }
                        })
                        break;
                }
            }
        }
    };
}

setInterval(function(){
    for(var item in uuidList){
        var subitem =uuidList[item];
        if(subitem.connected!=undefined && subitem.connected==false){
            subitem.Init();
            break;
        }
    }
},100);

