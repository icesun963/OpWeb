$(document).ready(function() {
   /*
    var socket;
  if (typeof io == 'undefined') {
    socket = comet.connect();
  } else {
    socket = io.connect();
  }
  socket.on('connect', function() {
    console.log('connected');
  }).on('test.message', function (data) {
    socket.emit('test.response', data);
  });
  */

//删除数组后找不到对象的问题
Array.prototype.__ondelItem__={};
//增加remove方法(可用自定义列表处理)
Array.prototype.remove = function(item) {
    item.__ondel__ = true;
   this.sort(function(a,b){
      if(a.__ondel__)
        return 1;
       return 0;
   });
   this.__ondelItem__=item;
   this.pop();
};

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
        self.input.val(newval);
        self.txt.text(newval);
    });

    this.setBind = function (div) {
        if(!div)
            return;
        this.bind = div ;
        this.input=$(this.bind).contents().find("input");
        this.txt= $(this.bind).contents().find(".todo-text");
        this.deltxt= $(this.bind).contents().find(".item-del");
        this.input.val(value);
        this.txt.text(value);
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
         self.input.val(newval);
         self.txt.text(newval);
     });

     this.setBind = function (div) {
         if(!div)
            return;
         this.bind = div ;
         this.input=$(this.bind).contents().find("input");
         this.txt= $(this.bind).contents().find(".list-name");
         this.deltxt= $(this.bind).contents().find(".item-del");
         this.input.val(value);
         this.txt.text(value);
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
 //右边列表
 var todoList = new uiItemList($("#item-list"),$("#todo-item-template"));

 RPCSetItemValue =function (item , value){
     item.value = value;
 };

RPCAddItem = function (userto, value){
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