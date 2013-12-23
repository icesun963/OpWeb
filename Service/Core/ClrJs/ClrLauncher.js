
if(!Config.ClrOn)
    return;

global.Clr = {};
global.Node = function () { };
global.navigator = function () { };
global.navigator.userAgent = "";
global.document = function () { };
global.document.implementation = function () { };
global.document.implementation.createDocument = true;
global.HTMLImageElement = function () { };
global.HTMLInputElement = function () { };


require('./Lib/jsclr.js');
require('./Lib/GameApp.js');
require('./Lib/OpLog.js');
require('./Lib/system.js');



var JsTypes = global.Clr["JsTypes"];

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
var compilerApp = function(){
    log("[Start Compile..]");
    var compiler = global.Clr["Compile"];

    compiler();


    log("[End Compile..]");
}
var initApp = function(){
    GameApp.Console.WriteLine$$String = function(msg) {
        if (msg.indexOf("[1]") >= 0) {
            var index = msg.indexOf("[1]");
            console.log(msg.substr(index + 3));
        } else if (msg.indexOf("[2]") >= 0) {
            var index = msg.indexOf("[2]");
            log("{" + msg.substr(index + 3) + "}");
        } else if (msg.indexOf("[3]") >= 0) {
            var index = msg.indexOf("[3]");
            log("[" + msg.substr(index + 3) + "]");
        } else if (msg.indexOf("[4]") >= 0) {
            var index = msg.indexOf("[4]");
            log("(" + msg.substr(index + 3) + ")");
        } else if (msg.indexOf("[5]") >= 0) {
            var index = msg.indexOf("[5]");
            log("*" + msg.substr(index + 3) + "*");
        } else if (msg.indexOf("[6]") >= 0) {
            var index = msg.indexOf("[6]");
            log("*" + msg.substr(index + 3) + "*");
        } else {
            log(msg);
        }
    };
    GameApp.Trace.WriteLine$$String = function(msg) {

    };

    if (global.LogManager == undefined)
        global.LogManager = {};
    LogManager.CreateLogger = function (name) {
        var log = name ? GameApp.Common.Logging.LogManager.CreateLogger$$String(name) : GameApp.Common.Logging.LogManager.CreateLogger(__filename);
        log.Trace = function (msg) {
            log.Trace$$String(msg);
        }
        log.Debug = function (msg) {
            log.Debug$$String(msg);
        }
        log.Info = function (msg) {
            log.Info$$String(msg);
        }
        log.Warn = function (msg) {
            log.Warn$$String(msg);
        }
        log.Error = function (msg) {
            log.Error$$String(msg);
        }
        log.Fatal = function (msg) {
            log.Fatal$$String(msg);
        }

        return log;
    };

    global.Log = LogManager.CreateLogger;



    global.JsOpItem = function () {
        this.disposed = false;
        this.PropertyChanged = null;
        this.OnDispose = null;
        this._OpId = null;

        this._OpId = OpLog.OpFunction.GetNewId();

        this.SetOpId = function(opid){
            this._OpId = opid;
        }

        System.Object.ctor.call(this);



        watch(this, function (prop, action, newval, oldval) {
            if (!this.OnPropertyChanged || prop == "PropertyChanged" || prop == "OnDispose")
                return;
            if (action == "set" )
                this.OnPropertyChanged(prop);
            if (action == "push") {
                this["__list__" + prop].Add(newval[0]);
            }
            else if (action == "pop") {
                this["__list__" + prop].Remove(this[prop].__ondelItem__);
            }

        });

        var baseItem = new OpHost.JS.BaseItem.ctor();

        this.constructor = baseItem.constructor;

        function cloneObject(obj) {
            var clone = {};
            for (var i in obj) {
                if (typeof (obj[i]) == "object" && obj[i] != null)
                    clone[i] = cloneObject(obj[i]);
                else
                    clone[i] = obj[i];
            }
            return clone;
        }

        this.GetType = function () {
            var basetype = baseItem.GetType();
            /*
             var mypropers = basetype.GetProperties().slice();
             if(!basetype.BaseGetProperties)
             basetype.BaseGetProperties=basetype.GetProperties;
             else
             mypropers = basetype.BaseGetProperties().slice();
             */
            var mypropers = [];
            for (var prop in this) {
                if (prop != "disposed" && prop != "OnDispose")
                    if (typeof (this[prop]) != "function") {
                        if (prop.startsWith("__list__"))
                            continue;

                        if (Object.prototype.toString.call(this[prop]) === '[object Array]') {
                            //BuildAListBind
                            if (!this.hasOwnProperty("__list__" + prop))
                                this["__list__" + prop] = new OpLog.OpList$1.ctor(OpHost.JS.BaseItem.ctor);

                            var lpinfo = new OpHost.JS.OpFunctionFix.MyPropertyInfo.ctor();
                            lpinfo.set_Name("__list__" + prop);
                            mypropers.push(lpinfo);
                        }
                        else {
                            var pinfo = new OpHost.JS.OpFunctionFix.MyPropertyInfo.ctor();
                            pinfo.set_Name(prop);
                            mypropers.push(pinfo);
                        }
                    }
            }
            basetype.GetProperties = function () {
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
}

AddService(compilerApp,9);
AddService(initApp,9);