var cheerio = require('cheerio');
var fs = require('fs');

var powers = [];

var path = "/Users/orrybaram/Google Drive/compendium/Power/";
var files = [];

fs.readdir(path, function(err, _files) {
	if (err) throw err;
	files = _files;
	readFiles();
});

//9381 last count matches files.length!

function readFiles() {

	for (var i = files.length - 1; i >= 0; i--) {
		var file = files[i]
	
		console.log(i);

		var data = fs.readFileSync(path + file, {'encoding': 'utf8'})
		var $ = cheerio.load(data);

		var power = {};

		power["id"] = file.replace(".html", "");

		$('h1').first().filter(function() {
			var data = $(this);
			var power_name = data.children()[0].next.data;
			power["name"] = trimString(power_name)
		})

		if($('h1').eq(1)) {
			power["secondary_attack"] = trimString($('h1').eq(1).text());
		}


		if(power['name'] !== "Force Orb") continue;



		power["type"] = $('h1').attr('class');
		
		power["level"] = trimString($('.level').text());
		power["description"] = trimString($('.flavor').first().text());
		power["info"] = removeLinebreaks(removeWhiteSpaces($('.powerstat').first().text()))

		$('p').not('.publishedIn').each(function(i, el) {

			var $el = $(el);
			var key = null;
			var value = $el.children()[0].next.data;

			console.log(value)
			
			if (value.indexOf(':') > -1 && value.indexOf(':') < 10) {
				var key = $el.find('b').text().toLowerCase()
			} else {
				power['secondary_info'] = removeLinebreaks(removeWhiteSpaces($el.text()));
			}

			if (key) {
				if(power[key]) key = key + "2";

				key = trimString(key).replace(' ', '_');
				power[key] = trimString(value).substr(2);	
			}
		})

		

		powers.push(power)
		fs.writeFileSync('output.json', JSON.stringify(powers, null, 4));

	}
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





