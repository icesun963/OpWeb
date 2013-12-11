
//************************
//服务端代码
var myApp = function(){
    var listdb=function(){
        this.lists = [];
        this.count = 1;
        JsOpItem.call(this);

    };

    var listItem=function(value){
        this.value=value;
        JsOpItem.call(this);
    };

    var dbroot= new listdb();
    dbroot._OpId="1000";
    OpLog.OpFunction.SetMaster(dbroot);
    var dbroot2= new listdb();
    dbroot2._OpId="1001";
    OpLog.OpFunction.SetMaster(dbroot2);


    this.RPCAddItem = function (userto ,value){
        console.log(" RPCAddItem:  " + userto + " " + value);
        var subItem = new listItem(value);
        if(userto)
            dbroot2.lists.push(subItem);
        else
            dbroot.lists.push(subItem);

        return subItem._OpId;
    };


    this.RPCDelItem = function (userto , value){
        dbroot.lists.forEach(function(item){
            if(item._OpId==value){
                dbroot.lists.remove(item);
            }
        });
        dbroot2.lists.forEach(function(item){
            if(item._OpId==value){
                dbroot2.lists.remove(item);
            }
        });
    };
    this.RPCSetItemValue =function (opid , value){
        dbroot.lists.forEach(function(item){
            if(item._OpId==opid){
                item.value=value;
            }
        });
        dbroot2.lists.forEach(function(item){
            if(item._OpId==opid){
                item.value=value;
            }
        });
    };

    AddRPC(this);
};
AddService(function () {
    CometServer(__dirname  + "/web",8000);
});
AddService(myApp);
