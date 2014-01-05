console.log("RunTest:" + __filename);
var testfun = function(){
    console.log("fun...");
};

testfun = addEvent(testfun,function(arg1,arg2){
    console.log("add fun:" + arg1 + " " + arg2);
});

testfun = addEvent(testfun,function(arg1,arg2,arg3){
    console.log("add fun2:" + arg1 + " " + arg3);
});

testfun("args1","args2","arg3");


