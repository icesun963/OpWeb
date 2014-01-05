var OpLogService = require("./../../Shared/OpLogRPC.js");

AddService(OpLogService);

AddService(function () {
    CometServer(__dirname  + "/../../Web", process.env.PORT  || 8000);
});