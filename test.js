var Uploads = require("./uploadstream");

var u = new Uploads();

var vids = [];

u.on('data', function(v) {
    vids.push(v);

    if (vids.length > 30) {
        u.pause();
        console.log('got videos', vids.length);
    }
});