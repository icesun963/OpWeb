
"use strict";
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
    return x % 1 === 0;
};

window.isArray = function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};

//删除数组后找不到对象的问题
Array.prototype.__ondelItem__={};
//增加remove方法(可用自定义列表处理)
Array.prototype.remove = function(item) {

    /*
     var index= this.indexOf(item);
     if(index>=0)
     this.splice(this.indexOf(item), 1);
     */

    item.__ondel__ = true;
    if(this.length>1)
    {
        this.sort(function(a,b){
            if(a.__ondel__)
                return 1;
            return 0;
        });
    }

    this.__ondelItem__=item;
    this.pop();

};

window.findOpItem = function(root,opid,level){

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
            var ret = findOpItem(subitem,opid,level - 1);
            if(ret!=null)
                return ret;
        }
        if(isArray(subitem)){
            for(var i= 0;i<=subitem.length ;i++){
                var ret = findOpItem(subitem[i],opid,level - 1);
                if(ret!=null)
                    return ret;
            }
        }
    }

    return null;
}

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
                ret.__isremote = true;
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
            if(subitem.__defineProps){
                if(subitem.__defineProps.indexOf(prop)==-1){
                    continue;
                }
            }
            var ret= buildSubItem(subitem[prop],newItem);
            if(ret != undefined)
                newItem[prop]=ret;
        }

        return newItem;

    }
};


if(window!=undefined && window.ServiceConfig){
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
            this.OpStr = JSON.parse(JSON.stringify(this.OpStr));
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

    var watchList=[];

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
                if(prop.indexOf("__")==0)
                    return;
                if(action=="push")
                    console.log(">>" + prop + " " + action  + " " + JSON.stringify(newval[0]) );
                if(action=="set")
                    console.log(">>" + prop + " " + action  + " " + JSON.stringify(newval) );
                if(action=="pop")
                    console.log(">>" + prop + " " + action  + " " + JSON.stringify(buildSubItem(findwatch.obj[prop].__ondelItem__)) );

                findwatch.calls.forEach(function(subcallback){
                    if(action=="pop")
                    {
                        subcallback(prop,action,findwatch.obj[prop].__ondelItem__,oldval);
                    }else{
                        subcallback(prop,action,newval,oldval);
                    }
                });
            });
        }

        findwatch.calls.push(callback);

        if(obj.__defineProps == undefined){
            var props = [];
            props.push("_OpId");
            for(var prop in obj){
                props.push(prop);
            }
            obj.__defineProps = props;
        }
    }

    window.doUIWatch = function(obj,callback){

        doWatch(obj,function(prop, action, newval, oldval){

            if(action=="push"){
                if(newval[0].__isremote==true){
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
                if(newval[0].__isremote != true){
                    session.doRpcCall("RPCAdd",[self.Opid,self.OpItem._OpId,prop,buildSubItem(newval[0])]);
                }
                else{
                    new opBind(newval[0],session);
                }
            }
            if(action=="pop"){
                //if(newval.__isremote != true)
                session.doRpcCall("RPCRemove",[self.Opid,self.OpItem._OpId,prop,newval._OpId]);
            }
            if(action=="set"){
                var value = {};
                value[prop] = buildSubItem(newval);
                session.doRpcCall("RPCUpdate",[self.Opid,self.OpItem._OpId , value]);
            }
        });
    }

    var opSession = function(opitem,opid,svurl,userRPC){
        this.Opid = opid;
        opitem._OpId = opid;
        this.BindItem = opitem;
        this.Ts = 0;
        var self = this;
        this.connected = false;
        if(svurl==undefined)
            svurl="";
        this.url=svurl;

        this.socket;

        uuidList.push(this);

        if(userRPC == true){
            new opBind(opitem,this);
        }

        this.Init=function(){
            if (typeof io == 'undefined') {
                this.socket = comet.connect(this.url);
            } else {
                this.socket = io.connect();
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
                    self.doRpcCall("RPCSetMaster",[ buildSubItem(opitem) ],1);
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
                                rootobj = findOpItem(rootobj,opitem.RId,5);
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
                            var rootobj = findOpItem(bindItem.BindItem,opitem.RId,5);
                            var newitem = buildSubItem(opitem.OpStr,rootobj[opitem.Ns]);
                            newitem.__isremote = true;
                            rootobj[opitem.Ns].push(newitem);
                            break;
                        case 3:
                            var rootobj = findOpItem(bindItem.BindItem,opitem.RId,5);
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

    window.opSession = opSession;
}



