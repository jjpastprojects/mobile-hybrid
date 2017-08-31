window.App = {
	devMode : true,
	isLoggedIn : true,
	username : "",
	defaultLongitude : -104.857427145,
	defaultLatitude : 38.87749115,
	currentPosition : null,
	map : null,
	markers : [],
	devices : null,
	labels : null,
	events : null,
	startIndex : 0,
	limitIndex : 20,
	selectCallback : null,
	defaultReaderType : "ean_reader",
	barCodeTypes : ["upc_reader", "code_128_reader", "code_39_reader", "code_39_vin_reader", "ean_8_reader", "ean_reader", "upc_e_reader", "codabar_reader"],
	lastSearchProperties : null,
	jCropAPI : null,
	resultExclusions : ["_sourceip", "_timestamp", "key"],
	init : function() {
		//quickMessage("Testing message");
		if (isIOS()) {
			$("body").addClass("ios_device");
		}
		$("#settings_button").html(window.Labels.settingsButtonLabel);
		$("#logout_button").html(window.Labels.logoutButtonLabel);
		$("#home_button").html(window.Labels.homeButtonLabel);
		$("#back_button").html(window.Labels.backButtonLabel);
		$("#copywrite").html(window.Labels.footerText);
		$("#logout_button").click(window.App.logoutOfApp);
		$("#home_button").click(window.App.goHome);
		$("#settings_button").click(function() {
			window.App.changeView("settings", {});
		});
		$(window).resize(window.App.resizeApp);

		window.App.checkLogin(function(isLoggedIn) {
			$('#home').fadeOut(function() {
				var oldViewData = window.localStorage.getItem("las-view");
				var lastView = "splash";
				var lastData = {};
				if (oldViewData != null) {
					oldViewData = $.parseJSON(oldViewData);
					lastView = oldViewData.view;
					lastData = oldViewData.data;

					if (lastView == "results") {
						lastView = "details";
						lastData = {};
					}
				}
				if (isLoggedIn) {
					window.App.onLogin();
				}
				//	lastView = "splash";
				//	isLoggedIn = true;
				window.App.changeView( isLoggedIn ? lastView : "login", lastData);
			});
		});

		setOnlineStatus = function() {
			//console.log(window.navigator.onLine);
			if (window.navigator.onLine) {
				status = "<span style='color:#BAD964;'>" + window.Labels.onlineLabel + "</span>";
			} else {
				status = "<span style='color:#E66859;'>" + window.Labels.offlineLabel + "</span>";
			}
			$(".online_indacator").html(status);
		};

		setInterval(setOnlineStatus, 1000);

		setOnlineStatus();

		window.App.processMarkerSubmitQue();

		document.title = "RFInspireD";

		if (window.App.devMode) {
			window.onerror = function(msg, url, linenumber) {
				alert('Error message: ' + msg + '\nURL: ' + url + '\nLine Number: ' + linenumber);
				return true;
			};
		}

	},
	onLogin : function() {
		navigator.geolocation.watchPosition(function(position) {
			window.App.currentPosition = position;
		}, function() {
			alert(window.Labels.locationError);
		}, {
			timeout : 30000,
			enableHighAccuracy : true
		});
	},
	getCurrentPosition : function(callback) {
		var position = window.App.currentPosition;
		if (position == null) {
			alert(window.Labels.locationError);
		} else {
			callback(position);
		}
	},
	goHome : function() {
		window.App.changeView("splash", {});
	},
	showMap : function(markers) {
		if (window.navigator.onLine) {
			$("#map_container_outter").css({
				"height" : $(window).height(),
				"width" : $(window).width()
			}).slideDown(function() {
				function processMap() {
					$.each(window.App.markers, function(i) {
						this.setMap(null);
					});
					window.App.markers = [];
					var searchArray = $.parseJSON(window.localStorage.getItem("searchArray"));
					$.each(markers, function() {
						var marker = this;
						var index = markers.indexOf(marker);

						var field = searchArray[0]['searchData']['field'];
						var value = searchArray[0]['searchData']['value'];
						var content = "FIELD: " + field + "<br/>VALUE: " + value;
						if (marker.latitude && marker.longitude) {
							window.App.markers.push(window.App.buildMarker(marker.latitude, marker.longitude, content, window.App.map, window.Labels.itemPointer));
						}
					});
				}

				if (window.App.map == null) {

					window.App.buildMap(parseFloat(markers[0].latitude), parseFloat(markers[0].longitude));

					$("#map_close_button").html(window.Labels.mapCloseButtonLabel).click(function() {
						$("#map_container_outter").slideUp();
					});

					var currentMarker = null;
					window.App.getCurrentPosition(function(position) {
						if (currentMarker != null)
							currentMarker.setMap(null);
						if (window.App.map != null) {
							currentMarker = window.App.buildMarker(position.coords.latitude, position.coords.longitude, "My current Location", window.App.map, window.Labels.userPointer);
						}
					});

					processMap();
				} else {
					processMap();
				}
			});

		} else {
			alert(window.Labels.internetConnectionError);
		}

	},
	logoutOfApp : function() {
		confirm(window.Labels.logoutConfirmation, function() {
			window.localStorage.setItem("username", "-1");
			window.localStorage.setItem("password", "-1");
			window.App.isLoggedIn = false;
			window.App.devices = null;
			window.App.map = null;
			window.App.markers = [];
			window.App.devices = null;
			window.App.labels = null;
			window.App.events = null;
			window.App.startIndex = 0;
			window.App.limitIndex = 20;
			window.App.changeView("login", {
				message : "You have been successfully logged out."
			});
		});
	},
	isEmptyField : function(field) {
		return field == null || field == "-1" || field == "";
	},
	checkLogin : function(callback) {
		var username = window.localStorage.getItem("username");
		var password = window.localStorage.getItem("password");

		if (window.App.isEmptyField(username) || window.App.isEmptyField(password)) {
			notLoggedIn(callback);
		} else {
			callback(true);
		}
	},
	changeView : function(view, data, callback) {
		$('body').addClass("app_loaded");
		$("#map_close_button").trigger("click");
		HTML5_Camera.stop();
		$.get(view + "_view.html", function(html) {
			function buildPage() {
				$(".page-content-container").html(html);
				window.App[view + "Behavior"](data);
				window.App.resizeApp();
				$('body').attr('data-view-id', view);
				if (data.message) {
					quickMessage(data.message, "logo");
				}

				if (callback) {
					callback(data);
				}

				$("form").attr("onsubmit", "return false;").attr("autocomplete", "off");

				var savedData = {
					view : view,
					data : data
				};

				if (data.message) {
					data.message = null;
				}
				window.localStorage.setItem("las-view", JSON.stringify(savedData));
			}

			var oldViewData = window.localStorage.getItem("las-view");

			if (oldViewData != null) {
				oldViewData = $.parseJSON(oldViewData);
			} else {
				oldViewData = {
					view : ""
				};
			}

			if (view == oldViewData.view) {
				buildPage();
			} else {
				$(".page-content-container").animate({
					"left" : "-" + $(window).width() + "px",
					"opacity" : 0
				}, 300, "swing", function() {
					$(".page-content-container").css("left", $(window).width());
					$(".page-content-container").animate({
						"left" : "0px",
						"opacity" : 100
					}, 500, "easeOutQuad", function() {

					});
				});
				setTimeout(buildPage, 250);
			};

		});

	},
	buildSelectOptions : function($select, data) {
		$select.html("").append("<option value='-1'>Please Choose</option>");
		$.each(data, function() {
			var label = this.label;
			var value = this.value;
			var isGoodKey = true;
			$.each(window.App.resultExclusions, function() {
				if (this == label) {
					isGoodKey = false;

				}
			});

			if (isGoodKey) {
				$select.append("<option value='" + value + "'>" + label + "</option>");
			}
		});
		$select.removeAttr('disabled');

		if (window.App.selectCallback != null) {
			window.App.selectCallback();
		}
	},
	loadSelectOptions : function($select) {
		var dataType = $select.attr('data-type');
		var deviceId = $('#searchable_devices').val();
		var labelId = $('#searchable_labels').val();
		$select.html('<option value="-1">loading...</option>').attr('disabled', 'disabled');

		switch(dataType) {
		case "labels":
			function buildLabels() {
				var list = [];
				$.each(window.App.labels, function() {
					list.push({
						value : this.labelId,
						label : this.text
					});
				});
				window.App.buildSelectOptions($select, list);
			}

			if (window.App.labels != null) {
				buildLabels();
			} else {
				$.ajaxOAUTH2Proxy({
					url : "labels",
					callback : function(data) {
						window.App.labels = data;
						buildLabels();
					}
				});
			}
			break;
		case "fields":
			var selectUrl;
			if ($('.search_choice_box.pressed').hasClass("device")) {
				selectUrl = "/devices/" + deviceId + "/fields";
			} else {
				selectUrl = "devices/search/" + labelId + "/fields";
			}
			$.ajaxOAUTH2Proxy({
				url : selectUrl,
				callback : function(data) {
					var list = [];
					$.each(data, function() {
						list.push({
							value : this.fieldId,
							label : this.name
						});
					});
					window.App.buildSelectOptions($select, list);
				}
			});
			break;
		case "devices":
			function buildDevices() {
				var list = [];
				$.each(window.App.devices, function() {
					list.push({
						value : this.sensorId,
						label : this.name
					});
				});
				window.App.buildSelectOptions($select, list);
			}

			if (window.App.devices != null) {
				buildDevices();
			} else {
				$.ajaxOAUTH2Proxy({
					url : "devices",
					callback : function(data) {
						window.App.devices = data.content;
						buildDevices();
					}
				});
			}

			break;
		}
	},
	detailsBehavior : function() {
		var searchReady = false;
		$("#header").show();
		$("#search_details .select_box").hide();

		$('.search_choice_box').click(function() {
			var isDevice = $(this).hasClass('device');

			$("#search_details .select_box, #search_btn").hide();
			$('.search_choice_box.pressed').removeClass('pressed');
			window.App.loadSelectOptions( isDevice ? $('#searchable_devices') : $('#searchable_labels'));
			$('#search_details ' + ( isDevice ? '.searchable_devices' : '.searchable_labels')).show();
			$('#search_details ' + ( isDevice ? '.searchable_labels' : '.searchable_devices')).hide();
			$(this).addClass('pressed');
		});

		$("#searchable_devices, #searchable_labels").change(function() {
			if ($(this).val() != "-1") {
				window.App.loadSelectOptions($('#searchable_fields'));
				$("#search_details .select_box, #search_btn").hide();
				$("#searchable_fields").parent().show();
				//$("#searchable_fields")[0].focus();
			} else {
				$("#search_details .select_box").hide();
			}
			$(this).parent().show();
			$("#search_button_container").hide();
			window.App.resizeApp();
		});

		$("#searchable_fields").change(function() {
			if ($(this).val() != "-1") {
				$("#searchable_value").parent().show().val("");
				$("#searchable_value")[0].focus();
			} else {
				$("#searchable_value").parent().hide();
				$("#search_button_container").hide();
			}
			window.App.resizeApp();
		});

		$("#searchable_value").on("keyup change blur", function() {
			$("#search_button_container")[$(this).val() ? 'show' : 'hide']();
			searchReady = $(this).val() ? true : false;
			window.App.resizeApp();
		});

		$("#reset_search_button").html(window.Labels.resetSearchButtonLabel).click(function() {
			window.App.changeView("details", {});
		});

		$("#search_button").html(window.Labels.searchButtonLabel).click(function() {
			if (window.navigator.onLine) {
				var obj = $("#search_form").serializeObject();
				window.App.lastSearchProperties = obj;
				window.App.changeView("results", obj);
			} else {
				alert(window.Labels.internetConnectionError);
			}
		});

		$("#search_details").keypress(function(e) {
			if (e.which == 13 && searchReady) {
				$("#search_button").trigger("click");
			}
		});

		$("#searchable_devices_instr").html(window.Labels.devicesSelectInstr);
		$("#searchable_labels_instr").html(window.Labels.labelsSelectInstr);
		$("#searchable_fields_instr").html(window.Labels.fieldSelectInstr);
		$("#searchable_value_instr").html(window.Labels.valueSelectInstr);
		$("#searchable_choice_instr").html(window.Labels.choiceSelectInstr);
		$(".search_choice_box.device").html(window.Labels.deviceButtonLabel);
		$(".search_choice_box.label").html(window.Labels.labelButtonLabel);

		window.App.renderPastSearches();
	},
	loginBehavior : function(data) {
		$("#login_text").html(window.Labels.loginText);
		$('#login_button').click(function() {
			window.localStorage.setItem("username", $("#username").val());
			window.localStorage.setItem("password", $("#password").val());

			$.getOAUTH2Token(function() {
				window.App.isLoggedIn = true;
				window.App.onLogin();
				window.App.changeView("splash", {});
			}, function() {
				window.App.changeView("login", {
					message : window.Labels.loginError
				});
				/*
				 window.App.isLoggedIn = true;
				 window.App.onLogin();
				 window.App.changeView("splash", {});*/

			});
		});

		$("#reset_login_button").click(function() {
			$("#username, #password").val("");
			$("#username")[0].focus();
		});
		$("#header").hide();
		$("#login_button").html(window.Labels.loginButtonLabel);
		$("#reset_login_button").html(window.Labels.resetLoginButtonLabel);
		$("#username").attr("placeholder", window.Labels.loginUsernamePlaceholder);
		$("#password").attr("placeholder", window.Labels.passwordUsernamePlaceholder);

		if (window.App.devMode) {
			$("#username").val("rfinspired@yahoo.com");
			$("#password").val("Testdata1");
		}
	},
	buildMarker : function(lat, lan, label, map, image) {
		if (map != null) {
			var marker = new google.maps.Marker({
				position : new google.maps.LatLng(lat, lan),
				map : map
			});

			marker.addListener('click', function() {
				var infowindow = new google.maps.InfoWindow({
					content : label
				});
				infowindow.open(map, marker);
			});
			return marker;
		}
	},
	buildMap : function(lat, lan) {
		$("#map_container").css({
			"width" : $("#map_container_outter").width(),
			"height" : $("#map_container_outter").height() - 150
		});

		var mapOptions = {
			zoom : 15,
			center : new google.maps.LatLng(lat, lan)
		};

		window.App.map = new google.maps.Map(document.getElementById("map_container"), mapOptions);
	},
	resizeApp : function() {
		var contentHeight = $(".page-content-container").height();
		$("body").css("height", contentHeight > $(window).height() ? contentHeight + 50 : $(window).height());
		$('#map_container').css("width", $(window).width());
		$('#map_container').css("height", $(window).height() - 75);
	},
	renderPastSearches : function() {
		var searchArray = window.localStorage.getItem("searchArray");
		if (searchArray == null) {
			searchArray = [];
		} else {
			searchArray = $.parseJSON(searchArray);
		}
		if (searchArray.length > 0) {
			var html = "<div>";
			var username = window.localStorage.getItem("username");
			$.each(searchArray, function(index, item) {
				if (item.username == username) {
					html += "<div class='search_result'>";
					html += "<div class='search_information'>";
					html += "<table>";
					html += "<tr><td style='width:80px;'>SEARCH DATE: </td><td>" + this.searchDate + "</div>";
					var rowIndex = 0;
					for (var key in this.searchData) {
						html += "<tr ><td>" + key.toUpperCase() + ": </td><td>" + this.searchData[key] + "</td></div>";
					}
					html += "</table></div><div class='button_row'>";
					html += "<a href='javascript:void(0);' class='button search' data-index='" + index + "' title='CLICK TO RE EXACUTE THIS SEARCH' >RE SEARCH</a>";
					html += "&nbsp;&nbsp;<a href='javascript:void(0);' class='button remove' data-index='" + index + "' title='CLICK TO REMOVE THIS SEARCH' >REMOVE</a>";
					html += "</div>";
					html += "</div>";
				}
			});
			html += "</div>";
			$("#past_searches_title").html($("#past_searches_title").text() + " (" + searchArray.length + ")");
			$("#past_searches").html(html);

			$('.search_result a.search').click(function() {
				var submitedFormData = searchArray[$(this).attr("data-index")];
				window.App.devices = submitedFormData.devices;
				window.App.labels = submitedFormData.labels;
				submitedFormData.searchData.device = submitedFormData.searchData.deviceId;
				submitedFormData.searchData.label = submitedFormData.searchData.labelId;
				submitedFormData.searchData.url = submitedFormData.searchUrl;
				submitedFormData.searchData.saveSearch = false;

				//  console.log(submitedFormData.searchData);

				window.App.changeView("details", {}, function(resp) {
					if (submitedFormData.searchData.device) {
						$('.device').trigger("click");
						$("#searchable_devices").val(submitedFormData.searchData.device).trigger("change");
					} else {
						$('.label').trigger("click");
						$("#searchable_labels").val(submitedFormData.searchData.label).trigger("change");
					}

					function afterSelectLoad() {
						$('#searchable_fields').val(submitedFormData.searchData.field);
						$('#searchable_fields').trigger("change");

						$("#searchable_value").val(submitedFormData.searchData.value).trigger("change")[0].select();

						window.App.selectCallback = null;
					}


					window.App.selectCallback = afterSelectLoad;
				});
			});

			$('.search_result a.remove').click(function() {
				var $this = $(this);
				$(this).closest(".search_result").fadeOut(function() {
					var elIndex = $this.attr("data-index");
					var newArray = [];
					$.each(searchArray, function(index, item) {
						if (index != elIndex) {
							newArray.push(item);
						}
					});
					window.localStorage.setItem("searchArray", JSON.stringify(newArray));
					window.App.renderPastSearches();
				});
			});

			$("#past_searches_title").click(function() {
				$("#past_searches").slideToggle();
			});
		} else {
			$("#past_searches_title").hide();
		}
	},
	saveSearch : function(seaachData, searchUrl) {
		var devices = window.App.devices;
		var labels = window.App.labels;
		var previousSearches = window.localStorage.getItem("searchArray");

		if (previousSearches == null) {
			previousSearches = [];
		} else {
			previousSearches = $.parseJSON(previousSearches);
		}

		previousSearches.push({
			searchData : seaachData,
			searchUrl : searchUrl,
			searchDate : new Date(),
			devices : devices,
			labels : labels,
			username : window.localStorage.getItem("username")
		});

		window.localStorage.setItem("searchArray", JSON.stringify(previousSearches));
	},
	switchPageOfResults : function(direction) {
		var events = [];
		switch(direction) {
		case 'next':
			window.App.startIndex = (window.App.startIndex + window.App.limitIndex);
			break;
		case 'prev':
			window.App.startIndex = window.App.startIndex - window.App.limitIndex;
			break;
		case 'start':
			window.App.startIndex = 0;
			break;
		}

		if (window.App.events.length < window.App.limitIndex) {
			$('#next_button, #previous_button').hide();
		} else {
			//	console.log(window.App.startIndex >= window.App.limitIndex);

			if (window.App.startIndex >= window.App.events.length) {
				$('#next_button').hide();
			} else {
				$('#next_button').show();
			}

			if (window.App.startIndex <= 0) {
				$('#previous_button').hide();
			} else {
				$('#previous_button').show();
			}
		}

		var eventsSize = window.App.events.length;
		var limit = window.App.startIndex + window.App.limitIndex > eventsSize ? eventsSize : window.App.startIndex + window.App.limitIndex;
		if (eventsSize == 0) {
			$('.number_results_found').html("No results found");

		} else {
			$('.number_results_found').html((window.App.startIndex + 1) + " - " + limit + " of " + window.App.events.length);
		}

		//	alert(limit);
		for (var i = window.App.startIndex; i < (limit); i++) {

			events.push(window.App.events[i]);
		}
		$('#search_results .results_container').html("");
		var tableHTML = "<table style='width:100%;' ><thead>";
		tableHTML += "<tr>";
		tableHTML += "<th></th>";

		var keys = [];

		for (var key in events[0]) {
			var isGoodKey = true;
			$.each(window.App.resultExclusions, function() {
				if (this == key) {
					isGoodKey = false;

				}
			});
			if (isGoodKey) {
				tableHTML += "<th>" + key.toUpperCase() + "</th>";
				keys.push(key);
			}

		}
		tableHTML += "</tr></thead><tbody>";
		$.each(events, function(rowIndex, event) {
			
			var latitude = event.Lat;
			var longitude = event.Lon;
			
			console.log(latitude);
			console.log(longitude);
			
			var label = event.marker;
			var uid = event.UID;
			var key = event.key;
			tableHTML += "<tr class='data-row " + (rowIndex % 2 == 0 ? '' : 'odd') + " " + ((rowIndex == 0) ? "" : "plain") + " '  data-label='" + label + "' data-key='" + key + "' data-uid='" + uid + "' data-latitude='" + latitude + "' data-longitude='" + longitude + "' >";
			tableHTML += "<td><input type='checkbox' " + ((rowIndex == 0) ? "checked='checked'" : "") + "  /></td>";

			$.each(keys, function(keyIndex, key) {
				//	console.log(key);
				var isGoodKey = true;
				$.each(window.App.resultExclusions, function() {
					if (this == key) {
						isGoodKey = false;
					}
				});
				if (isGoodKey) {
					tableHTML += "<td>" + event[key] + "</td>";
				}
			});
			"</tr>";
		});

		tableHTML += "</tbody></table>";
		$('#search_results .results_container').html(tableHTML);

		$('#search_results .data-row input').click(function(e) {
			$(this).closest('tr')[!$(this).is(":checked") ? "addClass" : "removeClass"]("plain");
		});

		$('#search_results .data-row').click(function(e) {
			if ($(e.target)[0].nodeName.toLowerCase() != "input") {
				$(this).find("input").trigger("click");
			}
		});
	},
	search : function(seaachData, searchUrl, saveSearch) {
		$('#next_button, #previous_button').hide();
		window.App.events = [];
		$.ajaxOAUTH2Proxy({
			url : searchUrl,
			data : seaachData,
			failure : searchError,
			callback : function(data) {
				console.log(data);
				window.App.events = data;
				var goodSearch = false;
				if (saveSearch) {
					window.App.saveSearch(seaachData, searchUrl);
				}
				if (Array.isArray(data)) {
					if (data.length > 0 && data[0].events) {
						window.App.events = data[0].events;
						goodSearch = true;
					}
				} else if (data.events) {
					window.App.events = data.events;
					goodSearch = true;
				} else {
					searchError();
				}

				if (goodSearch) {
					var numberReslts = window.App.events.length;
					$('#map_it_button')[(numberReslts == 0) ? 'hide' : 'show']();
					window.App.switchPageOfResults('start');
				}
			}
		});
	},
	getMarkerSubmitQue : function() {
		var que = window.localStorage.getItem("marker-que");
		if (que == null) {
			que = [];
		} else {
			que = $.parseJSON(que);
		}
		return que;
	},
	getAppSettings : function() {
		var settings = window.localStorage.getItem("app-settings");
		if (settings == null) {
			settings = {};
		} else {
			settings = $.parseJSON(settings);
		}
		return settings;
	},
	processMarker : function(itemData, key, callback, errorBack) {
		var submitData = {
			"Date Time" : itemData.date,
			"Uid" : itemData.uid,
			"Marker" : itemData.marker,
			"Lat" : itemData.lat,
			"Lon" : itemData.lng,
			"ALT" : itemData.alt,
			"Barcode_Vin" : itemData.barcode_vin,
			"Plate" : itemData.plate,
			"Values" : itemData.values
		};
		$.ajaxProxy({
			url : "http://api.rfinspired.com/update?key=" + key.toUpperCase(),
			data : submitData,
			type : "POST",
			callback : callback,
			errorBack : errorBack
		}, false, true);
	},
	processMarkerSubmitQue : function() {
		setInterval(function() {
			if (window.navigator.onLine && window.App.isLoggedIn) {
				var que = window.App.getMarkerSubmitQue();
				var settings = window.App.getAppSettings();
				var key = settings["unique-key"];
				$.each(que, function(i, itemData) {
					window.App.processMarker(itemData, key, window.App.emptyFun, window.App.emptyFun);
				});
				window.localStorage.setItem("marker-que", JSON.stringify([]));
				window.App.renderQue();
			}
		}, 10000);
	},
	emptyFun : function() {

	},
	addToMarkerSubmitQue : function(data, callback, errorBack) {
		if (window.navigator.onLine) {
			var settings = window.App.getAppSettings();
			var key = settings["unique-key"];
			window.App.processMarker(data, key, callback, errorBack);
		} else {
			var que = window.App.getMarkerSubmitQue();
			que.push(data);
			window.localStorage.setItem("marker-que", JSON.stringify(que));
			//console.log(window.localStorage.getItem("marker-que"));
			window.App.renderQue();
			callback();
		}
	},
	renderQue : function() {
		var que = window.App.getMarkerSubmitQue();
		$(".marker-que-list").html("");
		if (que.length > 0) {
			var html = "<div>" + window.Labels.queTitle + "</div><br/><table>";
			html += "<tbody>";
			$.each(que, function(i, data) {
				html += "<tr><td>" + data.date + "</td><td>" + data.marker + "</td><td>" + data.values + "</td><td>" + data.scan + "</td></tr>";
			});
			html += "</tbody></table>";
			$(".marker-que-list").html(html);
		}
	},
	markerBehavior : function() {
		var structure = 1;
		var level = 1;
		var values = "";
		var direction = null;

		$("#header").show();
		$(".marker_header").html(window.Labels.markerHeader);
		$(".other_options_header").html(window.Labels.otherOptionsHeader);
		$("#structures_instr").html(window.Labels.structuresInst);
		$("#structures_instr").html(window.Labels.structuresInst);
		$("#levels_instr").html(window.Labels.levelsInst);
		$(".save-marker-button").html(window.Labels.saveMarkerButtonLabel);
		$(".reset-marker-button").html(window.Labels.resetMarkerButtonLabel);
		$(".data-marker-name input").attr("placeholder", window.Labels.dataMarkerTextPalceholder);
		$(".data-marker-location input").attr("placeholder", window.Labels.dataMarkerLocationTextPalceholder);

		function renderValues() {
			var response = "S" + structure + "; L" + level;
			if (direction != null) {
				response = response + "; " + direction;
			}
			values = response;
			$("#marker .data-marker-location input").val(response);
		}

		function submit() {
			var settings = window.App.getAppSettings();
			if ($(".image_preview").val() != "" || $(".data-marker-name input").val() != "" || $(".data-marker-plate input").val() != "") {
				if (settings["unique-key"] && settings["unique-key"] != "") {
					window.App.getCurrentPosition(function(position) {
						//console.log(position);
						var alt = position.coords.altitude;
						var lat = position.coords.latitude;
						var lng = position.coords.longitude;
						var settings = window.localStorage.getItem("app-settings");
						var postValues = "NULL";

						if (settings != null) {
							settings = $.parseJSON(settings);
							//console.log(settings);
							if (settings["show-extended-ui"] && settings["show-extended-ui"] == "1") {
								postValues = values;
							}
						}

						window.App.addToMarkerSubmitQue({
							structure : structure,
							level : level,
							values : postValues,
							ukey : settings["unique-key"],
							uid : settings["unique-id"],
							alt : alt,
							marker : returnNullString($(".data-marker-name input").val()),
							lat : lat,
							lng : lng,
							plate : returnNullString($(".data-marker-plate input").val()).toUpperCase(),
							barcode_vin : returnNullString($(".image_preview").val()).toUpperCase(),
							date : new Date()
						}, function() {
							var type = "success";
							var message = window.Labels.onlineMarkerSaveMessage;
							if (!window.navigator.onLine) {
								message = window.Labels.offlineMarkerSaveMessage;
								type = "warning";
							} else {
								window.App.changeView("marker", {});
							}
							quickMessage(message, type);
						}, function() {

							quickMessage("There was an unexpected error with this request. Please check your internet connection before continuing.");

						});
					});

				} else {
					alert(window.Labels.uniqueKeyError);
				}
			} else {
				alert(window.Labels.scanRequiredError);
			}
		}


		$("#marker .reset-marker-button").click(function() {
			window.App.changeView("marker", {});
		});

		function afterScan(scanText, captureType) {
			//alert(captureType);
			switch(captureType) {
			case  "plate":
				$(".data-marker-plate input").val( scanText ? scanText : "");
				break;
			default:
				$(".image_preview").val( scanText ? scanText : "");
				break;
			}

			$("body").animate({
				scrollTop : 350
			});
		}


		$.scanner(afterScan);

		$("#marker select").on("click change blur focus", function() {
			//	console.log("click");
			switch($(this).attr("data-type")) {
			case "structure":
				structure = $(this).val();
				break;
			case "level":
				level = $(this).val();
				break;
			}
			renderValues();
		});

		$("#marker .direction-pad td").click(function() {
			direction = $(this).text();
			renderValues();
		});

		$("#marker .save-marker-button").click(submit);

		var settings = window.localStorage.getItem("app-settings");
		if (settings != null) {
			settings = $.parseJSON(settings);
			//console.log(settings);
			if (settings["show-extended-ui"]) {
				$(".data-marker-location, .internal-buttons, .options-area, .direction-pad table")[settings["show-extended-ui"] == "1" ? "show" : "hide"]();
				$(".external-buttons")[settings["show-extended-ui"] != "1" ? "show" : "hide"]();
				$(".data-marker-location").parent()[settings["show-extended-ui"] == "1" ? "show" : "hide"]();
				$(".other_options_header")[settings["show-extended-ui"] == "1" ? "show" : "hide"]();
				$(".data-marker-name").parent().css("width", settings["show-extended-ui"] == "1" ? "50%" : "100%");
			}
		}
		renderValues();
	},
	splashBehavior : function() {
		$("#header").show();
		$(".finder_choice_button").html("FIND").click(function() {
			window.App.changeView('details', {});
		});

		$(".marker_choice_button").html("MARK").click(function() {
			window.App.changeView('marker', {});
		});

		$(".action_options_inst").html(window.Labels.splashHeader);
	},
	resultsBehavior : function(submitedFormData) {
		$("#search_results .results_container").html("");
		var labelName,
		    deviceName;

		if (submitedFormData.device != '-1' && submitedFormData.device != null) {
			deviceName = submitedFormData.device;
			$.each(window.App.devices, function() {
				if (this.sensorId == submitedFormData.device) {
					deviceName = this.name;
				}
			});
			$('.result_device').html(deviceName);
			$('.result_device').parent().parent().show();
		} else {
			$('.result_device').parent().parent().hide();
		}

		if (submitedFormData.label != '-1' && submitedFormData.label != null) {
			labelName = submitedFormData.label;
			$.each(window.App.labels, function() {
				if (this.labelId == submitedFormData.label) {
					labelName = this.text;
				}
			});
			$('.result_label').html(labelName);
			$('.result_label').parent().parent().show();
		} else {
			$('.result_label').parent().parent().hide();
		}

		$('.result_field').html(submitedFormData.field);
		$('.result_value').html(submitedFormData.value);
		$("#search_results h2").html(window.Labels.resultsHeader);
		$(".results_device_header").html(window.Labels.resultsDeviceHeader);
		$(".results_label_header").html(window.Labels.resultsLabelHeader);
		$(".results_field_header").html(window.Labels.resultsFieldHeader);
		$(".results_value_header").html(window.Labels.resultsValueHeader);
		$("#previous_button").html(window.Labels.prevoiusButtonLabel);
		$("#next_button").html(window.Labels.nextButtonLabel);
		//$("#first_button").html(window.Labels.firstButtonLabel);
		//$("#last_button").html(window.Labels.lastButtonLabel);

		var searchUrl,
		    seaachData;
		if (submitedFormData.label == null || submitedFormData.label == '-1') {
			searchUrl = "events/" + submitedFormData.device + "/search/byFieldValue";
			seaachData = {
				field : submitedFormData.field,
				value : submitedFormData.value,
				deviceId : submitedFormData.device
			};
		} else {
			searchUrl = "/events/search/byLabelNameAndFieldValue";
			seaachData = {
				label : labelName,
				field : submitedFormData.field,
				value : submitedFormData.value
			};
		}

		var saveSearch = true;
		if ( typeof submitedFormData.saveSearch != "undefined") {
			saveSearch = submitedFormData.saveSearch;
		}
		window.App.search(seaachData, searchUrl, saveSearch);

		$('#map_it_button').hide().click(function() {
			var markers = [];
			$('#search_results .data-row').each(function() {
				if ($(this).find("input").is(":checked")) {
					markers.push({
						label : $(this).attr('data-uid'),
						latitude : $(this).attr('data-latitude'),
						longitude : $(this).attr('data-longitude')
					});
				}
			});
			window.App.showMap(markers);
		});
		$("#map_it_button").html(window.Labels.mapItButtonLabel);
		$("#back_to_search_button").html(window.Labels.backToSearchButtonLabel).click(function() {
			window.App.changeView('details', {});
		});

		$("#previous_button").click(function() {
			window.App.switchPageOfResults('prev');
		});
		$("#next_button").click(function() {
			window.App.switchPageOfResults('next');
		});
	},
	settingsBehavior : function() {
		$("#header").show();
		$(".unique-key-label").html(window.Labels.uniqueKeyLabel);
		$(".show_extended_label").html(window.Labels.showExtendedUILabel);
		$(".settings-save-button").html(window.Labels.settingsSaveButtonLabel);

		$.each(window.App.barCodeTypes, function(i, type) {
			$(".barcode_types_container").append('<div style="margin-bottom:5px; width:48%; font-size:12px; display:inline-block;"><input type="checkbox" class="barcode_type_checkbox" value="' + type + '" id="' + type + '_checkbox" />' + '<label for="' + type + '_checkbox">' + replaceAll("_", " ", type).toUpperCase() + '</label></div>');
		});

		$(".settings-save-button").click(function() {
			if ($("[name='unique-key']").val() == "") {
				alert("Unique key is required value.");
			} else {
				var barCodeTypes = [];
				$(".barcode_type_checkbox").each(function() {
					if ($(this).is(":checked")) {
						barCodeTypes.push($(this).val());
					}
				});
				window.localStorage.setItem("app-settings", JSON.stringify({
					"unique-key" : $("#unique-key").val(),
					"show-extended-ui" : $("#show-extended-ui").val(),
					"bar-code-types" : barCodeTypes,
					"unique-id" : $("#unique-id").val()
				}));
				alert(window.Labels.settingsSavedMessage);
			}
		});
		var settings = window.localStorage.getItem("app-settings");
		if (settings != null) {
			settings = $.parseJSON(settings);
			for (var key in settings) {
				if (key == "bar-code-types") {
					$.each(settings[key], function(i, barCodeType) {
						$("#" + barCodeType + "_checkbox").attr("checked", "checked");
					});
				} else {
					$("#" + key).val(settings[key]);
				}

			}
		} else {
			$(".barcode_type_checkbox").attr("checked", "checked");
		}
	},
	getUrlParameter : function(sParam) {
		var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		    sURLVariables = sPageURL.split('&'),
		    sParameterName,
		    i;

		for ( i = 0; i < sURLVariables.length; i++) {
			sParameterName = sURLVariables[i].split('=');

			if (sParameterName[0] === sParam) {
				return sParameterName[1] === undefined ? true : sParameterName[1];
			}
		}
	}
};

