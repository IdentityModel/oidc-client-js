let nopLogger = {
    info(){},
    warn(){},
    error(){}
};

const NONE = 0;
const ERROR = 1;
const WARN = 2;
const INFO = 3;

let logger;
let level;

export default class Log {
    static get NONE() {return NONE};
    static get ERROR() {return ERROR};
    static get WARN() {return WARN};
    static get INFO() {return INFO};
    
    static reset(){
        level = INFO;
        logger = nopLogger;
    }
    
    static get level(){
        return level;
    }
    static set level(value){
        if (NONE <= value && value <= INFO){
            level = value;
        }
    }
    
    static setLogger(value){
        logger = value;
    }
    
    static info(...args){
        if (level >= INFO){
            logger.info.apply(logger, Array.from(args));
        }
    }
    static warn(...args){
        if (level >= WARN){
            logger.warn.apply(logger, Array.from(args));
        }
    }
    static error(...args){
        if (level >= ERROR){
            logger.error.apply(logger, Array.from(args));
        }
    }
}

Log.reset();