
var DHT = require('bittorrent-dht')


const dht = new DHT();

var value = Buffer.alloc(50).fill('como mola distribuidos es la polla')

console.log(JSON.stringify(value.toString('utf8')))
dht.put({ v: value }, function (err, hash) {
  	console.error('error=', err);
  	console.log('hash=', hash.toString('utf8'));

	dht.get(hash, function (err, res) {
	    console.error('error=', err);
	  	console.log('res=', res.v.toString('utf8'));
	})

	dht.get(hash, function (err, res) {
	    console.error('error=', err);
	  	console.log('res=', res.v.toString('utf8'));
	})
})
