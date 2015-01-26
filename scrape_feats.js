var cheerio = require('cheerio');
var fs = require('fs');

var feats = [];

var path = "/Users/orrybaram/Google Drive/compendium/Feat/";
var files = [];


fs.readdir(path, function(err, _files) {
	if (err) throw err;
	files = _files;
	readFiles();
});


function readFiles() {
	
	for (var i = 0; i < files.length; i++) {
	// for (var i = 23; i < 24; i++) {

		var file = files[i]

		if (file.indexOf('html') < 0) continue;

		var data = fs.readFileSync(path + file, {'encoding': 'utf8'})
		var $ = cheerio.load(data);

		var feat = {};
		
		feat["id"] = file.replace(".html", "");
		feat['name'] = '';
		feat['html'] = '';
		
		$('h1').contents().each(function() {
			if(this.nodeType === 3){
		    	feat['name'] += trimString(this.data);
		    }	
		})

		feat['html'] = $('#detail').html();
		feats.push(feat)
		console.log(i + ' -- ' + feat['name']);
		
	}
	console.log('Finished!');
	fs.writeFileSync('output.json', JSON.stringify(feats, null, 4));
}


function trimString(string) {
	return trim2(removeLinebreaks(string));
}
function removeLinebreaks(string) {
	return string.replace(/(\r\n|\n|\r)/gm,"");
}


function trim2 (str) {
    str = str.replace(/^\s+/, '');
    for (var i = str.length - 1; i >= 0; i--) {
        if (/\S/.test(str.charAt(i))) {
            str = str.substring(0, i + 1);
            break;
        }
    }
    return str;
}

function removeWhiteSpaces(str) {
	return str.replace(/\s+/g, ' ')
}





