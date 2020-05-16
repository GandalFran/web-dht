// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cors_1 = __importDefault(require("cors"));
var Path = __importStar(require("path"));
var HTTP = __importStar(require("http"));
var express_1 = __importDefault(require("express"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var BodyParser = __importStar(require("body-parser"));
var log_1 = require("./log");
var config_1 = require("./config");
var http_1 = require("./util/http");
var downloadsController_1 = require("./controllers/downloadsController");
var uploadsController_1 = require("./controllers/uploadsController");
var DHTApplication = /** @class */ (function () {
    function DHTApplication() {
        this.application = express_1.default();
        this.application.use(cors_1.default());
        this.configureParsers();
        this.registerControllers();
        this.registerView();
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
            log_1.Log.info("[HTTP] application running http://" + config_1.Config.getInstance().http.addr + ":" + config_1.Config.getInstance().http.port);
        });
    };
    DHTApplication.prototype.configureParsers = function () {
        this.application.use(BodyParser.raw());
        this.application.use(BodyParser.text());
        this.application.use(cookie_parser_1.default(http_1.HTTP_COOKIE_SECRET));
        this.application.use(BodyParser.json({ limit: "300mb" }));
        this.application.use(BodyParser.urlencoded({ limit: "300mb", extended: true, parameterLimit: 1000000 }));
    };
    DHTApplication.prototype.registerControllers = function () {
        var uploadsController = new uploadsController_1.UploadsController();
        var downloadsController = new downloadsController_1.DownloadsController();
        uploadsController.registerController(this.application);
        downloadsController.registerController(this.application);
    };
    DHTApplication.prototype.registerView = function () {
        this.application.use(express_1.default.static(Path.join(__dirname, "..", "dist")));
    };
    DHTApplication.singletonInstance = null;
    return DHTApplication;
}());
exports.DHTApplication = DHTApplication;
