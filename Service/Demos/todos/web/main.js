//********客户端代码***********
$(document).ready(function() {

//对象基类
var uiItemList =   function(rootdiv,template){
    var self = this;
    this.lists= [];
    //绑定模板数据
    watch(this,"lists", function(prop, action, newval, oldval){
        if(action=="push" )
        {
            var item = this.cloneSubItem();
            newval[0].setBind(item);
            item.binditem=newval[0];
        }
        else if(action=="pop" )
        {
            self.lists.__ondelItem__.bind.remove();
        }
    });

    this.setBind = function(rootdiv,template){
        this.bind=rootdiv;
        this.template=template;
        template.remove();
    };

    this.cloneSubItem= function(){
        var result= self.template.clone();
        self.bind.append(result);
        return result;
    };

    this.setBind(rootdiv,template);
};

//右边TodoItem
var todoItem = function(value,div) {
    var self = this;
    this.value=value;

    watch(this, function(prop, action, newval, oldval){
        if(self.input && self.txt)
        {
            self.input.val(newval);
            self.txt.text(newval);
        }
    });

    this.setBind = function (div) {
        if(!div)
            return;
        this.bind = div ;
        this.input=$(this.bind).contents().find("input");
        this.txt= $(this.bind).contents().find(".todo-text");
        this.deltxt= $(this.bind).contents().find(".item-del");
        this.input.val(this.value);
        this.txt.text(this.value);
        this.input.hide();
        this.txt.dblclick(function(){
            self.txt.hide();
            self.input.show();
        });
        this.deltxt.click(function(){
            RPCDelItem(true,div.binditem);
        });
        this.input.bind('keydown', function (e) {
            var key = e.which;
            if (key == 13) {
                RPCSetItemValue(self , self.input.val());
                self.txt.show();
                self.input.hide();
            }
        });
    } ;

    this.setBind(div);
}

 //绑定侧边栏对象显示
var sideItem = function(value,div) {
     var self = this;
     this.value=value;

     watch(this, function(prop, action, newval, oldval){
         if(self.input && self.txt)
         {
            self.input.val(newval);
            self.txt.text(newval);
         }
     });

     this.setBind = function (div) {
         if(!div)
            return;
         this.bind = div ;
         this.input=$(this.bind).contents().find("input");
         this.txt= $(this.bind).contents().find(".list-name");
         this.deltxt= $(this.bind).contents().find(".item-del");
         this.input.val(this.value);
         this.txt.text(this.value);
         this.input.hide();
         this.txt.dblclick(function(){
            self.txt.hide();
            self.input.show();
         });
         this.txt.removeAttr('href');
         this.deltxt.click(function(){
             RPCDelItem(false,div.binditem);
         });
         this.input.bind('keydown', function (e) {
             var key = e.which;
             if (key == 13) {
                 RPCSetItemValue(self , self.input.val());
                 self.txt.show();
                 self.input.hide();
             }
         });
     } ;

     this.setBind(div);
 };

 //初始化侧边栏
 var sideList = new uiItemList($("#side-lists"),$("#side-item-template"));

 //设置列表子对象
 sideList.lists.__type = sideItem;
 //绑定session
 var session1=new opSession(sideList,"1000");
 //右边列表
 var todoList = new uiItemList($("#item-list"),$("#todo-item-template"));
 todoList.lists.__type =todoItem;
 //绑定session
 var session2=new opSession(todoList,"1001");


 RPCSetItemValue =function (item , value){
     //我们需要子对象类型
     session1.doRpcCall("RPCSetItemValue",[ item._OpId  ,value ]);
     return;
     item.value = value;
 };

RPCAddItem = function (userto, value){
     session1.doRpcCall("RPCAddItem",[ userto ,value ]);
     return;
     if(userto)
     {
         todoList.lists.push(new  todoItem(value));
     }
    else
     {
         sideList.lists.push(new sideItem(value));
     }
};

RPCDelItem = function (userto , value){
    session1.doRpcCall("RPCDelItem",[ userto ,value._OpId ]);
    return;
    if(userto)
    {
        todoList.lists.remove(value);
    }
    else
    {
        sideList.lists.remove(value);
    }
};

$("#new-list").bind('keydown', function (e) {
    var key = e.which;
    if (key == 13) {
        RPCAddItem(false,$("#new-list").val());
    }
});

$("#new-todo").bind('keydown', function (e) {
    var key = e.which;
    if (key == 13) {
        RPCAddItem(true,$("#new-todo").val());
    }
});

});
//客户端UI结束
//************************

