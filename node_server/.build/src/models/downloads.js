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
Object.defineProperty(exports, "__esModule", { value: true });
var log_1 = require("../log");
var config_1 = require("../config");
/**
 * Bean that represts a download.
 */
var Download = /** @class */ (function () {
    function Download() {
    }
    /**
     * Calculates the status of the download with the number of downloaded file's chunks.
     * @return a number, contained in the range of 1 to 100, representing the download status
     */
    Download.prototype.status = function () {
        var resolvedChunks = 0;
        var numChunks = this.torrent.chunks.length;
        this.torrent.chunks.forEach(function (chunk) {
            if (chunk.value) {
                resolvedChunks++;
            }
        });
        var percentage = resolvedChunks / numChunks;
        return percentage * 100;
    };
    /**
     * Wait for download to complete.
     */
    Download.prototype.wait = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, attemp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolved = false;
                        attemp = 0;
                        _a.label = 1;
                    case 1:
                        if (!(attemp < config_1.Config.getInstance().dht.numAttemps && !resolved)) return [3 /*break*/, 4];
                        return [4 /*yield*/, Promise.resolve(this.promise).then(function () {
                                resolved = true;
                            }).catch(function (error) {
                                log_1.Log.error("[DOWNLOADS] error on attemp " + attemp, error);
                            })];
                    case 2:
                        _a.sent();
                        _a.label = 3;
                    case 3:
                        attemp++;
                        return [3 /*break*/, 1];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return Download;
}());
exports.Download = Download;
/**
 * Download model, containing all the registered downloads in the application.
 */
var Downloads = /** @class */ (function () {
    function Downloads() {
        this.model = {};
    }
    /**
     * Creates an download in the model
     */
    Downloads.prototype.create = function (id, torrent) {
        var status = new Download();
        this.model[id] = status;
        status.id = id;
        status.torrent = torrent;
        status.promise = torrent.resolve();
    };
    /**
     * To obtain a download from model.
     * @param id the download's id
     * @return an Download asociated with the given id
     */
    Downloads.prototype.get = function (id) {
        return (id in this.model) ? this.model[id] : null;
    };
    /**
     * To delete a download from model.
     * @param id the download's id
     */
    Downloads.prototype.delete = function (id) {
        if (id in this.model)
            this.model[id] = null;
    };
    /**
     * To obtain all downloads from model.
     * @param id the download's id
     */
    Downloads.prototype.all = function () {
        var _this = this;
        var all = [];
        Object.keys(this.model).forEach(function (id) {
            all.push(_this.model[id]);
        });
        return all;
    };
    /**
     * To generate an id for a download.
     * @return a new generated id, unique within this model
     */
    Downloads.prototype.id = function () {
        var id = Downloads.lastId++;
        return JSON.stringify(id);
    };
    Downloads.lastId = 0;
    return Downloads;
}());
exports.Downloads = Downloads;
