var googleapis = require('googleapis'),
    util = require('util'),
    Readable = require('stream').Readable;

util.inherits(Uploads, Readable);

function Uploads(opt) {
    if (!(this instanceof Uploads)) return new Uploads(opt);

    opt = opt || {};

    Readable.call(this, { objectMode : true });

    this._apiKey = opt.apiKey || "AIzaSyADIr0Wc90vAjAEWi-fb84yJ9HmzWKDGCg";
    this._playlistId = opt.playlistId || "UUAxBpbVbSXT2wsCwZfrIIVg";
    this._nextPageToken = null;
    this._videos = [];
}

Uploads.prototype._read = function(size) {
    if(!this._list()) {
        this.push(this._videos.shift());
    }
};

Uploads.prototype._list = function() {
    if (this._videos.length > 0) {return false;}

    var self = this;

    googleapis
        .discover('youtube', 'v3')
        .execute(function(err, client) {
            var req1 = client.youtube.playlistItems.list({
                part: "snippet",
                playlistId: self._playlistId,
                maxResults: 50,
                pageToken: self._nextPageToken
            })
            .withApiKey('AIzaSyADIr0Wc90vAjAEWi-fb84yJ9HmzWKDGCg')
            .execute(function(err, resp) {
                if (err) {
                    self.push(null);
                } else {
                    Array.prototype.push.apply(self._videos, resp.items);
                    self.push(self._videos.shift());
                    self._nextPageToken = resp.nextPageToken;
                }
            });
        });

    return true;
};

module.exports = Uploads;