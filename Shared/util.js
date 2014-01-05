
"use strict";

var basefunction = function(){

    window.addEvent = function(fun1,fun2){
       var funDefine = function(){
           this.__funs = [];
           var self = this;
           this.run = function(){
               var runargs = arguments;
               var selfarg = this;
               self.__funs.forEach(function(subfun){
                   var args = [];
                   for(var i = 0 ; i<runargs.length ;i++){
                       args.push(runargs[i]);
                   }
                   subfun.apply(selfarg,args);
               });
           }
       };
       var fun = new funDefine();
       if(fun1!=null && fun1.__funs){
           fun1.__funs.push(fun2);
           return fun1.run;
       }
       else
       {
           if(fun1!=null){
               fun.__funs.push(fun1);
           }
           fun.__funs.push(fun2);
           return fun.run;

       }


    };


     window.dumpError = function(err) {
        if (typeof err === 'object') {
            if (err.message) {
                console.log('\nMessage: ' + err.message)
            }
            if (err.stack) {
                console.log('\nStacktrace:')
                console.log('====================')
                console.log(err.stack);
            }
        } else {
            console.log('dumpError :: argument is not an object');
        }
    }

    String.prototype.startsWith = function (str) {
        return this.indexOf(str) == 0;
    }

    String.prototype.endsWith = function (str) {
        return this.substr(this.length - str.length, str.length) == str;
    }

    window.isFunction = function (functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
    };

    window.isInt = function (x) {
        return  x % 1 === 0;
    };

    window.isFloat = function(n){
        return n === +n && n !== (n|0);
    }

    window.isInteger = function(n){
        return n === +n && n === (n|0);
    }

    window.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };

    window.isString =function(obj){
        if(typeof obj == "string")
            return true;
        return false;
    }

    window.isValue = function(obj){
        if(isArray(obj))
            return false;
        if(isString(obj) || isInt(obj) || isFloat(obj)){
            return true;
        }
        return false;
    }


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

    var OpObject = function(){
        var self = this;
        this.$$ = function(){

        };

        this.$$.isOpItem = function(){
            return self.hasOwnProperty("_OpId") ;
        }

        this.$$.isSameOpId = function(opid){
            return self.$$.isOpItem() && self._OpId == opid;
        }

        this.$$.$get = function(prop){
            if(self.hasOwnProperty(prop)){
                return self[prop];
            }

            if(self.$$.hasOwnProperty("__hide__")){
                return self.$$.__hide__[prop];
            }
            return undefined;
        }

        this.$$.$set = function(prop,value){
            if(self.hasOwnProperty(prop)){
                self[prop] = value;
            }
            else{
                if(self.$$.hasOwnProperty("__hide__") == false){
                    defineProp(self.$$,"__hide__",{});
                    if( self.$$.__hide__  ==undefined)
                        self.$$.__hide__ = function(){

                        };
                }
                self.$$.__hide__[prop] = value;
            }
        }



        this.$$.getProperties = function(){
            var passProp = [];
            if(window.passProperty!=undefined){
                passProp=window.passProperty;
            }
            var props = self.$$.$get("Properties");
            if(props == undefined){
                props = [];
            }
            else {
                return props;
            }
            for (var prop in self){
                if(prop.indexOf("__")==0)
                    continue;
                if(passProp.indexOf(prop)>0)
                    continue;
                if(prop.indexOf("$")==0)
                    continue;
                if(isFunction(self[prop])){
                    continue;
                }
                props.push(prop);
            }
            return props;
        };

        this.$$.forEach = function(callback){
            self.$$.getProperties().forEach(function(prop){
                callback(self[prop],prop);
            });
        };

        this.$$.hasPropertiesDefine = function(){
            return self.$$.$get("Properties") != undefined;
        }

        this.$$.setProperties = function(properties){
            this.$set("Properties",properties);
        }

        if(IsClient()){
            this.$$.isRemote = function(){
               return self.$$.$get("isRemote") == true;
            };
            this.$$.setRemote = function(){
                self.$$.$set("isRemote",true);
            };
        }
    };

    window.$$ = function(obj){
        if(obj.$$ == undefined)
            OpObject.call(obj);
        return obj.$$;
    }


    Array.prototype.indexOf = function(e){
        for(var i=0,j; j=this[i]; i++){
            if(j==e){return i;}
        }
        return -1;
    };

    //删除数组后找不到对象的问题
    Array.prototype.$del = function(){
        return $$(this).$get("__del__");
    };
    //增加remove方法(可用自定义列表处理)
    Array.prototype.remove = function(item) {
        $$(item).$set("__ondel__", true);
        if(this.length>1)
        {
            this.sort(function(a,b){
                if($$(a).$get("__ondel__"))
                    return 1;
                return 0;
            });
        }

        $$(this).$set("__del__",item);
        this.pop();

    };
}

basefunction();

window.findOpItem = function(root,opid,level){
    level--;
    if(level<=0 || root==null || root==undefined)
        return null;

    if($$(root).isSameOpId(opid))
        return root;

    var props = $$(root).getProperties();
    for(var index in props){
        var prop = props[index];
        var subitem = root[prop];
        if(subitem==null || subitem==undefined)
            continue;
        if(subitem.hasOwnProperty("_OpId")){
            if($$(subitem).isSameOpId(opid))
                return subitem;
            var ret = findOpItem(subitem,opid,level - 1);
            if(ret!=null)
                return ret;
        }
        if(isArray(subitem)){
            for(var i= 0;i<=subitem.length ;i++){
                if(subitem[i].hasOwnProperty("_OpId")){
                    var ret = findOpItem(subitem[i],opid,level - 1);
                    if(ret!=null)
                        return ret;
                }
            }
        }
    }

    return null;
}

window.buildSubItem = function(subitem,tagitem,notremote,pass){


    if(subitem==undefined || subitem==null){
        return null;
    }
    if(pass==undefined){
        pass=[ ];
    }

    if(isValue(subitem))
    {
        return subitem;
    }
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
            var ret= buildSubItem(item, tagitem,notremote,pass);
            if(ret!=undefined)
            {
                if(notremote!=true)
                    $$(ret).setRemote();
                tagitem.push(ret);
            }
        });
        if(!doret)
            return undefined;
        else
            return tagitem;
    }
    else
    {
        var newItem = { };

        if(tagitem!=undefined && tagitem.__type)
            tagitem.__type.call(newItem);

        if(notremote!=true ){
            $$(newItem).setRemote();
        }



        $$(subitem).forEach(function(value,prop){
            if(pass.indexOf(prop)>=0){
                return;
            }
            var ret= buildSubItem(value,tagitem !=null ? tagitem[prop] : null,notremote,pass);
            if(ret != undefined)
                newItem[prop]=ret;
        });

        return newItem;

    }
};

window.OpLogItem= function(baseObj){

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
            if(baseObj._opStr.hasOwnProperty("_Target"))
                this.OpStr =  baseObj._opStr._Target;
            else
                this.OpStr =  baseObj._opStr;

        }
        if(baseObj._OpStr)
        {
            this.OpStr = baseObj._OpStr;
        }
        if(baseObj._Ns){
            if(baseObj._Ns.startsWith("__list__"))
                this.Ns=baseObj._Ns.substr(8);
            else
                this.Ns=baseObj._Ns;
        }

        if(baseObj._OId){
            this.OId=baseObj._OId;
        }
    }

    if(this.OpStr){
        var pass = [];
        if(typeof  opStrPassProperty != "undefined")
            pass = opStrPassProperty;
        this.OpStr = buildSubItem(this.OpStr,null,true,pass);
    }
};

window.OpLogItems=function(array){
    var resultArray= [];
    for(var item in array){
        if(array[item]!=undefined && array[item]._Op != undefined)
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

if(window!=undefined && window.ServiceConfig){
    window.IsClient = function(){
        return false;
    }
}
else
{
    window.IsClient = function(){
        return true;
    }

    window.Logger = function(name){
        this.Trace = function (msg) {
            console.log(msg);
        }
        this.Debug = function (msg) {
            console.log("{" + msg + "}");
        }
        this.Info = function (msg) {
            console.log("[" + msg + "]");
        }
        this.Warn = function (msg) {
            console.log("(" + msg + ")");
        }
        this.Error = function (msg) {
            console.log("*"  + msg + "*" );
        }
        this.Fatal = function (msg) {
            console.log("*"  + msg + "*" );
        }

    }

    var watchList=[];

    window.watch = function(obj,callback){
        return WatchJS.watch(obj, $$(obj).getProperties(),callback , 0);
    };

    window.doWatch = function(obj,callback){
        var findwatch = undefined;
        watchList.forEach(function(subitem){
            if(subitem.obj == obj){
                findwatch = subitem;
            }
        });

        if(findwatch == undefined){
            findwatch = {obj : obj , calls :[]};
            watchList.push(findwatch);

            watch(obj,function(prop, action, newval, oldval){

                if($$(obj).getProperties().indexOf(prop)==-1)
                    return;
                if(action=="push")
                    console.log(">>" + prop + " " + action  + " " + JSON.stringify(newval[0]) );
                if(action=="set")
                    console.log(">>" + prop + " " + action  + " " + JSON.stringify(newval) );
                if(action=="pop")
                    console.log(">>" + prop + " " + action  + " " + JSON.stringify(buildSubItem(findwatch.obj[prop].$del())) );

                findwatch.calls.forEach(function(subcallback){
                    if(action=="pop")
                    {
                        subcallback(prop,action,findwatch.obj[prop].$del(),oldval);
                    }else{
                        subcallback(prop,action,newval,oldval);
                    }
                });
            });
        }

        findwatch.calls.push(callback);

        if($$(obj).hasPropertiesDefine() == false){
            var props =$$(obj).getProperties();
            if(props.indexOf("_OpId")==-1){
                props.push("_OpId");
            }
            $$(obj).setProperties(props);
        }
    }

    window.doUIWatch = function(obj,callback){
        doWatch(obj,function(prop, action, newval, oldval){
            if(action=="push"){
                if($$(newval[0]).isRemote()){
                    callback(prop,action,newval,oldval);
                }
            }else{
                callback(prop,action,newval,oldval);
            }
        })
    }


    var uuidList= [];
    //opSession for Client
    var opBind = function(opitem,session){
        this.Opid = session.Opid;
        this.OpItem = opitem;
        var self = this;
        doWatch(this.OpItem,function(prop, action, newval, oldval){
            if(action=="push"){
                if($$(newval[0]).isRemote() == false){
                    session.doRpcCall("RPCAdd",[self.Opid,self.OpItem._OpId,prop,buildSubItem(newval[0],null,true)]);
                }
                else{
                    new opBind(newval[0],session);
                }
            }
            if(action=="pop"){
                session.doRpcCall("RPCRemove",[self.Opid,self.OpItem._OpId,prop,newval._OpId]);
            }
            if(action=="set"){
                if(isValue(newval)==false){
                    if($$(newval).isRemote()){
                        return;
                    }
                }
                var value = {};
                value[prop] = buildSubItem(newval,null,true);
                session.doRpcCall("RPCUpdate",[self.Opid,self.OpItem._OpId ,  value]);
            }
        });
        //Bind Sub item
        $$(opitem).forEach(function(value){
            if(isValue(value)){
                return;
            }
            else if(isArray(value)){
                value.forEach(function(subitem){
                    new opBind(subitem ,session);
                });
            }
            else if($$(value).isOpItem()){
                new opBind(value,session);
            }
        });

    }

    var opSession = function(opitem,opid,svurl,userRPC,mysocket){
        if(svurl=="/"){
            svurl = "http://" + window.location.host ;
        }
        this.Opid = opid;
        opitem._OpId = opid;
        this.BindItem = opitem;
        this.Ts = 0;
        var self = this;
        this.connected = false;
        this.connecting = false;
        if(svurl==undefined)
            svurl="";
        this.url=svurl;

        this.socket=mysocket;

        uuidList.push(this);

        /*if(userRPC == true){
            new opBind(opitem,this);
        }*/

        this.Init=function(){
            this.connecting = true;
            if(this.socket==undefined){
                if (typeof io == 'undefined') {
                    this.socket = comet.connect(this.url);
                } else {
                    this.socket = io.connect();
                }
            }


            this.socket.on('connect', function() {
                console.log('connected');
                self.connected = true;
            });
            this.socket.on('sync.message', function (data) {
                if(self.connected){

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
            this.socket.on('sync.error',function (data){
                if(userRPC)
                {
                    self.doRpcCall("RPCSetMaster",[ buildSubItem(self.BindItem,null,true) ],1);
                }
            });
            this.socket.on('rpc.result',function (data){
                if(data.rid=="1"){
                    var item={
                        Ts:self.Ts,
                        Opid:self.Opid,
                        count:data.count
                    };
                    self.socket.emit('sync.response', item);
                };
            });
        }

        this.doRpcCall=function ( fun , args , cid){

            var rpcfun = {
                fun : fun ,
                args : JSON.stringify(args)
            };
            if(cid){
                rpcfun.cid = cid;
            }

            self.socket.emit("rpc.response",rpcfun);
            console.log("do Rcp:" + fun + " " + JSON.stringify(rpcfun));
        }

        var dochange = function(changeData,bindItem){
            var count=0;

            for(var item in changeData){
                count++;
                if(count==1)
                    console.log("dochange..:" + bindItem.BindItem._OpId + " " + JSON.stringify(changeData));
                if(changeData[item].Ts && changeData[item].Ts>bindItem.Ts)
                    bindItem.Ts=changeData[item].Ts;
                if(changeData[item].Op != undefined){
                    var opitem=changeData[item];
                    switch (opitem.Op){
                        case 0:
                        case 1:
                            var rootobj = bindItem.BindItem;

                            if(opitem.Op==0 && $$(rootobj).isSameOpId(opitem.RId) == false)
                                break;

                            if(opitem.Op==1) {
                                rootobj = findOpItem(rootobj,opitem.RId,5);
                            }
                            if(rootobj!=null){
                                for(var subitem in opitem.OpStr){
                                    var ret= buildSubItem(opitem.OpStr[subitem],rootobj[subitem]);
                                    if(ret != undefined)
                                        rootobj[subitem]=ret;
                                }
                            }

                            if(opitem.Op==0){
                                if(userRPC == true){
                                    new opBind(rootobj,self);
                                }
                            }

                            break;

                        case 2:
                            var rootobj = findOpItem(bindItem.BindItem,opitem.RId,5);
                            var newitem = buildSubItem(opitem.OpStr,rootobj[opitem.Ns]);
                            rootobj[opitem.Ns].push(newitem);
                            break;
                        case 3:
                            var rootobj = findOpItem(bindItem.BindItem,opitem.RId,5);
                            rootobj[opitem.Ns].forEach(function(item){
                                if($$(item).isSameOpId(opitem.OId)){
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
            if(subitem.connected!=undefined && subitem.connected==false && subitem.connecting == false){
                subitem.Init();
                break;
            }
        }
    },100);

    window.opSession = opSession;
}



