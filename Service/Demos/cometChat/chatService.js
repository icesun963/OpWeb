var myApp = function(){
    //对应的映射根对象
    var chatDb=function(){
        this.lists = [];
        JsOpItem.call(this);
    };
    //子消息对象
    var messageItem=function(message){
        this.message=message;
        JsOpItem.call(this);
    };

    //定义一个实体对象
    var chatroot= new chatDb();
    //同客户端绑定根节点
    chatroot.SetOpId("2000");
    //绑定到Master允许客户端同步
    OpLog.OpFunction.SetMaster(chatroot);

    //定义请求方法
    this.RPCAddChatMessage =function (message){
        //添加到列表
        chatroot.lists.push(new messageItem(message));
    };
};

//创建一个Comet Web服务
AddService(function () {
    CometServer(__dirname  + "/",8008);
});
//把服务加入启动
AddService(myApp);
