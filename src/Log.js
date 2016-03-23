let nopLogger = {
    info(){},
    warn(){},
    error(){}
};

let logger;
let enabled;

export default class Log {
    static reset(){
        enabled = false;
        logger = nopLogger;
    }
    
    static get enabled(){
        return enabled;
    }
    static set enabled(value){
        enabled = !!value;
    }
    
    static setLogger(value){
        logger = value;
    }
    
    static info(...args){
        if (enabled){
            logger.info.apply(logger, Array.from(args));
        }
    }
    static warn(...args){
        if (enabled){
            logger.warn.apply(logger, Array.from(args));
        }
    }
    static error(...args){
        if (enabled){
            logger.error.apply(logger, Array.from(args));
        }
    }
}

Log.reset();