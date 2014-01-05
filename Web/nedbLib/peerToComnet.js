
var peerSocket = function(config,host,port){
    var logout = false;

    if(config==undefined){
        config = {
            key: "2zw1hfu50zm5nrk9",
            debug: 1,
            logFunction: function() {
                var copy = Array.prototype.slice.call(arguments).join(" ");
                console.log("peerLog:" + copy);
            },
             config: {"iceServers": [
                { url: "stun:stun.l.google.com:19302" }
            ]}
        };
    }
    if(host!=undefined){
        config.host = host;
    }
    if(port!=undefined){
        config.port = port;
    }
    this.PeerId = "";
    var self = this;
    var peer = new Peer(config);
    var events = {};
    var addevent = function(msg,callback){
        if(!events.hasOwnProperty(msg)){
            events[msg]=[];
        }
        events[msg].push(callback);
    }

    var emitevent = function(msg,arg1,arg2,arg3){
        if(events.hasOwnProperty(msg)){
            events[msg].forEach(function(callback){
                callback(arg1,arg2,arg3);
            });
        }
    }


    var connectedPeers = {};
    console.log("userAgent:" + navigator.userAgent);

    peer.on("open", function(id){
        self.PeerId = id;
        console.log("MyPeerId:" + id);
        emitevent("connect",id);
    });

    peer.on("connection", function(c){
        connect(c);
    });


    // Handle a connection object.
    function connect(c) {

        // Handle a  connection.
        c.on("data", function(jsondata) {

            data = JSON.parse(jsondata);
            var ts = new Date().getTime();
            var lag = ts - data.args;
            //ping back
            if(data.cmd == "ping"){
               sendCmd(c,"pong",data.args);
               connectedPeers[c.peer] = lag;
               //console.log(c.peer + " ms:" + lag);
            }
            //pong test
            else if(data.cmd == "pong"){
                connectedPeers[c.peer] = lag;
                //console.log(c.peer + " ms:" + lag);
                if(c.ready == undefined){
                    c.ready = true;
                    emitevent("connection",c);
                }

            }
            else{
                if(logout)
                    console.log("<<data:" + jsondata);

            }

            emitevent("data",data,c);
            emitevent(data.cmd,data.args,c);

            eachActiveConnection(function(conn){
                //console.log(conn);
                if(conn.ready==true && conn.sendList!=undefined){
                    conn.sendList.forEach(function(subdata){
                        conn.send(subdata);
                    })
                    conn.sendList = [];
                }
            });

        });
        c.on("close", function() {
            console.log(c.peer + " has left ...");
            delete connectedPeers[c.peer];
            emitevent("close", c.peer);
        });
        connectedPeers[c.peer] = 1;
        console.log("connect:" + c.peer);

    }


    var sendCmd = function(c,cmd,args){
        var conn = c;
        if(c!=undefined && cmd!=undefined && args==undefined)
        {
            args = cmd;
            cmd = c ;
            eachActiveConnection(function(subc){
                conn = subc;
            })
        }
        if(conn.ready || cmd =="ping" || cmd =="pong"){
            conn.send(JSON.stringify({ cmd : cmd ,args : args }));
        }
        else{
            if( conn.sendList == undefined){
                conn.sendList=[];
            }
            conn.sendList.push(JSON.stringify({ cmd : cmd ,args : args }));
        }
        if(cmd !="ping" && cmd !="pong")
            if(logout)
                console.log(">>send:" + JSON.stringify({ cmd : cmd ,args : args }));
    }


    //ping test
    setInterval(function(){
        var ts = new Date().getTime();
        eachActiveConnection(function(c) {
            sendCmd(c, "ping", ts );
            //c.send(JSON.stringify({ cmd : "ping" , args: ts }));
        });
    },1000);


    var connectToPeer = function(requestedPeer) {
        if (!connectedPeers[requestedPeer]) {
            var c = peer.connect(requestedPeer, {
                serialization: "none",
                reliable: true,
                metadata: { message: "hello"}
            });
            c.on("open", function() {
                connect(c);
            });
            //c.on("error", function(err) { console.warn(err); });
        }
        connectedPeers[requestedPeer] = 1;
    };

    var close = function() {
        eachActiveConnection(function(c) {
            c.close();
        });
    };



    function eachActiveConnection(fn) {
        var checkedIds = {};
        for(var peerId in connectedPeers){
            if (!checkedIds[peerId]) {
                var conns = peer.connections[peerId];
                if(conns!=undefined){

                    for (var i = 0, ii = conns.length; i < ii; i += 1) {
                        var conn = conns[i];
                        fn(conn);
                    }
                }
            }

            checkedIds[peerId] = 1;
        }
    }



    window.onunload = window.onbeforeunload = function(e) {
        if (!!peer && !peer.destroyed) {
            peer.destroy();
        }
    };

    this.connectToPeer = connectToPeer;
    this.on = addevent;
    this.emit =  sendCmd;
    this.connectedPeers = connectedPeers;
    this.logout = logout;
}

var peerServerPeer = function(config){
    peerSocket.call(this,config);
    var logout = this.logout;
    var opLogService = new OpLogService();
    var self = this;

    this.on("rpc.response",function(data,c){
        if(logout)
            console.log("get rpc response:" + JSON.stringify(data));
        var str = data.fun + "(" + data.args.substr(1,data.args.length-2) +")";
        if(logout)
            console.log("call:" + str);

        for(var funprop in opLogService){
            if(funprop==data.fun){
                opLogService[funprop].apply(opLogService , JSON.parse(data.args));
            }
        }

        if(data.cid != undefined){
            var result = {};
            result.rid = data.cid;
            self.emit(c,"rpc.result", result);
        }
    });

    this.on("sync.response",function(data,c){
        var opid = data.Opid;
        var ts = data.Ts;
        var peer = c.peer;

        if(opLogService.RootList.indexOf(opid)>=0){
            if(opid)
            {
                var retry = function(){
                    //console.log("retry...:" + ts + " " + opid);
                    OpLog.OpFunction.GetChangeData(ts,opid, function(data){
                        var logdata = OpLogItems(data);
                        if(logdata.length>0){
                            self.emit(c, "sync.message", logdata);
                            if(logout)
                                console.log("syncdata:" + JSON.stringify(logdata));
                        }
                        else{
                            if(self.connectedPeers.hasOwnProperty(peer)){
                                setTimeout(function(){
                                    retry();
                                },30);
                            }
                        }
                    });


                };

                retry();
            }
        }
        else{
            self.emit(c,"sync.error",{ });
        }
    });

    this.on("connection",function(c){
        self.emit(c,"sync.message",{});
    });
}

