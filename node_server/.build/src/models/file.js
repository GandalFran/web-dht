// Copyright 2020 Héctor Sánchez San Blas @ Hectorssb in GitHub 
// and Francisco Pinto Santos @ GandalFran in GitHub
// See LICENSE for details.
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var chunk_1 = require("./chunk");
var config_1 = require("../config");
/**
 * Bean representing a file to upload to bittorent
 */
var FileBitTorrent = /** @class */ (function () {
    function FileBitTorrent() {
        this.name = '';
        this.path = '';
        this.content = null;
    }
    /**
     * Builds a FilBittorrent object with the file's path
     * @param path the real file's path
     * @param name the given file's name
     * @return a File instanced from the given path and name with the content loaded into the content attribute.
     */
    FileBitTorrent.buildFromPath = function (path, name) {
        var file = new FileBitTorrent();
        file.name = name;
        file.path = path;
        file.read();
        return file;
    };
    /**
     * Builds a FilBittorrent object with the file's content splitted in chunks
     * @param path the real file's path
     * @param name the given file's name
     * @param chunks the given file's content splitted in chunks
     * @return a File instanced from the given path and name with the content persisted into the file's path.
     */
    FileBitTorrent.buildFromChunks = function (path, name, chunks) {
        var file = new FileBitTorrent();
        file.name = name;
        file.path = path;
        file.join(chunks);
        file.write();
        return file;
    };
    /**
     * Splits the file content in chunks of Config.getInstance().dht.chunkSize bytes.
     */
    FileBitTorrent.prototype.split = function () {
        var chunks = [];
        var chunkSize = config_1.Config.getInstance().dht.chunkSize;
        // if there is no content, read the file
        if (!this.content) {
            this.read();
        }
        // generate chunks
        for (var i = 0; i < this.content.length; i += chunkSize) {
            var chunkEnd = (i + chunkSize > this.content.length) ? (this.content.length) : (i + chunkSize);
            var bufferChunk = this.content.slice(i, chunkEnd);
            var chunk = chunk_1.Chunk.buildWithValue(bufferChunk);
            chunks.push(chunk);
        }
        return chunks;
    };
    /**
     * Joins the file content splitted chunks into a single buffer.
     */
    FileBitTorrent.prototype.join = function (chunks) {
        var bufferChunks = [];
        chunks.forEach(function (chunk) {
            bufferChunks.push(chunk.value);
        });
        this.content = Buffer.concat(bufferChunks);
    };
    /**
     * Reads the file content and loads it into the content attribute.
     */
    FileBitTorrent.prototype.read = function () {
        this.content = FileSystem.readFileSync(this.path);
    };
    /**
     * Writes the file content (stored in the content attribute) into the file's path.
     */
    FileBitTorrent.prototype.write = function () {
        FileSystem.writeFileSync(this.path, this.content);
    };
    return FileBitTorrent;
}());
exports.FileBitTorrent = FileBitTorrent;
/**
 * Bean representing a torrent file resulting from an upload to bittorent
 */
var Torrent = /** @class */ (function (_super) {
    __extends(Torrent, _super);
    function Torrent() {
        var _this = _super.call(this) || this;
        _this.file = new FileBitTorrent();
        _this.chunks = [];
        return _this;
    }
    /**
     * Builds a Torrent object with a regular file
     * @param file the file to build the torrent
     * @return a Torrent instanced from the given file.
     */
    Torrent.buildTorrentFromRegularFile = function (file) {
        var torrent = new Torrent();
        // buld torrent file object
        torrent.file = file;
        torrent.name = file.name + '.torrent';
        torrent.path = file.path + '.torrent';
        torrent.chunks = file.split();
        return torrent;
    };
    /**
     * Builds a Torrent object with a torrent file
     * @param path the torrent file path
     * @param filePath the location to store the file associated to the torrent if is downloaded
     * @param fileNamePrefix the name prefix used to avoid conflicts on files with the same name downloaded from the DHT.
     * @return a Torrent instanced from the given parameters, and with the list of chunk's cids loaded.
     */
    Torrent.buildTorrentFromTorrentFile = function (path, filePath, fileNamePrefix) {
        var torrent = new Torrent();
        torrent.name = path;
        torrent.path = path;
        torrent.file.path = filePath;
        torrent.file.name = fileNamePrefix;
        torrent.parseTorrentContent();
        return torrent;
    };
    /**
     * Stores the file contained in file attribute into the DHT.
     * @return a promises that will be fullfillmed when the file is stored into the DHT.
     */
    Torrent.prototype.store = function () {
        return __awaiter(this, void 0, void 0, function () {
            var torrent;
            return __generator(this, function (_a) {
                torrent = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var promises = [];
                        torrent.chunks.forEach(function (chunk) {
                            if (!chunk.cid) {
                                promises.push(chunk.store());
                            }
                        });
                        Promise.all(promises).then(function () {
                            torrent.buildTorrentContent();
                            torrent.write();
                            resolve();
                        }).catch(function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    /**
     * Retrieves a file from the DHT, resolving the list of fil chunks and building a file with the resolved chunks.
     * @return a file obtained from joining the chunks retrieved from the DHT.
     */
    Torrent.prototype.resolve = function () {
        return __awaiter(this, void 0, void 0, function () {
            var torrent;
            return __generator(this, function (_a) {
                torrent = this;
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        var promises = [];
                        torrent.chunks.forEach(function (chunk) {
                            if (!chunk.value) {
                                promises.push(chunk.resolve());
                            }
                        });
                        Promise.all(promises).then(function () {
                            torrent.file = FileBitTorrent.buildFromChunks(torrent.file.path, torrent.file.name, torrent.chunks);
                            resolve();
                        }).catch(function (error) {
                            reject(error);
                        });
                    })];
            });
        });
    };
    /**
     * Builds a torrent file content from the file and chunks attribute.
     * @return the torrent file format.
     */
    Torrent.prototype.buildTorrentContent = function () {
        var torrentInfo = {
            name: this.file.name,
            path: this.file.name,
            created: new Date(),
            comment: 'created during the final days of humanity after the arrival of covid19',
            files: [{
                    path: this.file.path,
                    name: this.file.name,
                    length: this.file.content.length,
                    offset: 0,
                }],
            length: this.file.content.length,
            pieceLength: config_1.Config.getInstance().dht.chunkSize,
            lastPieceLength: this.chunks[this.chunks.length - 1].value.length,
            pieces: []
        };
        // complete torrent info
        this.chunks.forEach(function (chunk) {
            torrentInfo.pieces.push(chunk.cid.toString('base64'));
        });
        this.content = Buffer.from(JSON.stringify({ info: torrentInfo }));
    };
    /**
     * Parses torrent file's content, and buils the array of chunks.
     */
    Torrent.prototype.parseTorrentContent = function () {
        // read if content not loaded
        if (!this.content) {
            this.read();
        }
        // parse content
        var torrentInfo = JSON.parse(this.content.toString('utf-8'));
        this.file.name = torrentInfo.info.name;
        this.file.path = this.file.path + '/' + this.file.name + torrentInfo.info.name;
        for (var i = 0; i < torrentInfo.info.pieces.length; i++) {
            var piece = torrentInfo.info.pieces[i];
            this.chunks.push(chunk_1.Chunk.buildWithCid(Buffer.from(piece, 'base64')));
        }
    };
    return Torrent;
}(FileBitTorrent));
exports.Torrent = Torrent;
