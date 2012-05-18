/*
		HaiDianJiaXiao Auto Retrive => A javascript snippet to help you book online.
		Copyright (C) 2012-2015 meeshi
		
		Includes jQuery
		Copyright 2011, John Resig
		Dual licensed under the MIT or GPL Version 2 licenses.
		http://jquery.org/license

		Includes Sizzle.js
		http://sizzlejs.com/
		Copyright 2011, The Dojo Foundation
		Released under the MIT, BSD, and GPL Licenses.
		
		This program is free software: you can redistribute it and/or modify
		it under the terms of the GNU General Public License as published by
		the Free Software Foundation, either version 3 of the License, or
		(at your option) any later version.

		This program is distributed in the hope that it will be useful,
		but WITHOUT ANY WARRANTY; without even the implied warranty of
		MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
		GNU General Public License for more details.

		You should have received a copy of the GNU General Public License
		along with this program.  If not, see <http://www.gnu.org/licenses/>.

*/

// ==UserScript==
// @name 	   HaiDianJiaXiao Auto Retrive
// @namespace	http://www.tangfengyuan.com
// @description	A javascript snippet to help you book car online.
// @include		*://haijia.bjxueche.net*

// ==/UserScript==


function withjQuery(callback, safe) {
	if (typeof (jQuery) == "undefined") {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = "https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js";

		if (safe) {
			var cb = document.createElement("script");
			cb.type = "text/javascript";
			cb.textContent = "jQuery.noConflict();(" + callback.toString() + ")(jQuery, window);";
			script.addEventListener('load', function() {
				document.head.appendChild(cb);
			});
		} else {
			var dollar = undefined;
			if (typeof ($) != "undefined") dollar = $;
			script.addEventListener('load', function() {
				jQuery.noConflict();
				$ = dollar;
				callback(jQuery, window);
			});
		}
		document.head.appendChild(script);
	} else {
		setTimeout(function() {
			// Firefox supports
			callback(jQuery, typeof unsafeWindow === "undefined" ? window : unsafeWindow);
		}, 30);
	}
}
withjQuery(
		function($, window) {
			// Html桌面提醒接口
			$(document).click(function() {
				if (window.webkitNotifications && window.webkitNotifications.checkPermission() != 0) {
					window.webkitNotifications.requestPermission();
				}
			});
//通知窗口
function notify(str, timeout, skipAlert) {
		if( window.webkitNotifications && window.webkitNotifications.checkPermission() == 0 ) {
			var notification = webkitNotifications.createNotification(
				"http://www.bjhdjx.com/favicon.ico",  // icon url - can be relative
				'约车',  // notification title
				str
			);
			notification.show();
			if ( timeout ) {
				setTimeout(function() {
					notification.cancel();
				}, timeout);
			}
			return true;
		} else {
			if( !skipAlert ) {
				alert( str );
			}
			return false;
		}
	}
	var audio = null;
	var onticketAvailable = function() {
			if(window.Audio) {
				if(!audio) {
					audio = new Audio("http://www.w3school.com.cn/i/song.ogg");
					audio.loop = true;
				}
				audio.play();
				notify("可以约车了！", null, true);
			} else {
				notify("可以约车了！");
			}
		}
			var trainType = $("#hideTrainType").val();
			var url = "/Training/ForReservationTimeSectionList";
			var queryurl = "http://haijia.bjxueche.net/Training/ListForReservationKm2";
			function submitForm() {
				var submitUrl = url;
				$.ajax({		
					url : submitUrl,
					data : {
						trainType : trainType
					},
					timeout : 50000,
					cache : false,
					// async: false,
					success : function(data) {
						var icnt=0;
						if (typeof (data.data) == undefined || typeof (data.data["DateList"]) == undefined) return;
						var colCnt = data.data["DateList"].length;

						for ( var i = 0; i < data.data["DateDtMode"].length; i++) {
							mode = data.data["DateDtMode"][i].Mode;
							
							if (mode == 2) {
								icnt++;
								onticketAvailable(); 
							}
							
						}
						if (icnt<1){
								reLogin();
						}						
					},

					error : function(data) {
						reLogin();
					},
				
				});
			}

			var count = 1;
			function reLogin() {
				count++;
				$('#refreshButton').html("(" + count + ")次刷新中...");
				setTimeout(submitForm, 5000);
			}

			if ($("#refreshButton").size() < 1) {
				$("#tabs-Member-button")
						.after(
								$(
										"<a href='#' style='padding: 5px 10px; background: #2CC03E;border-color: #259A33;border-right-color: #2CC03E;border-bottom-color:#2CC03E;color: white;border-radius: 5px;text-shadow: -1px -1px 0 rgba(0, 0, 0, 0.2);'/>")
										.attr("id", "refreshButton").html("自动登录").click(function() {
											alert('开始刷新，请点确定后耐心等待有车通知！');
											count = 1;
											$(this).html("(1)次刷新中...");
											submitForm();
											return false;
										}));
			}
		}, true);