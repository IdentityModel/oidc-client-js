var log = {
    debug:logMessage, warn: logMessage, info: logMessage, error:logMessage
};

function logMessage(msg){
    document.getElementById('logMessages').innerHTML += "<li>" + msg + "</li>";  
    console.log(msg);
}

Oidc.Log.logger = console; // log;
Oidc.Log.level = Oidc.Log.DEBUG;

new Oidc.UserManager().signinPopupCallback().catch(function(err){
    Oidc.Log.logger.error("error: " + err && err.message);
});
