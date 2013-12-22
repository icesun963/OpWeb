/*Generated by SharpKit 5 v5.2.1*/
if (typeof($CreateException)=='undefined') 
{
    var $CreateException = function(ex, error) 
    {
        if(error==null)
            error = new Error();
        if(ex==null)
            ex = new System.Exception.ctor();       
        error.message = ex.message;
        for (var p in ex)
           error[p] = ex[p];
        return error;
    }
}
if (typeof ($CreateAnonymousDelegate) == 'undefined') {
    var $CreateAnonymousDelegate = function (target, func) {
        if (target == null || func == null)
            return func;
        var delegate = function () {
            return func.apply(target, arguments);
        };
        delegate.func = func;
        delegate.target = target;
        delegate.isDelegate = true;
        return delegate;
    }
}
var JsTypes = global.Clr["JsTypes"];

if (typeof(JsTypes) == "undefined")
    var JsTypes = [];
var OpLog$OpFunctionFix =
{
    fullname: "OpLog.OpFunctionFix",
    baseTypeName: "System.Object",
    staticDefinition:
    {
        GetTime: function ()
        {
            var st = new System.DateTime.ctor$$Int32$$Int32$$Int32(1970, 1, 1);
            var t = (System.DateTime.op_Subtraction$$DateTime$$DateTime(System.CurrentTimeGetter.get_Now().ToUniversalTime(), st));
            return (t.get_TotalMilliseconds() + 0.5);
        },
        GetBigTime: function ()
        {
            var retval = 0;
            var st = new System.DateTime.ctor$$Int32$$Int32$$Int32(1970, 1, 1);
            var t = (System.DateTime.op_Subtraction$$DateTime$$DateTime(System.CurrentTimeGetter.get_Now().AddDays(-1).get_Date(), st));
            return (t.get_TotalMilliseconds() + 0.5);
        },
        cctor: function ()
        {
             OpLog.OpFunction.GetTime = OpLog.OpFunctionFix.GetTime;
             OpLog.OpFunction.GetBigTime = OpLog.OpFunctionFix.GetBigTime;
             OpLog.OpFunction.BuildObject = OpLog.OpFunctionFix.BuildObject;
             OpLog.Exctions.GetPropertyValue = OpLog.OpFunctionFix.GetPropertyValue;
             OpLog.Exctions.SetPropertyValue = OpLog.OpFunctionFix.SetPropertyValue;
             OpLog.JavaScriptSerializer.SerializeToJson = OpLog.OpFunctionFix.SerializeToJson;
             System.GC = {};
             System.GC.SuppressFinalize = function(){};
             OpLog.Exctions.GetProperty = OpLog.OpFunctionFix.GetProperty;
        },
        GetProperty: function (obj, pname)
        {
            var jobj =  obj;
            if (jobj.hasOwnProperty(pname))
            {
                return (function ()
                {
                    var $v1 = new OpHost.JS.OpFunctionFix.MyPropertyInfo.ctor();
                    $v1.set_Name(pname);
                    return $v1;
                })();
            }
            return obj.GetType().GetProperty$$String(pname);
        },
        SerializeToJson: function (obj)
        {
            var item =  JSON.stringify(obj);
            return item;
        },
        BuildObject: function (obj)
        {
            if (Is(obj, System.Collections.Generic.Dictionary$2.ctor))
            {
                var opstr =  {};
                var $it1 = (As(obj, System.Collections.Generic.Dictionary$2.ctor)).GetEnumerator();
                while ($it1.MoveNext())
                {
                    var item = $it1.get_Current();
                    opstr [ item.get_Key()] =  item.get_Value();
                }
                return opstr;
            }
            return obj;
        },
        GetPropertyValue: function (o, bind)
        {
            if (bind instanceof Object)
            {
                if ((bind instanceof Object ? bind : null).hasOwnProperty(o.get_Name()))
                {
                    return (bind instanceof Object ? bind : null)[o.get_Name()];
                }
            }
            return o.GetValue$$Object$$Object$Array(bind, null);
        },
        SetPropertyValue: function (o, bind, value)
        {
            if (bind instanceof Object)
            {
                if ((bind instanceof Object ? bind : null).hasOwnProperty(o.get_Name()))
                {
                    (bind instanceof Object ? bind : null)[o.get_Name()] = value;
                }
            }
            o.SetValue$$Object$$Object$$Object$Array(bind, value, null);
        }
    },
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            System.Object.ctor.call(this);
        }
    }
};
JsTypes.push(OpLog$OpFunctionFix);
var OpHost$JS$OpFunctionFix$MyPropertyInfo =
{
    fullname: "OpHost.JS.OpFunctionFix.MyPropertyInfo",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            this._Name = null;
            System.Object.ctor.call(this);
        },
        Name$$: "System.String",
        get_Name: function ()
        {
            return this._Name;
        },
        set_Name: function (value)
        {
            this._Name = value;
        }
    }
};
JsTypes.push(OpHost$JS$OpFunctionFix$MyPropertyInfo);
var System$PropertyInfoFix =
{
    fullname: "System.PropertyInfoFix",
    baseTypeName: "System.Object",
    staticDefinition:
    {
        cctor: function ()
        {
             System.Reflection.PropertyInfo.ctor.prototype.get_CanRead = function(){  
    return System.PropertyInfoFix.GetCanRead(this);
    return true;  
};
             System.Reflection.PropertyInfo.ctor.prototype.get_CanWrite = function(){ 
    return System.PropertyInfoFix.GetCanWrite(this);
    return true; 
};
             OpLog.Exctions.IsDefined$1 = System.PropertyInfoFix.IsDefined;
             OpLog.Exctions.GetCustomAttribute$1 = System.PropertyInfoFix.GetCustomAttribute;
        },
        GetCustomAttribute: function (type, o, inner)
        {
            return null;
        },
        IsDefined: function (type, o, inner)
        {
            return false;
        },
        GetCanRead: function (item)
        {
            return true;
        },
        GetCanWrite: function (item)
        {
            return true;
        }
    },
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            System.Object.ctor.call(this);
        }
    }
};
JsTypes.push(System$PropertyInfoFix);
var Lib$Nini$Config$IniConfigSource =
{
    fullname: "Lib.Nini.Config.IniConfigSource",
    baseTypeName: "Lib.Nini.Config.ConfigSourceBase",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            Lib.Nini.Config.ConfigSourceBase.ctor.call(this);
        },
        ctor$$String: function (iniFile)
        {
            Lib.Nini.Config.ConfigSourceBase.ctor.call(this);
        }
    }
};
JsTypes.push(Lib$Nini$Config$IniConfigSource);
var System$Collections$DictionaryEntry =
{
    fullname: "System.Collections.DictionaryEntry",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            this._Key = null;
            this._Value = null;
            System.Object.ctor.call(this);
        },
        Key$$: "System.Object",
        get_Key: function ()
        {
            return this._Key;
        },
        set_Key: function (value)
        {
            this._Key = value;
        },
        Value$$: "System.Object",
        get_Value: function ()
        {
            return this._Value;
        },
        set_Value: function (value)
        {
            this._Value = value;
        },
        ctor$$Object$$Object: function (key, value)
        {
            this._Key = null;
            this._Value = null;
            System.Object.ctor.call(this);
            this.set_Key(key);
            this.set_Value(value);
        }
    }
};
JsTypes.push(System$Collections$DictionaryEntry);
var System$Threading$AutoResetEvent =
{
    fullname: "System.Threading.AutoResetEvent",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function (bool)
        {
            System.Object.ctor.call(this);
        }
    }
};
JsTypes.push(System$Threading$AutoResetEvent);
var System$Diagnostics$Stopwatch =
{
    fullname: "System.Diagnostics.Stopwatch",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            this._dateTime = System.DateTime.MinValue;
            this._ElapsedMilliseconds = 0;
            System.Object.ctor.call(this);
            this._dateTime = System.DateTime.get_Now();
        },
        ElapsedMilliseconds$$: "System.Int64",
        get_ElapsedMilliseconds: function ()
        {
            return this._ElapsedMilliseconds;
        },
        set_ElapsedMilliseconds: function (value)
        {
            this._ElapsedMilliseconds = value;
        },
        Stop: function ()
        {
            this.set_ElapsedMilliseconds(this.get_ElapsedMilliseconds() + (System.DateTime.get_Now().get_Ticks() - this._dateTime.get_Ticks()) / 1000);
        },
        Start: function ()
        {
            this._dateTime = System.DateTime.get_Now();
        },
        Reset: function ()
        {
            this.set_ElapsedMilliseconds(0);
        }
    }
};
JsTypes.push(System$Diagnostics$Stopwatch);
var OpHost$JS$Timer =
{
    fullname: "OpHost.JS.Timer",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function (delay)
        {
            this._delay = 0;
            this.intervalID = 0;
            this.timerTick = null;
            System.Object.ctor.call(this);
            this._delay = delay;
        },
        delay$$: "System.Int32",
        get_delay: function ()
        {
            return this._delay;
        },
        start: function ()
        {
            this.intervalID =  setInterval(this.timerTick, this._delay);
        },
        stop: function ()
        {
            this.intervalID =  clearInterval(this.intervalID, this._delay);
        }
    }
};
JsTypes.push(OpHost$JS$Timer);
var System$Diagnostics$StackTrace =
{
    fullname: "System.Diagnostics.StackTrace",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            this._Skipframes = 0;
            System.Object.ctor.call(this);
        },
        ctor$$Int32$$Boolean: function (skipframes, fileinfo)
        {
            this._Skipframes = 0;
            System.Object.ctor.call(this);
            this.set_Skipframes(skipframes);
        },
        Skipframes$$: "System.Int32",
        get_Skipframes: function ()
        {
            return this._Skipframes;
        },
        set_Skipframes: function (value)
        {
            this._Skipframes = value;
        },
        GetFrames: function ()
        {
            var result = new System.Collections.Generic.List$1.ctor(System.Diagnostics.StackFrame.ctor);
            try
            {
                var callee =  arguments.callee;
                var count = 1;
                while (callee != null)
                {
                    count++;
                    if (count > this.get_Skipframes())
                        result.Add(new System.Diagnostics.StackFrame.ctor$$Object(callee));
                    callee =  callee.caller;
                }
            }
            catch ($$e1)
            {
            }
            return result.ToArray();
        }
    }
};
JsTypes.push(System$Diagnostics$StackTrace);
var OpHost$JS$StackTrace$StackMethodInfo =
{
    fullname: "OpHost.JS.StackTrace.StackMethodInfo",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            this._Name = null;
            this._DeclaringType = null;
            System.Object.ctor.call(this);
        },
        Name$$: "System.String",
        get_Name: function ()
        {
            return this._Name;
        },
        set_Name: function (value)
        {
            this._Name = value;
        },
        DeclaringType$$: "OpHost.JS.StackTrace+StackType",
        get_DeclaringType: function ()
        {
            return this._DeclaringType;
        },
        set_DeclaringType: function (value)
        {
            this._DeclaringType = value;
        }
    }
};
JsTypes.push(OpHost$JS$StackTrace$StackMethodInfo);
var OpHost$JS$StackTrace$StackType =
{
    fullname: "OpHost.JS.StackTrace.StackType",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            this._Name = null;
            System.Object.ctor.call(this);
        },
        Name$$: "System.String",
        get_Name: function ()
        {
            return this._Name;
        },
        set_Name: function (value)
        {
            this._Name = value;
        }
    }
};
JsTypes.push(OpHost$JS$StackTrace$StackType);
var System$Diagnostics$StackFrame =
{
    fullname: "System.Diagnostics.StackFrame",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            this._Call = null;
            this._Name = null;
            System.Object.ctor.call(this);
        },
        ctor$$Int32$$Boolean: function (skipframes, fileinfo)
        {
            this._Call = null;
            this._Name = null;
            System.Object.ctor.call(this);
            this._Call = new System.Diagnostics.StackTrace.ctor$$Int32$$Boolean(skipframes, fileinfo).GetFrames()[0];
            this.BuildName();
        },
        ctor$$Object: function (callee)
        {
            this._Call = null;
            this._Name = null;
            System.Object.ctor.call(this);
            this._Call = callee;
            this.BuildName();
        },
        BuildName: function ()
        {
            var fun =  this._Call;
            var name =  fun.name;
            this.set_Name(name);
            if (this.get_Name() == null || this.get_Name() == "")
                this.set_Name("anonymous");
        },
        Name$$: "System.String",
        get_Name: function ()
        {
            return this._Name;
        },
        set_Name: function (value)
        {
            this._Name = value;
        },
        Call$$: "System.Object",
        get_Call: function ()
        {
            return this._Call;
        },
        set_Call: function (value)
        {
            this._Call = value;
        },
        GetMethod: function ()
        {
            return (function ()
            {
                var $v2 = new OpHost.JS.StackTrace.StackMethodInfo.ctor();
                $v2.set_Name(this.get_Name());
                $v2.set_DeclaringType((function ()
                {
                    var $v3 = new OpHost.JS.StackTrace.StackType.ctor();
                    $v3.set_Name(this.get_Name());
                    return $v3;
                }).call(this));
                return $v2;
            }).call(this);
        }
    }
};
JsTypes.push(System$Diagnostics$StackFrame);
var System$WeakReference =
{
    fullname: "System.WeakReference",
    baseTypeName: "System.Object",
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor$$Object: function (value)
        {
            this._Target = null;
            System.Object.ctor.call(this);
            this.set_Target(value);
        },
        ctor: function ()
        {
            this._Target = null;
            System.Object.ctor.call(this);
        },
        Target$$: "System.Object",
        get_Target: function ()
        {
            return this._Target;
        },
        set_Target: function (value)
        {
            this._Target = value;
        },
        IsAlive$$: "System.Boolean",
        get_IsAlive: function ()
        {
            return this.get_Target() != null;
        }
    }
};
JsTypes.push(System$WeakReference);
var System$Threading$Thread =
{
    fullname: "System.Threading.Thread",
    baseTypeName: "System.Object",
    staticDefinition:
    {
        Sleep$$Int32: function (ms)
        {
        },
        Sleep$$String: function (ms)
        {
            throw $CreateException(new System.NotImplementedException.ctor(), new Error());
        }
    },
    assemblyName: "OpHost.JS",
    Kind: "Class",
    definition:
    {
        ctor: function ()
        {
            this._timer = new OpHost.JS.Timer.ctor(5);
            this._Name = null;
            this._Priority = 0;
            this._ThreadState = 0;
            System.Object.ctor.call(this);
        },
        ctor$$ThreadStart: function (start)
        {
            this._timer = new OpHost.JS.Timer.ctor(5);
            this._Name = null;
            this._Priority = 0;
            this._ThreadState = 0;
            System.Object.ctor.call(this);
            this._timer.timerTick = $CreateAnonymousDelegate(this, function ()
            {
                start();
            });
            this.set_ThreadState(8);
        },
        Name$$: "System.String",
        get_Name: function ()
        {
            return this._Name;
        },
        set_Name: function (value)
        {
            this._Name = value;
        },
        Priority$$: "System.Int32",
        get_Priority: function ()
        {
            return this._Priority;
        },
        set_Priority: function (value)
        {
            this._Priority = value;
        },
        ThreadState$$: "System.Threading.ThreadState",
        get_ThreadState: function ()
        {
            return this._ThreadState;
        },
        set_ThreadState: function (value)
        {
            this._ThreadState = value;
        },
        Start: function ()
        {
            this._timer.start();
            this.set_ThreadState(0);
        },
        Abort: function ()
        {
            this.set_ThreadState(16);
            this._timer.stop();
        }
    }
};
JsTypes.push(System$Threading$Thread);