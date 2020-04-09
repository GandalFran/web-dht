// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.
"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var HTTP = __importStar(require("http"));
var express_1 = __importDefault(require("express"));
var log_1 = require("./log");
var config_1 = require("./config");
var dhtController_1 = require("./controllers/dhtController");
var statusController_1 = require("./controllers/statusController");
var DHTApplication = /** @class */ (function () {
    function DHTApplication() {
        this.application = express_1.default();
        this.registerControllers();
    }
    DHTApplication.getInstance = function () {
        if (!DHTApplication.singletonInstance) {
            DHTApplication.singletonInstance = new DHTApplication();
        }
        return DHTApplication.singletonInstance;
    };
    DHTApplication.prototype.start = function () {
        HTTP.createServer(this.application).on("error", function (e) {
            log_1.Log.error("[HTTP]", e);
        }).listen(config_1.Config.getInstance().http.port, config_1.Config.getInstance().http.addr, function () {
            log_1.Log.info("[HTTP] application running " + config_1.Config.getInstance().http.addr + ":" + config_1.Config.getInstance().http.port);
        });
    };
    DHTApplication.prototype.registerControllers = function () {
        var dhtController = new dhtController_1.DHTController();
        var statusController = new statusController_1.StatusController();
        dhtController.registerController(this.application);
        statusController.registerController(this.application);
    };
    DHTApplication.singletonInstance = null;
    return DHTApplication;
}());
exports.DHTApplication = DHTApplication;
