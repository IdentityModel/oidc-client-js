// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

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
        else {
            throw new Error("Invalid log level");
        }
    }
    
    static get logger(){
        return logger;
    }
    static set logger(value){
        if (value.info && value.warn && value.error){
            logger = value;
        }
        else {
            throw new Error("Invalid logger");
        }
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