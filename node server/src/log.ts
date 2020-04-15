// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.

"use strict";

import { Config } from "./config";

export enum LogLevel {
    DEBUG = 1,
    INFO = 2,
    WARNING = 3,
    ERROR = 4,
    NONE = 5
}

export class Log {

    private static logLevel : LogLevel;

    private static log(msg: string) {
        console.log(`[${Log.getDate()}] ${msg}`);
    }

    private static getDate():string {
        return new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    public static setLogLevel(level: string){
        switch (level) {
            case "NONE":
                Log.log(`[INFO] loglevel set to ${level}`);
                Log.logLevel = LogLevel.NONE;
                break;
            case "DEBUG":
                Log.log(`[INFO] loglevel set to ${level}`);
                Log.logLevel = LogLevel.DEBUG;
                break;
            case "INFO":
                Log.log(`[INFO] loglevel set to ${level}`);
                Log.logLevel = LogLevel.INFO;
                break;
            case "WARNING":
                Log.log(`[INFO] loglevel set to ${level}`);
                Log.logLevel = LogLevel.WARNING;
                break;
            case "ERROR":
                Log.log(`[INFO] loglevel set to ${level}`);
                Log.logLevel = LogLevel.ERROR;
                break;
            default:
                Log.logLevel = LogLevel.NONE;
                Log.log(`[ERROR] Given log level ${level} not found, using NONE instead`);
        }
    }

    public static debug(msg: string) {
        if(Log.logLevel <= LogLevel.DEBUG){
            Log.log(`[DEBUG] ${msg}`);
        }
    }

    public static info(msg: string) {
        if(Log.logLevel <= LogLevel.INFO){
            Log.log(`[INFO] ${msg}`);
        }
    }

    public static warning(msg: string) {
        if(Log.logLevel <= LogLevel.WARNING){
            Log.log(`[WARNING] ${msg}`);
        }
    }

    public static error(msg: string, e: Error) {
        if(Log.logLevel <= LogLevel.ERROR){
            if(e){
                Log.log(`[ERROR] ${msg}\nException ${e.name}: ${e.message} \n ${e.stack}`);
            }else{
                Log.log(`[ERROR] ${msg}`);
            }
        }
    }

    public static exception(err: Error) {
        if(Log.logLevel <= LogLevel.ERROR){
            Log.log(`[ERROR] ${err.message} \n ${err.stack}`);
        }
    }

}
