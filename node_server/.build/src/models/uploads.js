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
 * Bean that represts an upload.
 */
var Upload = /** @class */ (function () {
    function Upload() {
    }
    /**
     * Calculates the status of the upload with the number of uploaded file's chunks.
     * @return a number, contained in the range of 1 to 100, representing the upload status
     */
    Upload.prototype.status = function () {
        var storedChunks = 0;
        var numChunks = this.torrent.chunks.length;
        this.torrent.chunks.forEach(function (chunk) {
            if (chunk.cid) {
                storedChunks++;
            }
        });
        var percentage = storedChunks / numChunks;
        return percentage * 100;
    };
    /**
     * Wait for upload to complete.
     */
    Upload.prototype.wait = function () {
        return __awaiter(this, void 0, void 0, function () {
            var resolved, attemp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        resolved = false;
                        attemp = 0;
                        _a.label = 1;
                    case 1:
                        if (!(attemp < config_1.Config.getInstance().dht.numAttemps && resolved === false)) return [3 /*break*/, 5];
                        return [4 /*yield*/, Promise.resolve(this.promise).then(function () {
                                resolved = true;
                            }).catch(function (error) {
                                log_1.Log.error("[UPLOADS] error on attemp " + attemp, error);
                            })];
                    case 2:
                        _a.sent();
                        if (!(resolved === false)) return [3 /*break*/, 4];
                        return [4 /*yield*/, new Promise(function (r) { return setTimeout(r, config_1.Config.getInstance().dht.retrySleep); })];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        attemp++;
                        return [3 /*break*/, 1];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    return Upload;
}());
exports.Upload = Upload;
/**
 * Uploads model, containing all the registered uploads in the application.
 */
var Uploads = /** @class */ (function () {
    function Uploads() {
        this.model = {};
    }
    /**
     * Creates an upload in the model
     */
    Uploads.prototype.create = function (id, torrent) {
        var status = new Upload();
        this.model[id] = status;
        status.id = id;
        status.torrent = torrent;
        status.promise = torrent.store();
    };
    /**
     * To obtain an upload from model.
     * @param id the upload's id
     * @return an Upload asociated with the given id
     */
    Uploads.prototype.get = function (id) {
        return (id in this.model) ? this.model[id] : null;
    };
    /**
     * To delete an upload from model.
     * @param id the upload's id
     */
    Uploads.prototype.delete = function (id) {
        try {
            var upload = this.get(id);
            upload.torrent.file.delete();
            upload.torrent.delete();
            delete this.model[id];
        }
        catch (error) {
        }
    };
    /**
     * To obtain all uploads from model.
     * @param id the upload's id
     */
    Uploads.prototype.all = function () {
        var _this = this;
        var all = [];
        Object.keys(this.model).forEach(function (id) {
            all.push(_this.model[id]);
        });
        return all;
    };
    /**
     * To generate an id for a upload.
     * @return a new generated id, unique within this model
     */
    Uploads.prototype.id = function () {
        var id = Uploads.lastId++;
        return JSON.stringify(id);
    };
    Uploads.lastId = 0;
    return Uploads;
}());
exports.Uploads = Uploads;
