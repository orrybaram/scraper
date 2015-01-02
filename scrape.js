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


function readFiles() {
	
	for (var i = 0; i < files.length; i++) {
		
		var file = files[i]

		if (file.indexOf('html') < 0) continue;

		var data = fs.readFileSync(path + file, {'encoding': 'utf8'})
		var $ = cheerio.load(data);

		var power = {};

		power["id"] = file.replace(".html", "");

		$('h1').first().filter(function() {
			var data = $(this);
			var power_name = data.children()[0].next.data;
			power["name"] = trimString(power_name)
		})

		power["type"] = $('h1').attr('class');
		power["level"] = trimString($('.level').text());
		power["description"] = trimString($('.flavor').first().text());
		power["info"] = removeLinebreaks(removeWhiteSpaces($('.powerstat').first().text()))
		power["primary"] = {};
		
		$('p').not('.publishedIn').each(function(i, el) {

			var $el = $(el);
			var key = null;
			var value = ''

			$el.contents().each(function() {
				if(this.nodeType === 3){
			    	value += this.data;
			    }	
			})
			value = trimString(value);
			
			if (value.indexOf(':') > -1 && value.indexOf(':') < 10) {
				var key = $el.find('b').text().toLowerCase()
			} 

			if (key) {
				if(power['primary'][key]) key = key + "2";
				key = trimString(key).replace(' ', '_');
				power['primary'][key] = trimString(value).substr(2);	
			}

			if($el.next()[0].name === 'br') {
				return false;
			}
		})

		if($('h1').eq(1).length) {
			power["secondary"] = {};
			power["secondary_attack"] = trimString($('h1').eq(1).text());

			$('h1').eq(1).nextAll('p').not('.publishedIn').each(function(i, el) {
				var $el = $(el);
				var key = null;
				var value = ''

				$el.contents().each(function() {
					if(this.nodeType === 3){
				    	value += this.data;
				    }	
				})
				value = trimString(value);
				
				if (value.indexOf(':') > -1 && value.indexOf(':') < 10) {
					var key = $el.find('b').text().toLowerCase()
				} else if(value.length > 1) {
					power['secondary_info'] = removeLinebreaks(removeWhiteSpaces($el.text()));
				}


				if (key) {
					if(power['secondary'][key]) key = key + "2";
					key = trimString(key).replace(' ', '_');
					power['secondary'][key] = trimString(value).substr(2);	
				}
			})
		}

		powers.push(power)
		console.log(i + ' -- ' + power['name']);


	}
	console.log('Finished!');
	fs.writeFileSync('output.json', JSON.stringify(powers, null, 4));
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





