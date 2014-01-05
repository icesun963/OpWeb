//********客户端代码***********
$(document).ready(function() {

//对象基类
var uiItemList =  function(rootdiv,template){
    var self = this;
    this.lists= [];

    //绑定模板数据
    doUIWatch(this,function(prop, action, newval, oldval){
        if(action=="push" )
        {
            var item = self.cloneSubItem();
            newval[0].setBind(item);
            item.binditem=newval[0];
        }
        else if(action=="pop" )
        {
            self.lists.$del().bind.remove();
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
    this._OpId = new Date().getTime();
    doUIWatch(this, function(prop, action, newval, oldval){
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
            todoList.lists.remove(div.binditem);
        });
        this.input.bind('keydown', function (e) {
            var key = e.which;
            if (key == 13) {
                self.value=self.input.val();
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
     this.value = value;
     this._OpId = new Date().getTime();

    doUIWatch(this, function(prop, action, newval, oldval){
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
             sideList.lists.remove(div.binditem);
         });
         this.input.bind('keydown', function (e) {
             var key = e.which;
             if (key == 13) {
                 self.value=self.input.val();
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
 var session1=new opSession(sideList,"1100","/",true);
 //右边列表
 var todoList = new uiItemList($("#item-list"),$("#todo-item-template"));
 todoList.lists.__type =todoItem;
 //绑定session
 var session2=new opSession(todoList,"1101","/",true);


$("#new-list").bind('keydown', function (e) {
    var key = e.which;
    if (key == 13) {
        var newitem = new sideItem();
        newitem.value= $("#new-list").val();
        sideList.lists.push(newitem);
    }
});

$("#new-todo").bind('keydown', function (e) {
    var key = e.which;
    if (key == 13) {
        var newitem = new todoItem();
        newitem.value= $("#new-todo").val();
        todoList.lists.push(newitem);
    }
});

});
//客户端UI结束
//************************

