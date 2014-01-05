var HashTable = Hashtable;
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

var nedbSync = function(){

    var db =  new Nedb();
    var opdb = new Nedb();
    var logout = false;
    NoSqlSync.call(this,db,opdb,logout)
}


if(window.OpLog==undefined){
    window.OpLog={};
}
if(window.OpLog.OpFunction==undefined){
    window.OpLog.OpFunction={};
}

var session = new nedbSync();

OpLog.OpFunction.SetMaster = function(opitem,callback){
    session.SetMaster(opitem,callback);
};

OpLog.OpFunction.GetChangeData = function(ts,opid,callback){
    var opitem = new OpItem();
    opitem.SetOpId(opid);
    ts = parseInt(ts);
    if(ts<=0)
    {
        session.SetMaster(opitem,function(){
            session.GetChangeData(opitem,parseInt(ts),function(data){
                if(callback)
                    callback(data);

            });
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

