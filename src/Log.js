// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

let nopLogger = {
    debug(){},
    info(){},
    warn(){},
    error(){}
};

const NONE = 0;
const ERROR = 1;
const WARN = 2;
const INFO = 3;
const DEBUG = 4;

let logger;
let level;

export class Log {
    static get NONE() {return NONE};
    static get ERROR() {return ERROR};
    static get WARN() {return WARN};
    static get INFO() {return INFO};
    static get DEBUG() {return DEBUG};
    
    static reset(){
        level = INFO;
        logger = nopLogger;
    }
    
    static get level(){
        return level;
    }
    static set level(value){
        if (NONE <= value && value <= DEBUG){
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
        if (!value.debug && value.info) {
            // just to stay backwards compat. can remove in 2.0
            value.debug = value.info;
        }

        if (value.debug && value.info && value.warn && value.error){
            logger = value;
        }
        else {
            throw new Error("Invalid logger");
        }
    }
    
    static debug(...args){
        if (level >= DEBUG){
            logger.debug.apply(logger, Array.from(args));
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
