(function($) {
	'use strict';
	$(function() {
//Detect Browser language
		var userLang = navigator.language || navigator.userLanguage;
		var currentLang;
		if (userLang == 'zh-CN' || userLang == 'zh-TW') {
			currentLang = 'cn';
		} else {
			currentLang = 'en';
		};
//Multlang
		$('#multlang').multilang({
			defaultLang: currentLang,
			languages: {
				'cn': {
					'name': 'Chinese',
					'nativeName': '中文'
				},
				'en': {
					'name': 'English',
					'nativeName': 'English'
				}
			}
		});

//convert time
		function convertTimestamp(timestamp) {
			var d = new Date(timestamp),
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
			if (currentLang == 'cn') {
				time = mm + '月' + dd + ' ' + hh + ':' + min;
			} else {
				time = mm + '-' + dd + ' ' + hh + ':' + min;
			}
			return time
		}

//Detect mobile
		function IsMobile() {
			var isMobile = {
				Android: function() {
					return navigator.userAgent.match(/Android/i) ? true : false;
				},
				BlackBerry: function() {
					return navigator.userAgent.match(/BlackBerry/i) ? true : false;
				},
				iOS: function() {
					return navigator.userAgent.match(/iPhone|iPad|iPod/i) ? true : false;
				},
				Windows: function() {
					return navigator.userAgent.match(/IEMobile/i) ? true : false;
				},
				any: function() {
					return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Windows());
				}
			};
			return isMobile.any();
		}



		$(document).ready(function() {
//get eq json data	
			let urla = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson';
			$.getJSON(urla, callback);

			function callback(json) {
//				console.log(json);
				var str = '';
				for (var i = 0; i < json.features.length; i++) {
					if (json.features[i].properties.place != '') {
						str += json.features[i].properties.place + '\n';
					}
				}
//				console.log(str);
				var appid = '20180903000202314';  //CHANGE THIS TO YOUR OWN PLEASE 请将此处修改为您自己的baidu翻译appid
				var key = 'ema3uNOkIFp2CFGlA6i_'; //CHANGE THIS TO YOUR OWN PLEASE 请将此处修改为您自己的baidu翻译key
				var salt = (new Date).getTime();
				var query = str;
				var from = 'en';
				var to = 'zh';
				var str1 = appid + query + salt + key;
				var sign = MD5(str1);
				var host = document.domain;
				if( host != 'localhost' && host != 'dukeyin.com' && appid =='20180903000202314' ){
					$("footer").append('<p><small style="color:red">请将scripts.js中的<a href="https://api.fanyi.baidu.com/api/trans/product/desktop">百度翻译API</a>密钥替换为您自己的。当API过度请求，就会造成无法使用。修改后本信息会自动消失。<br>Please replace <a href="https://api.fanyi.baidu.com/api/trans/product/desktop">translation API</a> key in scripts.js to your own. When the API is over-requested, this service will not work anymore. This message will be disappear automatically after key changing.</small></p>')
				}
				$.ajax({
					url: 'https://api.fanyi.baidu.com/api/trans/vip/translate',
					type: 'get',
					dataType: 'jsonp',
					async: false,
					data: {
						q: query,
						appid: appid,
						salt: salt,
						from: from,
						to: to,
						sign: sign
					},
					success: function(data) {
						var obj = $.extend(json, data);
//						console.log(obj);
						$("#amount_of_earthquake,#amount_of_earthquakes").html(obj.features.length);
						$("#updates,#updatess").html(convertTimestamp(obj.features[0].properties.updated));

						var table = "";
						var hideen = '';
						var hidecn = '';
						if (currentLang == 'cn') {
							hideen = " style='display:none'";
							hidecn = "";
						} else {
							hidecn = " style='display:none'";
							hideen = "";
						}
						for (var p = 0; p < obj.features.length; p++) {
							var classs;
							var mag = obj.features[p].properties.mag;
							var tsunami = obj.features[p].properties.tsunami;
							if (mag > 5 && mag <= 6) {
								classs = "warning bold"
							} else if (mag > 6) {
								classs = "alert bold"
							} else {
								classs = ''
							}
							if(tsunami == 1 ){
								classs += " tsunami"
							}
							table += "<tr class='" + classs + "'><td>" + convertTimestamp(json.features[p].properties.time) + "</td><td><div class='multilang' lang='cn'" + hidecn + ">" + obj.trans_result[p].dst + "</div><div class='multilang' lang='en'" + hideen + ">" + json.features[p].properties.place + "</div></td><td>M" + json.features[p].properties.mag + "</td><td>" + json.features[p].geometry.coordinates[2] + "km</td></tr>";
						}

						$('#eqtable').append(table);
						$(".loading").fadeOut("slow")
					}
				});
			};

//Add to home screen
//set cookie if notify add to home screen
			if ($.cookie('aths') == '1') {
				$('#addhomescreen').hide();
			} else if ($.cookie('aths') != '1' && IsMobile()) {
				$.cookie('aths', '1', {
					expires: 7,
					path: '/'
				});
			} else {
				$('#addhomescreen').hide();
			}
//Close add to home screen
			$(".ahscls button").click(function() {
				$("#addhomescreen").slideUp();
				$.cookie('aths', '1', {
					expires: 7,
					path: '/'
				});
			});
			
			PullToRefresh.init({
				mainElement: 'body',
				instructionsPullToRefresh: '下拉刷新 Pull to refresh',
				instructionsReleaseToRefresh:'释放刷新 Release to refresh',
				instructionsRefreshing:'正在刷新 Refreshing',
//				onRefresh: function() {  window.location.reload();}
			});
		}) //documentReadyEnd

	});

})(jQuery);