"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dht_1 = require("../models/dht");
/**
 * Bean reperesenting a piece of file.
 */
var Chunk = /** @class */ (function () {
    function Chunk() {
        this.cid = null;
        this.value = null;
    }
    /**
     * Builds a chunk with the chunk's content
     * @param value the chunk's content
     * @return a Chunk object containign the given buffer
     */
    Chunk.buildWithValue = function (value) {
        var chunk = new Chunk();
        chunk.value = value;
        return chunk;
    };
    /**
     * Builds a chunk with the chunk's CID (DHT's assigned id)
     * @param cid the chunk's cid
     * @return a Chunk object containign the given cid
     */
    Chunk.buildWithCid = function (cid) {
        var chunk = new Chunk();
        chunk.cid = cid;
        return chunk;
    };
    /**
     * Stores the chunk into the DHT and completes the cid attribute.
     * @return a promise that will be fullfillmed when the chunk is
     *		stored into the DHT.
     */
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
    /**
     * Retrieves a chunk from the DHT and completes the value attribute.
     * @return a promise that will be fullfillmed when the chunk is
     *		retrieved from the DHT.
     */
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
