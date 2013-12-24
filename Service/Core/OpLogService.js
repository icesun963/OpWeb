var logger = new Logger(__filename);

var OpLogService = function(){
    this.RootList = [];
    this.RootOpitems = [];

    this.RPCSetMaster = function(opitem){
        if(this.RootList.indexOf(opitem._OpId)>=0){
            logger.Warn("RPCSetMaster Error , OpItem:" + opitem._OpId + " Is Exist!")
            return;
        }
        var opid = opitem._OpId;
        JsOpItem.call(opitem);
        opitem.SetOpId(opid);
        OpLog.OpFunction.SetMaster(opitem);
        logger.Info("RPCSetMaster:" + opitem._OpId);
        this.RootList.push(opitem._OpId);
        this.RootOpitems.push(opitem);
    }

    this.RPCRemoveMaster = function(opid){
        this.RootList.remove(opid);
        this.RootOpitems.forEach(function(subitem){
            if(subitem._OpId==opid){
                this.RootOpitems.remove(subitem);
            }
        })

        logger.Info("RPCRemoveMaster:" +  JSON.stringify(opitem));
    }



    this.RPCUpdate = function(opid,rid,value){

        this.RootOpitems.forEach(function(subitem){
            if(subitem._OpId==opid){
                var finditem =findOpItem(subitem,rid,10);
                if(finditem!=null){
                    for(var prop in value){
                        finditem[prop]=value[prop];
                    }
                    logger.Info("RPCUpdate:" + opid + " rid:" + rid + " value:" +  JSON.stringify(value));
                }
            }
        })


    }


    this.RPCAdd = function(opid,rid,ns,value){
        this.RootOpitems.forEach(function(subitem){

            if(subitem._OpId==opid){
                var finditem = findOpItem(subitem,rid,10);
                if(finditem!=null){
                    JsOpItem.call(value);
                    finditem[ns].push(value);

                    logger.Info("RPCAdd:" + opid + " rid:" + rid + " ns:" + ns + " value:" + JSON.stringify(value));
                }
            }
        })

    }

    this.RPCRemove = function(opid,rid,ns,oid){
        this.RootOpitems.forEach(function(subitem){
            if(subitem._OpId==opid){
                var finditem = findOpItem(subitem,rid,10);
                if(finditem!=null){
                    finditem[ns].forEach(function(removeItem){
                        if(removeItem._OpId==oid){
                            finditem[ns].remove(removeItem);
                            logger.Info("RPCRemove:" + opid + " rid:" + rid + " ns:" + ns + " value:" +  JSON.stringify(removeItem));
                        }
                    })
                }
            }
        })
    }
}

AddService(OpLogService);

AddService(function () {
    CometServer(__dirname  + "/../../Web",8000);
});