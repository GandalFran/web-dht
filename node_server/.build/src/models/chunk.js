"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dht_1 = require("../models/dht");
var Chunk = /** @class */ (function () {
    function Chunk() {
        this.cid = null;
        this.value = null;
    }
    Chunk.buildWithValue = function (value) {
        var chunk = new Chunk();
        chunk.value = value;
        return chunk;
    };
    Chunk.buildWithCid = function (cid) {
        var chunk = new Chunk();
        chunk.cid = cid;
        return chunk;
    };
    Chunk.prototype.store = function () {
        var chunk = this;
        return new Promise(function (resolve, reject) {
            if (!chunk.cid) {
                dht_1.DHT.getInstance().put(chunk).then(function (cid) {
                    chunk.cid = cid;
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    Chunk.prototype.resolve = function () {
        var chunk = this;
        return new Promise(function (resolve, reject) {
            if (!chunk.value) {
                dht_1.DHT.getInstance().get(chunk).then(function (value) {
                    chunk.value = value;
                    resolve();
                }).catch(function (err) {
                    reject(err);
                });
            }
        });
    };
    return Chunk;
}());
exports.Chunk = Chunk;
