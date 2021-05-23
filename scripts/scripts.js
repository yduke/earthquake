(function($) {
	'use strict';
		$(function () {
		var userLang = navigator.language || navigator.userLanguage;
		var currentLang;
		if(userLang == 'zh-CN' || userLang == 'zh-TW'){
					currentLang = 'cn';
				}else{
					currentLang = 'en';
				};
	$(document).ready(function() {
		function convertTimestamp(timestamp) {
			var d = new Date(timestamp * 1000),
				yyyy = d.getFullYear(),
				mm = ('0' + (d.getMonth() + 1)).slice(-2),
				dd = ('0' + d.getDate()).slice(-2),
				hh = d.getHours() < 10 ? ('0' + d.getHours()) : d.getHours(),
				h = hh,
				min = ('0' + d.getMinutes()).slice(-2),
				ampm = 'AM',
				time;
			if (hh > 12) {
				h = hh - 12;
				ampm = 'PM'
			} else if (hh === 12) {
				h = 12;
				ampm = 'PM'
			} else if (hh == 0) {
				h = 12
			}
			if(currentLang== 'cn'){
			time = mm + '月' + dd + ' ' + hh + ':' + min;
			}else{
			time = mm + '-' + dd + ' ' + hh + ':' + min;
			}
			return time
		}
		if ($('#earthquake').length > 0) {
			let url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
			$.getJSON(url, function(data, status) {
				$("#amount_of_earthquake,#amount_of_earthquakes").html(data.features.length);
				$("#updates,#updatess").html(convertTimestamp(data.features[0].properties.updated / 1000));
				var transform = {
					"<>": "tr",
					"html": [{
						"<>": "td",
						"class": function() {
							var mag = this.properties.mag;
							if (mag > 5 && mag <= 6) {
								return "eqk_num warning"
							} else if (mag > 6) {
								return "eqk_num alert bold"
							}
						},
						"text": function() {
							return (convertTimestamp(this.properties.time / 1000))
						}
					}, {
						"<>": "td",
						"class": function() {
							var mag = this.properties.mag;
							if (mag > 5 && mag <= 6) {
								return "eqk_num warning"
							} else if (mag > 6) {
								return "eqk_num alert bold"
							}
						},
						"text": "${properties.place}"
					}, {
						"<>": "td",
						"class": function() {
							var mag = this.properties.mag;
							if (mag > 5 && mag <= 6) {
								return "eqk_num warning"
							} else if (mag > 6) {
								return "eqk_num alert bold"
							}
						},
						"text": "M" + "${properties.mag}"
					}, {
						"<>": "td",
						"class": function() {
							var mag = this.properties.mag;
							if (mag > 5 && mag <= 6) {
								return "eqk_num warning tdright"
							} else if (mag > 6) {
								return "eqk_num alert bold tdright"
							} else {
								return "tdright"
							}
						},
						"text": function() {
							var depth = this.geometry.coordinates[2];
							return (depth.toFixed(2))
						}
					}, ]
				};
				$('#earthquake').json2html(data.features, transform);
				$(".loading").fadeOut("slow")
			}).fail(function(status) {
				$(".loading").fadeOut("slow");
				$("#earthquake").html(data)
			})
		}
	})
	

		console.log(currentLang);
        $('#multlang').multilang({
			defaultLang:currentLang,
            languages:{
            'cn':{'name':'Chinese','nativeName':'中文'},
            'en':{'name':'English','nativeName':'English'}
            }
        });
    });
})(jQuery);