
if(window==undefined){
    window=global;
}

opStrPassProperty.push("_id");


var logger = new Logger(__filename);
var mongoskin = require("mongoskin");

var HashTable =require("./../../Shared/Hashtable.js");
var NoSQLSync =require("./../../Shared/NoSQLSync.js");

var OpItem = function (){
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
    this._id = mongoskin.ObjectID.createFromHexString(this._OpId) ;
    this.SetOpId = function(opid){
        this._OpId =opid;
        for (var i = opid.length ;i < 24; i++) {
            opid="0" + opid;
        }

        this._id = mongoskin.ObjectID.createFromHexString(opid) ;
    }

    this.GetIdItem = function(){
        return { _id : this._id };
    }

}


var dbMap = new HashTable();
var mongoSync = function(host,setcloname){
    host =  host ? host : "localhost:27017/opweb?auto_reconnect=true"
    var mdb = dbMap.get(host);
    if(mdb==undefined){
        mdb = mongoskin.db(host
             , {safe:false}
        );
        dbMap.put(host,mdb);
        mdb.open(function(err){
            if(err)
                console.error(err);
        });
    }


    var colname = setcloname ? setcloname : "db";
    var db = mdb.collection(colname);
    var opdb = mdb.collection(colname + "_log");
    var logout = false;
    NoSQLSync.call(this,db,opdb,logout,OpItem);

}
var MongoApp = function(){
    if(window.Config==undefined){
        window.Config = {}
    }

    if(window.Config.Mongo==undefined){
        window.Config.Mongo = {}
    }

    if(Config.Mongo.SyncOff == false){
        logger.Info("User MongoSync On!");

        if(window.OpLog==undefined){
            window.OpLog={};
        }
        if(window.OpLog.OpFunction==undefined){
            window.OpLog.OpFunction={};
        }


        if(OpLog.OpFunction.OnSetMaster == undefined){
            OpLog.OpFunction.OnSetMaster = function(){};
        }

        OpLog.OpFunction.SetMaster = function(opitem,callback){
            var session = new mongoSync(Config.Mongo.Uri,Config.Mongo.Db);
            session.SetMaster(opitem,function(opdata,value){
                if(typeof OpLog.OpFunction.OnSetMaster != "undefined"){
                    OpLog.OpFunction.OnSetMaster(opdata);
                }
                if(callback)
                    callback(opdata,value);
            });

        };

        OpLog.OpFunction.GetChangeData = function(ts,opid,callback){
            var session = new mongoSync(Config.Mongo.Uri,Config.Mongo.Db);
            var opitem = new OpItem();
            opitem.SetOpId(opid);
            ts = parseInt(ts);
            if(ts<=0)
            {
                session.HaseSetMaster(opitem,function(err,doc){
                    if(doc==null){
                        callback(undefined,new Error("Master Not Found!"));
                    }else{
                        session.SetMaster(opitem,function(opdata,value){
                            if(typeof OpLog.OpFunction.OnSetMaster != "undefined"){
                                OpLog.OpFunction.OnSetMaster(opdata);
                            }
                            session.GetChangeData(opitem,parseInt(ts),function(data){
                                if(callback)
                                    callback(data);

                            });
                        });
                    }

                });

            }
            else
            {
                session.GetChangeData(opitem,ts,function(data){
                    if(callback)
                        callback(data);
                });
            }
        };

        window.JsOpItem = OpItem;
    }else{
        logger.Info("User MongoSync Off!");
    }
}
AddService(MongoApp);
