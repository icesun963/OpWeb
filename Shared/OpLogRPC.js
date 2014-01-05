var logger = new Logger(typeof __filename != "undefined"  ? __filename : undefined);

var OpLogService = function(){
    this.RootList = [];
    this.RootOpitems = [];
    var self = this;
    if(typeof OpLog.OpFunction.OnSetMaster != "undefined"){
        OpLog.OpFunction.OnSetMaster = addEvent(OpLog.OpFunction.OnSetMaster,function(opitem){
             if(self.RootList.indexOf(opitem._OpId)==-1){
                 self.RootList.push(opitem._OpId);
                 self.RootOpitems.push(opitem);
                 logger.Info("RPCOnSetMaster:" + opitem._OpId);
             }

         })
    }

    this.RPCSetMaster = function(opitem){
        if(opitem==null || !opitem.hasOwnProperty("_OpId"))
            return;
        if(this.RootList.indexOf(opitem._OpId)>=0){
            logger.Warn("RPCSetMaster Error , OpItem:" + opitem._OpId + " Is Exist!")
            return;
        }
        var opid = opitem._OpId;
        JsOpItem.call(opitem);
        opitem.SetOpId(opid);
        OpLog.OpFunction.SetMaster(opitem);
        if(self.RootList.indexOf(opitem._OpId)==-1){
            logger.Info("RPCSetMaster:" + opitem._OpId);
            self.RootList.push(opitem._OpId);
            self.RootOpitems.push(opitem);
        }
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
                    return;
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
                    return;
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
                            return;
                        }
                    })
                }
            }
        })
    }
}

if (typeof exports === 'object') {
    module.exports = OpLogService;
}