var _ = require('lodash');
var cheerio = require('cheerio');
var fs = require('fs');

var items = [];

var path = "/Users/orrybaram/Google Drive/compendium/Item/";
var files = [];


fs.readdir(path, function(err, _files) {
	if (err) throw err;
	files = _files;
	readFiles();
});


function readFiles() {
	
	for (var i = 0; i < files.length; i++) {
		
		// if(i > 10) continue

		var file = files[i]

		if (file.indexOf('html') < 0) continue;

		var data = fs.readFileSync(path + file, {'encoding': 'utf8'})
		var $ = cheerio.load(data);

		var item = {};
		
		item["id"] = file.replace(".html", "");
		item['name'] = '';
		
		$('h1').contents().each(function() {
			if(this.nodeType === 3){
		    	item['name'] += trimString(this.data);
		    }	
		})

		// Fancier Card Format
		if($('.mistat').length) {
			item["description"] = trimString($('.miflavor').first().text());
			item["level"] = trimString($('.milevel').text());

			$('p').not('.publishedIn').each(function(i, el) {
				var $el = $(el);
				var key = null;
				var value = ''

				// If we have a bunch of <b>'s in a <p>
				if($el.find('b').length > 1) {
					var keys = [];
					var values = [];
					$(el).contents().each(function() {
						var val = ''
						if(this.nodeType === 3){
					    	val += trimString(this.data)
					    	if(val.length) values.push(val)	
					    }
					});
					$el.find('b').each(function(i, el) {
						value = trimString(value);
						key = trimString($(el).text().toLowerCase())
						
						console.log(key)

						if (key) {
							key = trimString(key).replace(' ', '_');
							keys.push(key)
						}
					})
					item["info"] = _.zipObject(keys, values);

				} else {
					$el.contents().each(function() {
						if(this.nodeType === 3){
					    	value += this.data;
					    }	
					})

					value = trimString(value);
					key = trimString($el.find('b').text().toLowerCase())
					if (key) {
						key = trimString(key).replace(' ', '_');
						item[key] = value;	
					}
				}
			})
		} 
		// Shittier Format
		else {
			$('br').remove();
			var values = [];
			var keys = [];
			
			$('b').each(function(i, el) {
				var $el = $(el);
				keys.push(trimString($el.text()))
			})

			var idx = -1;
			$('#detail').contents().each(function(i) {
				if(this.nodeType === 3 && this.data.length > 5) {
			    	var text = this.data;
					// Check for paragraphs
					if(this.next.type === 'text') {
						text += this.next.data;
					}
					if (values[idx] && trimString(values[idx]).indexOf(trimString(text)) > -1) {
						// we check to see if the next text 
						// block exists in the first one, and move on if it is
					} else {
						values.push(trimString(text).substr(2));	
					}	
					idx += 1;
				}	
			})

			info = _.zipObject(keys, values);
			item['info'] = info;
		}

		items.push(item)
		console.log(i + ' -- ' + item['name']);


	}
	console.log('Finished!');
	fs.writeFileSync('items.json', JSON.stringify(items, null, 4));
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





