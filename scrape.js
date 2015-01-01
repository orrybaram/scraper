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

	files.forEach(function(file, i) {
		
		if (i > 100) return;
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

		power["type"] = $('h1').attr('class');
		
		power["level"] = trimString($('.level').text());
		power["description"] = trimString($('.flavor').first().text());
		power["info"] = removeLinebreaks(removeWhiteSpaces($('.powerstat').first().text()))

		$('p').each(function(i, el) {

			var $el = $(el);
			var key = null;
			var value = $el.children()[0].next.data;
			
			console.log($(el).children()[0].next.data)

			console.log($(el).children()[0].next.data)

			console.log($(el).children()[0].next.data)

			if (value.indexOf(':') > -1 && value.indexOf(':') < 10) {
				var key = $el.find('b').text()
				console.log('yooo')
			} else {
				return false;
			}

			console.log(key)


			// if(power[key]) key = key + "2";

			power[key] = trimString(value).substr(2);




			// if($(el).children().first().text().indexOf('Target') > -1) {
			// 	power["target"] = trimString($(el).children()[0].next.data).substr(2)
			// } 
			// else if ($(el).children().first().text().indexOf('Attack') > -1) {
			// 	power["attack"] = trimString($(el).children()[0].next.data).substr(2)
			// }

			// else if ($(el).children().first().text().indexOf('Hit') > -1) {
			// 	var first = trimString($(el).children().text()).substr(4)
			// 	var last = trimString($(el).children()[0].next.data).substr(2)

			// 	if (power.hit) {
			// 		power["hit2"] = first + " " + last;
			// 	} else if (power.hit2) {
			// 		power["hit3"] = first + " " + last;
			// 	} else {
			// 		power["hit"] = first + " " + last;
			// 	}
			// }
			// else if ($(el).children().first().text().indexOf('Miss') > -1) {
			// 	power["miss"] = trimString($(el).children()[0].next.data).substr(2)
			// }

			// else if ($(el).children().first().text().indexOf('Special') > -1) {
			// 	power["special"] = trimString($(el).children()[0].next.data).substr(2)
			// }

			// else if ($(el).children().first().text().indexOf('Effect') > -1) {
			// 	power["effect"] = trimString($(el).children()[0].next.data).substr(2)
			// } 
			// else if ($(el).children().first().text().indexOf('Secondary Target') > -1) {
			// 	power["secondary_target"] = trimString($(el).children()[0].next.data).substr(2)
			// } 
			// else if ($(el).children().first().text().indexOf('Secondary Attack') > -1) {
			// 	power["secondary_attack"] = trimString($(el).children()[0].next.data).substr(2)
			// }

			// else if ($(el).children().first().text().indexOf('Sustain Minor') > -1) {
			// 	power["secondary_attack"] = trimString($(el).children()[0].next.data).substr(2)
			// }
		})

		

		powers.push(power)
		fs.writeFileSync('output.json', JSON.stringify(powers, null, 4));

	})
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





