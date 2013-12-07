global.Clr = {};
global.Node = function(){};
global.navigator = function(){};
global.navigator.userAgent = "";
global.document = function(){};
global.document.implementation= function(){};
global.document.implementation.createDocument = true;
global.HTMLImageElement = function(){};
global.HTMLInputElement = function(){};
global.window = global;
global.Services = [];

global.AddService = function(app){
    global.Services.push(app);
};

global.StartApps =function(){
    global.Services.forEach(function(app){
        app();
    });
}




require('./res/jsclr.js');

console.log("app start..");


 var JsTypes = global.Clr["JsTypes"];
 require('./system.js');
 require('./GameApp.js');
 require('./OpLog.js');

if (typeof(JsTypes) == "undefined")
    var JsTypes = [];
var OpHost$JS$BaseItem =
{
    fullname: "OpHost.JS.BaseItem",
    baseTypeName: "OpLog.OpObject",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            OpLog.OpObject.ctor.call(this);
        }
    }
};
JsTypes.push(OpHost$JS$BaseItem);

console.log("start Compile..");
var compiler = global.Clr["Compile"];
compiler();


console.log("End Compile..");

var WatchJS = require("./web/watch.js");
var watch = WatchJS.watch;


global.JsOpItem = function () {
    this.disposed = false;
    this.PropertyChanged = null;
    this.OnDispose = null;
    this._OpId = null;

    this._OpId = OpLog.OpFunction.GetNewId();


    System.Object.ctor.call(this);



    watch(this, function (prop, action, newval, oldval) {
        if(!this.OnPropertyChanged)
            return;
        if(action=="set" && prop!="PropertyChanged" && prop!="OnDispose")
            this.OnPropertyChanged(prop);
        if(action=="push")
        {
            this["__list__" + prop].Add(newval[0]);
        }
        else if(action=="pop")
        {
            this["__list__" + prop].Remove(this[prop].__ondelItem__);
        }
    });

    var baseItem = new OpHost.JS.BaseItem.ctor();

    this.constructor = baseItem.constructor;

    function cloneObject(obj) {
        var clone = {};
        for(var i in obj) {
            if(typeof(obj[i])=="object" && obj[i] != null)
                clone[i] = cloneObject(obj[i]);
            else
                clone[i] = obj[i];
        }
        return clone;
    }

    this.GetType = function()
    {
        var basetype = baseItem.GetType();
        /*
        var mypropers = basetype.GetProperties().slice();
        if(!basetype.BaseGetProperties)
            basetype.BaseGetProperties=basetype.GetProperties;
        else
            mypropers = basetype.BaseGetProperties().slice();
        */
        var mypropers =[];
        for(var prop in this) {
            if(prop!="disposed" && prop!="OnDispose")
                if (typeof(this[prop]) != "function"){
                    if(prop.startsWith("__list__"))
                        continue;

                    if(Object.prototype.toString.call(this[prop]) === '[object Array]'){
                        //BuildAListBind
                        if(!this.hasOwnProperty("__list__" + prop))
                           this["__list__" + prop] = new OpLog.OpList$1.ctor(OpHost.JS.BaseItem.ctor);

                        var lpinfo = new OpHost.JS.OpFunctionFix.MyPropertyInfo.ctor();
                        lpinfo.set_Name("__list__" + prop);
                        mypropers.push(lpinfo);
                    }
                    else
                    {
                        var pinfo = new OpHost.JS.OpFunctionFix.MyPropertyInfo.ctor();
                        pinfo.set_Name(prop);
                        mypropers.push(pinfo);
                    }
                }
        }
        basetype.GetProperties = function(){
            return mypropers;
        };
        return basetype;
    };

    this.GetType();

    this.OnSetMaster = function () {
    };
    this.add_PropertyChanged = function (value) {
        this.PropertyChanged = $CombineDelegates(this.PropertyChanged, value);
    };
    this.remove_PropertyChanged = function (value) {
        this.PropertyChanged = $RemoveDelegate(this.PropertyChanged, value);
    };
    this.get_OpId = function () {
        return this._OpId;
    };
    this.set_OpId = function (value) {
        this._OpId = value;
    };
    this.OnPropertyChanged = function (propertyName) {
        if (this.PropertyChanged != null) {
            this.PropertyChanged(this, new System.ComponentModel.PropertyChangedEventArgs.ctor(propertyName));
        }
    };
    this.add_OnDispose = function (value) {
        this.OnDispose = $CombineDelegates(this.OnDispose, value);
    };
    this.remove_OnDispose = function (value) {
        this.OnDispose = $RemoveDelegate(this.OnDispose, value);
    };
    this.Dispose = function () {
        this.Dispose$$Boolean(true);
        System.GC.SuppressFinalize(this);
    };
    this.ReleaseManagedResources = function () {
        this.PropertyChanged = null;
    },
    this.ReleaseUnmanagedResources = function () {
    };
    this.Dispose$$Boolean = function (disposing) {
        if (!this.disposed) {
            if (disposing) {
                this.ReleaseManagedResources();
            }
            this.ReleaseUnmanagedResources();
        }
        if (this.OnDispose != null)
            this.OnDispose();
        this.disposed = true;
    };
};


console.log("Load Services..");

//扫描 Service 下的服务并载入
var fs = require('fs');
var root_path = __dirname + "";

function getAllFiles(root){
    var res = [] , files = fs.readdirSync(root);
    files.forEach(function(file){
        var pathname = root+'/'+file
            , stat = fs.lstatSync(pathname);

        if (!stat.isDirectory()){
            res.push(pathname.replace(root_path,'.'));
        } else {
            res = res.concat(getAllFiles(pathname));
        }
    });

    return res
}

var files=getAllFiles(root_path);
files.forEach(function(file){

    if(file.startsWith("./Service")){
        console.log("Load:" + file);
        require(file);
    }
});

console.log("Start Apps...");


StartApps();





