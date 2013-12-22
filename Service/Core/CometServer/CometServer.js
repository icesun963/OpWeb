var logger = new Logger(__filename);
global.CometServer = function(path,port,cache,delay){
    if(delay==undefined)
        delay = 50;
    var static = require("node-static");
    if(cache == undefined){
        cache = 0;
    }
    var file = new static.Server( path ,{ cache: cache });

    var sharedfile = new static.Server( "./Shared/" ,{ cache: cache });

    var comet = require("./Lib/comet.io.js").createServer();

    require("http").createServer(function (request, response) {
        response.setHeader("Access-Control-Allow-Origin", "*");
        request.on("end", function () {
         if (!comet.serve(request, response)) {
                file.serve(request, response ,function(err, result) {
                    if (err) {

                        //console.error('Error serving %s - %s', request.url, err.message);
                        if (err.status === 404 || err.status === 500) {
                            sharedfile.serve(request, response);

                        } else {
                            request.writeHead(err.status, err.headers);
                            request.end();
                        }
                    } else {
                        //console.log('%s - %s', request.url, request.message);
                    }
                });
         }
        }).resume();
    }).listen(port);


    comet.on("connection", function (socket) {
        console.log("connected...patient");

        socket.emit("sync.message" , {} );
        socket.on("sync.response", function(data) {
          try
          {
              console.log("get sync message:" + JSON.stringify(data));

              var opid = data.Opid;
              var ts = data.Ts;
              if(opid)
              {
                  var retry = function(){

                       var syncdata = OpLog.OpFunction.GetChangeData(ts,opid, function(data){
                           readData(data);
                       });

                       if(typeof syncdata!= typeof undefined )
                           readData(syncdata);
                  };

                  var filterData = function(data){
                      passProperty.forEach(function(key){
                          if(data.hasOwnProperty(key)){
                              delete  data[key];
                          }
                      });
                      for(var prop in data){
                          if(data[prop]!=null && data[prop].hasOwnProperty("_OpId")){
                              filterData(data[prop]);
                          }
                          if(isArray(data[prop])){
                              data[prop].forEach(function(subitem){
                                  filterData(subitem);
                              });
                          }
                      }
                  }

                  var readData = function(syncdata){

                      var logdata =  [];

                      if(syncdata!=null)
                          logdata = OpLogItems(syncdata);

                      if(logdata.length>0){

                          logdata.forEach(function(subitem){
                              filterData(subitem);
                          });

                          socket.emit("sync.message", logdata);
                          console.log("syncdata:" + JSON.stringify(logdata));
                      }
                      else{
                          if(!socket._zombi) {
                              setTimeout(retry,delay);
                          }

                      }
                  };
                  retry();
              }


          }
          catch (e)
          {
              console.warn("err:" + e);
              throw e;
          }
        });
        socket.on("rpc.response" ,function(data){
            console.log("get rpc response:" + JSON.stringify(data));
            // { fun : funName,args :{} }
            var str = data.fun + "(" + data.args.substr(1,data.args.length-2) +")";
            console.log("call:" + str);
            //eval(str);
            //return;

            global.RpcList.forEach(function(funItem){
                if(funItem.FunName==data.fun){
                    //var args = [funItem.App].concat(JSON.parse(data.args));
                    //console.log("args:" + args);
                    funItem.Call.apply(funItem.App , JSON.parse(data.args));
                }
            });
        });
        socket.on("disconnect" ,function(){
            console.log('disconnect...');
        });

    });

    logger.Info("server on:" + port);

};


global.RpcList = [];
var rpcItem = function(funName,app,call){
    this.Call=call;
    this.FunName = funName;
    this.App=app;
    this.AppName =arguments.callee.toString();
};


global.AddRPC = function(app){
    logger.Info("Add RPC App:" + typeof app);
    for(var prop in app){
        if(prop.startsWith("RPC"))
        {
            logger.Info("Add Rpc Fun:" + prop);
            if(prop.startsWith("RPC")){
                global.RpcList.push(new rpcItem(prop,app,app[prop]));
            }
        }
    }
}

