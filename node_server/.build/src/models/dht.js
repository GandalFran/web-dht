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
var OS = __importStar(require("os"));
var BittorrentDHT = require("bittorrent-dht");
var log_1 = require("../log");
var config_1 = require("../config");
var DHT = /** @class */ (function () {
    function DHT() {
        this.dht = null;
        this.dhtId = null;
        this.peers = new Array();
    }
    DHT.getInstance = function () {
        if (!DHT.singletonInstance) {
            DHT.singletonInstance = new DHT();
            DHT.singletonInstance.init();
        }
        return DHT.singletonInstance;
    };
    DHT.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.generateId()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.initDht()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DHT.prototype.generateId = function () {
        var ifaces = OS.networkInterfaces();
        var iface = ifaces[config_1.Config.getInstance().dht.idIface];
        // obtain mac
        var mac = null;
        if (iface !== undefined) {
            mac = iface[0].mac;
            log_1.Log.debug("[DHT] Using the iface " + config_1.Config.getInstance().dht.idIface + " MAC address " + mac + " as id");
        }
        else {
            log_1.Log.error("[DHT] The iface " + config_1.Config.getInstance().dht.idIface + " was not found, looking for other ifaces", null);
            var availableIfaces_1 = [];
            Object.keys(ifaces).forEach(function (aIface) {
                availableIfaces_1.push(aIface);
            });
            var selectedIface = availableIfaces_1[0];
            mac = selectedIface[0].mac;
            log_1.Log.debug("[DHT] Using the iface " + selectedIface + " MAC address " + mac + " as id");
        }
        // generate id with mac
        var id = mac + Math.floor(Math.random() * 10000);
        this.dhtId = Buffer.alloc(20).fill(id);
        log_1.Log.info("[DHT] assigned id " + this.dhtId);
    };
    DHT.prototype.initDht = function () {
        return __awaiter(this, void 0, void 0, function () {
            var opts, dht, id;
            return __generator(this, function (_a) {
                try {
                    opts = {
                        nodeId: this.dhtId,
                        host: config_1.Config.getInstance().dht.isPublic,
                        bootstrap: config_1.Config.getInstance().dht.bootstrapPeers,
                        concurrency: 100,
                        timeBucketOutdated: 5000,
                        maxAge: 10000
                    };
                    // instance and start listening
                    this.dht = new BittorrentDHT(opts);
                    // register events
                    this.dht.on('ready', function () {
                        log_1.Log.debug("[DHT] ready");
                    });
                    this.dht.on('peer', function (peer, infoHash, from) {
                        log_1.Log.debug("[DHT] found potential peer on " + peer.host + ":" + peer.port);
                    });
                    this.dht.on('node', function (node) {
                        if (!config_1.Config.getInstance().dht.isPublic) {
                            log_1.Log.debug("[DHT] found new peer on " + node.host + ":" + node.port);
                        }
                    });
                    this.dht.on('announce', function (peer, infoHash) {
                        log_1.Log.debug("[DHT] recived announce from " + peer.host + ":" + peer.port);
                    });
                    this.dht.on('error', function (error) {
                        log_1.Log.error("[DHT]", error);
                    });
                    dht = this.dht;
                    id = this.dhtId;
                    this.dht.listen(config_1.Config.getInstance().dht.port, function () {
                        log_1.Log.info("[DHT] listening on port " + config_1.Config.getInstance().dht.port);
                    });
                }
                catch (e) {
                    log_1.Log.error('[DHT] excepccion occured on start', e);
                }
                return [2 /*return*/];
            });
        });
    };
    DHT.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.dht.destroy()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    DHT.prototype.put = function (chunk) {
        return __awaiter(this, void 0, void 0, function () {
            var dht;
            return __generator(this, function (_a) {
                dht = this.dht;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        dht.put({ v: chunk.value, force: true }, function (error, cid, nodesAccepted) {
                            if (error) {
                                log_1.Log.error("[DHT] put error", error);
                                reject(error);
                            }
                            else {
                                log_1.Log.debug("[DHT] put '" + cid.toString('base64') + "' success. Accepted in " + JSON.stringify(nodesAccepted) + " peers");
                                resolve(cid);
                            }
                        });
                    })];
            });
        });
    };
    DHT.prototype.get = function (chunk) {
        return __awaiter(this, void 0, void 0, function () {
            var dht;
            return __generator(this, function (_a) {
                dht = this.dht;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        dht.lookup(chunk.cid, function (error, found) {
                            if (error) {
                                log_1.Log.error("[DHT] get lookup error", error);
                                reject(error);
                            }
                            else {
                                dht.get(chunk.cid, function (error, value) {
                                    if (error) {
                                        log_1.Log.error("[DHT] get '" + chunk.cid.toString('base64') + "' error ", error);
                                        reject(error);
                                    }
                                    else if (value === null) {
                                        var error_1 = new Error('Value not found for requested cid');
                                        log_1.Log.error("[DHT] get not found value for '" + chunk.cid.toString('base64') + "'", error_1);
                                        reject(error_1);
                                    }
                                    else {
                                        log_1.Log.debug("[DHT] get '" + chunk.cid.toString('base64') + "' success. Obtained from " + value.id.toString('base64'));
                                        resolve(value.v);
                                    }
                                });
                            }
                        });
                    })];
            });
        });
    };
    DHT.singletonInstance = null;
    return DHT;
}());
exports.DHT = DHT;
