var HashTable = undefined;

if(typeof Hashtable != "undefined"){
    HashTable = Hashtable;
}
if(typeof  HashTable == "undefined"){
    HashTable = require("./Hashtable.js");
}

var OpItem = function (opid){
    var unique_id = (function() {
        return function (){
            function _p8(s) {
                var p = (Math.random().toString(16)+"000000000").substr(2,8);
                return s ? "" + p.substr(0,4) + "" + p.substr(4,4) : p ;
            }
            return _p8() + _p8(true) + _p8(true) + _p8();
        }
    })();

    this._OpId = unique_id().substring(0,24);
    if(opid!=undefined){
        this._OpId = opid;
    }
    this._id = this._OpId;
    this.SetOpId = function(opid){
        this._OpId =opid;
        this._id =opid;
    }

    this.GetIdItem = function(){
        return { _id : this._id };
    }

}

var NoSqlSync = function(db,opdb,logout,opitemType){
    if(logout==undefined)
        logout = true;
    if(opitemType==undefined)
        opitemType = OpItem;
    var bindopid = "";

    var timeSeed = 0;
    var GetTs = function(){
        timeSeed ++;
        if(timeSeed>=1000)
            timeSeed = 1;
        var ts = new Date().getTime() * 1000;

        return ts + timeSeed;
    }


    var OnCallBack =function(err,result){

    };

    var Insert = function(opitem, callback, count){
        if(count==undefined){
            count = { count : 0};
        }
        if(logout)
            console.log("Insert :" + JSON.stringify(opitem));
        count.count++;
        if(logout)
            console.log("Insert :" + opitem._id + " count:" +count.count);

        ReWatch(opitem);

        db.findOne(opitem.GetIdItem(), function(err,result){
            count.count--;
            if(result==null){
                var newobj = {};

                $$(opitem).forEach(function(value,prop){
                    if(value!=null && value.hasOwnProperty("_OpId"))
                    {
                        newobj[prop]= {
                            _OpId : value._OpId
                        };
                        var opid = value._OpId;
                        if(!value.GetIdItem){
                            opitemType.call(value);
                            value.SetOpId(opid);
                        }
                        Insert(value, callback ,count);
                    }
                    else if(value!=null && isArray(value))
                    {
                        newobj[prop] = [];
                        value.forEach(function(subitem){
                            newobj[prop].push({
                                _OpId : subitem._OpId
                            });
                            Insert(subitem, callback ,count);
                        })
                    }
                    else
                    {
                        newobj[prop] = value;
                    }

                });

                count.count++;

                db.insert( newobj,function(errx,resultx){
                    count.count--;
                    if(count.count==0){
                        if(logout)
                            console.log("Insert Callback:" + opitem._id + " count:" +count.count);
                        count.count--;
                        if(callback){
                            callback();
                        }
                    }
                })
            }
            else
            {
                if(count.count==0){
                    if(logout)
                        console.log("Insert Callback:" + opitem._id + " count:" +count.count);
                    count.count--;
                    if(callback){
                        callback();
                    }
                }
            }
        })



    }

    var NewOpLog = function(rid,op,opstr,ns,oid){
        var logitem= {};
        logitem._Ts=GetTs();
        logitem._Op=op;
        logitem._RId=rid;
        logitem._Ns=ns;
        logitem._OId=oid;
        logitem._OpStr=buildSubItem(opstr,null,true);
        logitem.__bindopid = bindopid;
        opdb.insert(logitem,OnCallBack);
    }

    var Update = function(opitem,prop,value,oldvalue){
        var update= {};
        update[prop]=value;

        if(value!=null && value.hasOwnProperty("_OpId")){
            update[prop]={
                _OpId : value._OpId
            };
        }
        if(oldvalue!=null && oldvalue.hasOwnProperty("_OpId"))
        {
            db.remove({ _id : oldvalue._id })
        }
        db.update({ _id : opitem._id }, { $set : update } );

        if(logout)
            console.log(GetTs() + " Update:" + opitem._id + " >>" + JSON.stringify(update));


        NewOpLog(opitem._OpId,1,update);
    }

    var AddSubItem = function(opitem,prop,value){
        var update= {};
        update[prop]={ _OpId : value._OpId };
        db.update({ _id : opitem._id }, { $push : update }, OnCallBack);
        if(logout)
            console.log(GetTs() +  " AddSubItem:" + opitem._OpId + " " + prop + " >>" + JSON.stringify(update));

        Insert(value);

        NewOpLog(opitem._OpId, 2,value,prop,value._OpId);
    }

    var RemoveSubItem = function(opitem,prop,value){
        var update= {};
        update[prop]={ _OpId : value._OpId };
        db.update({ _id : opitem._id }, { $pull : update } , OnCallBack);
        if(logout)
            console.log(GetTs() +  " RemoveSubItem:" + opitem._OpId + " " + prop + " >>" + JSON.stringify(update));
        db.remove({ _id : value._id } , OnCallBack);
        NewOpLog(opitem._OpId, 3,null,prop,value._OpId);
    }

    var Load = function (opitem,callback,count,dowatch){

        if(count==undefined)
            count = { count : 0 };
        count.count++;
        if(logout)
            console.log("load:" + opitem._OpId + " count:" + count.count);
        db.findOne({ _id : opitem._id },function(err,result){
            count.count--;
            if(result){
                if(logout)
                    console.log("result:" + JSON.stringify( result ));

                $$(result).forEach(function(value,prop){
                    if(value!=null && value.hasOwnProperty("_OpId"))
                    {
                        var subItem = new opitemType(value._OpId);
                        subItem.SetOpId(value._OpId);

                        opitem[prop]=subItem;

                        Load(subItem,callback,count,true);

                    }
                    else if(isArray(value))
                    {
                        opitem[prop] = [];
                        value.forEach(function(subvalue){
                            var opid = subvalue._OpId;
                            opitemType.call(subvalue);
                            subvalue.SetOpId(opid);
                            Load(subvalue,callback,count,true);
                            opitem[prop].push(subvalue);

                        });
                    }
                    else
                    {
                        opitem[prop]=value;
                    }
                });

                if(dowatch != false)
                    ReWatch(opitem);

                if(logout)
                    console.log("opitem:" + JSON.stringify( opitem ));

                if(logout)
                    console.log("count:" +  count.count);


            }
            else{
                console.warn("lost:" + opitem._OpId)
            }

            if(count.count==0){
                if(logout)
                    console.log("callback:" + opitem._OpId );
                if(callback){
                    callback();
                }
            }
        });
    }

    var Exist = function(opitem,callback){
        db.findOne(opitem.GetIdItem() ,function(err,result){
                if(callback){
                    callback(result!=null);
                }
                if(err){
                    console.error(err);
                }
            }
        );
    }

    var ReWatch = function(opitem){

        try
        {
            unwatch(opitem);
        }
        catch(ex)
        {

        }

        watch(opitem, function (prop, action, newval, oldval) {
            if (action == "set" && !isArray(this))
            {
                Update(opitem,prop,newval,oldval);
                if(newval!=null && newval.hasOwnProperty("_OpId")){
                    AddSubItem(newval,prop,newval);
                }
            }

            if (action == "push") {
                AddSubItem(opitem,prop,newval[0]);
                if(newval[0]!=null && newval[0].hasOwnProperty("_OpId")){
                    //console.log(">>ReWatch:" +newval[0]);
                    ReWatch(newval[0]);
                }
            }
            else if (action == "pop") {
                RemoveSubItem(opitem,prop,opitem[prop].$del());
            }

            //console.log(">>prop:" + prop + " act:" + action);
        });
    }

    this.HaseSetMaster = function(opitem,callback){
        db.findById(opitem._id,callback)
    }

    this.SetMaster = function(opitem,callback){
        bindopid = opitem._OpId;
        Exist(opitem , function(value){
            if(value)
            {
                Load(opitem,function(){
                    if(callback)
                        callback(opitem,false);

                    //console.log("Exist");
                });

            }
            else
            {
                Insert(opitem,function(){

                    if(callback)
                        callback(opitem,true);
                    //console.log("Insert");
                });

            }
        })
    }


    this.GetChangeData = function(opitem,ts,callback){
        var self={
            ts:ts,
            opitem:opitem,
            callback:callback
        };
        var querycallBack = function(err,result){
            //console.log("querycallBack:" + JSON.stringify(self));
            if(result!=null && result.length>0){
                result.sort(function(x,y){
                    return x._Ts - y.Ts;
                });
                //console.log("querycallBack:" + JSON.stringify(result));
            }
            if(self.ts <=0 ){
                var ts = GetTs();

                if(self.callback)
                {
                    self.callback([{
                        _Op : 0,
                        _Ts : ts,
                        _OpStr : self.opitem ,
                        _RId : self.opitem._OpId
                    }]);
                }
            }else{
                var oplist = [];
                if(result!=null  && result.length>0)
                {
                    var list = [];
                    result.forEach(function(subitem){
                        if(subitem._Ts>self.ts){
                            list.push(subitem);
                        }
                    })


                    if(list.length>0){

                        var addDic = new HashTable();
                        var removeDic  = new HashTable();
                        var updateDic = new HashTable();
                        list.forEach(function(subitem){



                            if(subitem._Op==1){
                                var item = updateDic.get(subitem._RId);
                                if(item==undefined){
                                    updateDic.put(subitem._RId , subitem);
                                }
                                else {
                                    if(subitem._Ts>item._Ts){
                                        item._Ts=subitem._Ts;
                                    }
                                    for(var x in subitem._OpStr){
                                        item[x] = subitem._OpStr[x];
                                    }
                                }

                            }
                            else if(subitem._Op==2){
                                addDic.put(subitem._RId,subitem);

                            } else if(subitem._Op==3){
                                removeDic.put(subitem._RId,subitem);
                            }
                        });

                        removeDic.forEach(function(subitem){
                            oplist.push(subitem.value);
                        });
                        addDic.forEach(function(subitem){
                            oplist.push(subitem.value);
                        });
                        updateDic.forEach(function(subitem){
                            oplist.push(subitem.value);
                        });
                    }

                }
                ///console.log("oplist allBack:" + JSON.stringify(oplist));
                if(self.callback)
                {
                    self.callback(oplist);
                }
            }
        };


        opdb.find({__bindopid : opitem._OpId , _Ts : { $gt: ts }} ,function(error,result){
            if(isArray(result)){
                querycallBack(error,result);
            }
            else{
                if(result.toArray!=undefined){
                    result.toArray(querycallBack);
                }
            }
        });

    }
}
if (typeof exports === 'object') {
    module.exports = NoSqlSync;
}