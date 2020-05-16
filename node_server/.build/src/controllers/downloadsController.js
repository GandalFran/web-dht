// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystem = __importStar(require("fs"));
var formidable_1 = require("formidable");
var log_1 = require("../log");
var config_1 = require("../config");
var downloads_1 = require("../models/downloads");
var file_1 = require("../models/file");
var http_1 = require("../util/http");
/**
 * Service to manage the DHT downloads
 */
var DownloadsController = /** @class */ (function () {
    function DownloadsController() {
        this.model = new downloads_1.Downloads();
    }
    /**
     * Registers the downloads related endpoints.
     * @param application The system's main express application
     */
    DownloadsController.prototype.registerController = function (application) {
        application.get("/download/status", this.downloadstatus.bind(this));
        application.post("/download/create", this.createdownload.bind(this));
        application.post("/download/delete", this.deletedownload.bind(this));
        application.post("/download/file", this.getfile.bind(this));
    };
    /**
     * Get all the registered downloads.
     * @param application The system's main express application
     */
    DownloadsController.prototype.downloadstatus = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var downloads;
            return __generator(this, function (_a) {
                downloads = [];
                this.model.all().forEach(function (download) {
                    downloads.push({
                        id: download.id,
                        name: download.torrent.file.name,
                        percentage: download.status()
                    });
                });
                response.send(downloads);
                return [2 /*return*/];
            });
        });
    };
    /**
     * Starts a download from the DHT with the given torrent file in the request.
     * @param request express' request object
     * @param response express' response object
     */
    DownloadsController.prototype.createdownload = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var form;
            var _this = this;
            return __generator(this, function (_a) {
                form = new formidable_1.IncomingForm();
                log_1.Log.info('recived download request');
                form.on('file', function (field, uploadedFile) { return __awaiter(_this, void 0, void 0, function () {
                    var id, path, fileNamePrefix, filePath, torrent;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                id = this.model.id();
                                path = config_1.Config.getInstance().dht.temporalFiles + '/' + id + '_' + uploadedFile.name;
                                FileSystem.renameSync(uploadedFile.path, path);
                                fileNamePrefix = id + '_';
                                filePath = config_1.Config.getInstance().dht.temporalFiles;
                                torrent = file_1.Torrent.buildTorrentFromTorrentFile(path, filePath, fileNamePrefix);
                                this.model.create(id, torrent);
                                response.status(http_1.STATUS_OK);
                                response.contentType(http_1.CONTENT_APPLICATION_JSON);
                                response.json({ "id": id });
                                // wait after the response has been send
                                return [4 /*yield*/, this.model.get(id).wait()];
                            case 1:
                                // wait after the response has been send
                                _a.sent();
                                log_1.Log.info("the download of " + this.model.get(id).torrent.path + " on " + this.model.get(id).torrent.file.name + " finished.");
                                return [2 /*return*/];
                        }
                    });
                }); });
                form.parse(request);
                return [2 /*return*/];
            });
        });
    };
    DownloadsController.prototype.deletedownload = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var id;
            return __generator(this, function (_a) {
                id = request.body.id;
                this.model.delete(id);
                response.status(http_1.STATUS_OK);
                response.contentType(http_1.CONTENT_APPLICATION_JSON);
                response.json({ "id": id });
                return [2 /*return*/];
            });
        });
    };
    /**
     * To download a regular file, associated with a finished DHT download, from the client side
     * @param request express' request object
     * @param response express' response object
     */
    DownloadsController.prototype.getfile = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var id, download;
            return __generator(this, function (_a) {
                id = request.query.id || null;
                download = this.model.get(id);
                if (download) {
                    response.status(http_1.STATUS_OK);
                    response.sendFile(download.torrent.path, function (error) {
                        log_1.Log.error("[DOWNLOADS CONTROLLER] ", error);
                    });
                }
                else {
                    response.status(http_1.STATUS_INTERNAL_SERVER_ERROR);
                    response.send();
                }
                return [2 /*return*/];
            });
        });
    };
    return DownloadsController;
}());
exports.DownloadsController = DownloadsController;
