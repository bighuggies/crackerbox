var express    = require('express'),
    router     = express.Router(),
    googleapis = require('googleapis');

/* GET users listing. */
router.get('/', function(req, res) {
  googleapis
    .discover('youtube', 'v3')
    .execute(function(err, client) {
      var req1 = client.youtube.search.list({
        part: "snippet",
        channelId: "UCAxBpbVbSXT2wsCwZfrIIVg",
        order: "date",
        type: "video",
        maxResults: 10
      }).withApiKey('AIzaSyADIr0Wc90vAjAEWi-fb84yJ9HmzWKDGCg');

      var req2 = client.youtube.search.list({
        part: "snippet",
        channelId: "UClu2e7S8atp6tG2galK9hgg",
        order: "date",
        type: "video",
        maxResults: 10
      }).withApiKey('AIzaSyADIr0Wc90vAjAEWi-fb84yJ9HmzWKDGCg');


      client.newBatchRequest()
        .add(req1)
        .add(req2)
        .execute(function(err, results) {
          if (err) {
            console.log('Error', err);
            return;
          }
          results.forEach(function(result) {
            res.send(result);
          });
        });
    });

});

module.exports = router;
