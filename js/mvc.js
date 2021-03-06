//Authors: Ari Kalfus, Burak Sezer, Sam Raphael, Wesley Wei Qian

var model = {
	name: "Jeeves",
	view: "weather",
	newsViews:"news",
	previousView: ["weather"],		// Use an array to keep track of the view change for the "back" button
	city: 'Waltham',
	country: 'us',
	section: 'news',
	articles: [],
	weather: { temp: {}, clouds: -3, description: "" },
	newsArticles: {
		news: [],
		world: [],
		sports: [],
		business: [],
		tech: [],
		science: []
	},
	// Besides the newsArticles, a displayNews is created to display only five of the articles.
	displayNews: {
		news: [],
		world: [],
		sports: [],
		business: [],
		tech: [],
		science: [],
		newsCount: 0,
		worldCount: 0,
		sportsCount: 0,
		businessCount: 0,
		techCount: 0,
		scienceCount:0
	},
	// An object keep track of news reading
	newsPosition: {
		section: 'news',
		articleIndex: 0,
		pause:false,
		pausePosition:0,
		contArticleContent:""
	},
	failedUnderstandCount: 0,
	newsIntroduction:true,
	webTitle: {
		calledTitle:0,
		calledWebTitle:". Available commands are: next article, read section name, read article, previous, more articles or previous five articles."
	},
	readingArticle:false,
	menuModal: {},
	isMenuOpen: false,
	emailList: [],
	emailCount: 0
};

var jeevesApp = angular.module("jeevesApp", ['ui.bootstrap']);

jeevesApp.run(function($http) {

	// Weather Info
	$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+model.city+','+model.country+ '&units=imperial&callback=JSON_CALLBACK&APPID=32472867a57a09c1e174daf4fddb70d5').success(function(data) {
            model.weather.temp.current = data.main.temp;
            model.weather.clouds = data.clouds ? data.clouds.all : undefined;
            model.weather.description = data.weather[0].description;
    });

	// Loading Guardian News Info.
	$http.get('http://beta.content.guardianapis.com/search?section=news&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					if(!data.response.results[i].webTitle.match(/Photo/)&&!data.response.results[i].webTitle.match(/video/)&&!data.response.results[i].webTitle.match(/pictures/)){
						model.newsArticles.news[count]=data.response.results[i];
						count=count+1;
					}
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?section=world&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
				if(!data.response.results[i].webTitle.match(/Photo/)&&!data.response.results[i].webTitle.match(/video/)&&!data.response.results[i].webTitle.match(/pictures/)){
					model.newsArticles.world[count]=data.response.results[i];
					count=count+1;
				}
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?section=sport&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					if(!data.response.results[i].webTitle.match(/Photo/)&&!data.response.results[i].webTitle.match(/video/)&&!data.response.results[i].webTitle.match(/pictures/)){
					model.newsArticles.sports[count]=data.response.results[i];
					count=count+1;
					}
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?section=business&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					if(!data.response.results[i].webTitle.match(/Photo/)&&!data.response.results[i].webTitle.match(/video/)&&!data.response.results[i].webTitle.match(/pictures/)){
						model.newsArticles.business[count]=data.response.results[i];
						count=count+1;
					}
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?section=technology&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
			if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					if(!data.response.results[i].webTitle.match(/Photo/)&&!data.response.results[i].webTitle.match(/video/)&&!data.response.results[i].webTitle.match(/pictures/)){
						model.newsArticles.tech[count]=data.response.results[i];
						count=count+1;
					}
				}
				if(count>100){
					break;
				}
			}
		}
	});
	$http.get('http://beta.content.guardianapis.com/search?section=science&page-size=99&show-fields=body&date-id=date%2Flast24hours&api-key=mfqem2e9vt7hjhww88ce99vr').success(function(data){
		var count=0;
		for(var i=0;i<200;i++){
				if(data.response.results[i]!=undefined){
				if(data.response.results[i].hasOwnProperty('fields')){
					if(!data.response.results[i].webTitle.match(/Photo/)&&!data.response.results[i].webTitle.match(/video/)&&!data.response.results[i].webTitle.match(/pictures/)){
						model.newsArticles.science[count]=data.response.results[i];
						count=count+1;
					}
				}
				if(count>100){
					break;
				}
			}
		}
	});
});

jeevesApp.controller("jeevesCtrl", function($scope, $http, $modal, $timeout) {
	$scope.jeeves = model;

	// For the use of first showing up accordians in "News" and "Help" Section
	$scope.status = {
	    isNewsOpen: true,
	    isWorldOpen:false,
	    isSportsOpen:false,
	    isBusinessOpen:false,
	    isTechOpen:false,
	    isScienceOpen:false,
	    isGlobalHelpOpen:true
	};

	// A function to hide the splash block
	$scope.hideSplashScreen = function(){
		document.getElementById("splashScreen").style.display="none";
	}

	// Load the image of weather
	$scope.imgurl = function() {
                var baseUrl = 'https://ssl.gstatic.com/onebox/weather/128/';
                if ($scope.jeeves.weather.clouds < 20 && $scope.jeeves.weather.clouds > -1) {
                    return baseUrl + 'sunny.png';
                } else if ($scope.jeeves.weather.clouds < 90) {
                   return baseUrl + 'partly_cloudy.png';
                } else {
                    return baseUrl + 'cloudy.png';
                }
    };

    // Change view from different section like News, Weather, etc.
	$scope.changeView = function(selected) {
		if (selected == 'back'){
			if ($scope.jeeves.isMenuOpen) {		// If the menu is open, the back button will just close the menu.
				$scope.closeMenu();
			} else {
				if ($scope.jeeves.previousView.length > 1) {
					$scope.jeeves.previousView.pop();
					var back = $scope.jeeves.previousView[$scope.jeeves.previousView.length - 1];
					$scope.jeeves.view = back;
				} else {						// If the app is on the first page, the app exits.
					navigator.app.exitApp();
				}
			}
		} else if (selected == 'menu') {
			if (!$scope.jeeves.isMenuOpen) {
				$scope.openMenu();	// Open menu modal
			}
		} else {
			if (selected == 'email') {
				navigator.tts.speak("Let's grab your emails.");
				$scope.checkEmail();
			}else if (selected == "news"){
				$scope.cutNews();		// Cut news for display.
			}
			$scope.jeeves.previousView.push(selected);
			$scope.jeeves.view = selected;
			if ($scope.jeeves.isMenuOpen) {
				$scope.closeMenu();
			}
		}
	};

	// Trigger the menu modal
	$scope.openMenu = function() {
		$scope.jeeves.menuModal = $modal.open({
			templateUrl: 'menuContent.html',
			backdrop: 'static'
		})
		$scope.jeeves.isMenuOpen = true;
	}

	// Close the menu modal
	$scope.closeMenu = function() {
		$scope.jeeves.menuModal.close();
		$scope.jeeves.isMenuOpen = false;
	}

	// Change the city of weather information
	$scope.changeWeather = function(setting) {

		var city = "";

		if(typeof setting == "boolean"){	// If the change is made by typing, the setting will be a boolean.
			if (setting){		// If setting is true, read the field at the setting page
				city = document.getElementById("weather_city_setting").value;
			}else{				// Else read teh field at the weather page.
				city = document.getElementById("weather_city").value;
			}
		}else{			// If the change is made by speakng, the setting will be a string and set to the city
			city = setting;
		}

		if(city != ""){		// If city name is not a empty string
			$http.jsonp('http://api.openweathermap.org/data/2.5/weather?q='+city+','+$scope.jeeves.country+ '&units=imperial&callback=JSON_CALLBACK').success(function(data) {
	            if(data.cod == 200){		// If the city exists, it will return cod==200.
	            	navigator.tts.speak("Changing the city to " + city + ".");
	            	$scope.jeeves.city = $scope.capitaliseFirstLetter(city);
			        $scope.jeeves.weather.temp.current = data.main.temp;
			        $scope.jeeves.weather.clouds = data.clouds ? data.clouds.all : undefined;
			    }else{		// If the city name does not exist,
			    	if(typeof setting == "boolean"){
			    		navigator.notification.alert("I am sorry, but "+city + " is not available. Please enter a another city name",function(){},'Invalid City Name','OK');
			    	}else{
			    		navigator.tts.speak("Sorry, I didn't catch the city name. Can you repeat the city name again?", function() {
			    			$scope.reco($scope.weatherSpeechFallBack);
			    		})
			    	}
			    }
	    	});
	    }else{
	    	navigator.notification.alert("Sorry, the city name cannot be empty.",function(){},'Empty City Name','OK');
	    }

	    // Setting the field back to empty string
    	document.getElementById("weather_city").value = "";
    	document.getElementById("weather_city_setting").value = "";
	
	}

	// Change the news section
	$scope.changeSection=function(selected){
		document.getElementById($scope.jeeves.section).innerHTML="";	// Empty the previous section div.
		$scope.jeeves.section = selected;
	}

	// Call the native recognition
	$scope.reco = function(callback){
		// Use the native recognizer and return three best result.
		navigator.speechrecognizer.recognize(lowerSpeech, failCallback, 3, "How can I help?");

		function lowerSpeech(results) {
			// modify the results by lowercase it
			for (var i = 0; i < results.length; i++) {
				results[i] = results[i].toLowerCase();
			}
			callback(results); // Call respective dialogue management function.
		}

 		function failCallback(error){}
	}

	// The dialog manger
	$scope.dialogMan = function(results){
		if ($scope.globalCommands(results)){	// Call global command first
			$scope.jeeves.failedUnderstandCount = 0;	// If the recognizer works, set back the failUnderstandCount
			return;
		} else if ($scope.jeeves.view == "weather" && $scope.weatherSpeech(results)) {
			$scope.jeeves.failedUnderstandCount = 0;
			return;
		} else if ($scope.jeeves.view == "news" && $scope.newsSpeech(results)) {
			$scope.jeeves.failedUnderstandCount = 0;
			return;
		}else {
			$scope.failedToUnderstandFallback();
			return;
		}
	}

	// Global command manager
	$scope.globalCommands = function(results) {
		for (var i = 0; i < results.length; i++){
			if (results[i] == "how is the weather" || results[i] == "how's the weather" || results[i] == "what's the weather" || results[i] == "what is the weather like today" || results[i] == "what's the weather like" || results[i] == "how's the weather today" || results[i] == "how is the weather today"){
				$scope.$apply(function() {
					$scope.changeView("weather");
				})
				navigator.tts.speak("The current temperature in " + $scope.jeeves.city + " is " + Math.round($scope.jeeves.weather.temp.current) + " degrees fahrenheit. " + $scope.jeeves.weather.description + ".", function() {
					$scope.$apply(function() {
						$scope.changeView('back');
					})
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
				return true;
			} else if (results[i].match(/go to/) || results[i].match(/goto/) || results[i].match(/open/) || results[i].match(/go back/) || results[i].match(/take/)) {
				return $scope.goToSpeech(results);
			} else if (results[i].match(/read/)) {
				return $scope.globalReadSpeech(results);
			} else if (results[i].match(/help/) || results[i].match(/what can i say/)) {
				return $scope.getHelp(results);
			} else if (results[i].match(/refresh/)) {
				return $scope.refreshEmail();
			} else if (results[i].match(/done/) || results[i].match(/go away/) || results[i].match(/that's all/) || results[i].match(/no/)) {
				navigator.tts.speak("I'll be here if you need me.");
				return true;
			}
		}
		return false;
	}
	
	// If all the dialog mangers do not catch that, it gose here.
	$scope.failedToUnderstandFallback = function(){
		if ($scope.jeeves.failedUnderstandCount == 0){		// Different failing time gives different result.
			navigator.tts.speak("I'm sorry, I didn't catch that. Can you try speaking again?", function(){
				$scope.jeeves.failedUnderstandCount++;		// Increment the failing count.
				$scope.reco($scope.dialogMan); 
			});
			return;
		}else if ($scope.jeeves.failedUnderstandCount == 1){
			navigator.tts.speak("I'm sorry, I still didn't catch that. Can you try speaking again?", function(){
				$scope.jeeves.failedUnderstandCount++;
				$scope.reco($scope.dialogMan); 
			});
			return;
		}else if ($scope.jeeves.failedUnderstandCount == 2){
			navigator.tts.speak("I'm sorry, I seem to be having some difficulty right now. It's not you, it's me, but I think we need some space. I suggest manually navigating around for a little while.", function(){
				$scope.jeeves.failedUnderstandCount++;
				// When it reaches threee, won't try to use recognizer catch anything anymore.
			});
			return;
		}else {
			return false;
		}
	}

	// A function match "match" to "results"
	$scope.regXloop = function(results, match) {
		var regX = new RegExp(match);
		for (var i = 0; i < results.length; i++) {
			if (regX.test(results[i])) {
				return true;
			}
		}
		return false;
	}

	// A dialog mangaer for "go to" string amtch
	$scope.goToSpeech = function(results) {
		if ($scope.regXloop(results, 'news')) {
			if ($scope.jeeves.view != 'news') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('news');
					});
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
			} else {	// If go to current page, run statement below.
				navigator.tts.speak("You're already on the news page. Maybe you would like to listen to world or business news?", function() {
					$scope.reco($scope.dialogMan);
				})
			}
			return true;
		} else if ($scope.regXloop(results, 'email')) {
			if ($scope.jeeves.view != 'email') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('email');
					});
					if (OAuth.create("google_mail")) {
						$timeout(function() {
							navigator.tts.speak("What next?", function() {
								$scope.reco($scope.dialogMan);
							})
						}, 2500);
					}
				})
			} else {
				navigator.tts.speak("You're already on the email page. Would you like to hear your inbox messages?", function() {
					$scope.reco($scope.confirmReadEmail);
				});
			}
			return true;
		} else if ($scope.regXloop(results, 'weather')) {
			if ($scope.jeeves.view != 'weather') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('weather');
					});
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
			} else {
				navigator.tts.speak("You're already on the weather page. Would you like to hear the current weather?", function() {
					$scope.reco($scope.confirmReadWeather);
				});
			}
			return true;
		} else if ($scope.regXloop(results, 'menu')) {
			if ($scope.jeeves.view != 'menu') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('menu');
					});
				})
			} else {
				navigator.tts.speak('You are already on the menu. Maybe you would like to check out the news or your email?');
			}
			return true;
		} else if ($scope.regXloop(results, 'settings')) {
			if ($scope.jeeves.view != 'settings') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('settings');
					});
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
			} else {
				navigator.tts.speak("You're already on the settings page. You can ask for help if you'd like assistance on any part of the app by saying 'help' on that page.", function() {
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				});
			}
			return true;
		} else if ($scope.regXloop(results, 'contact')) {
			if ($scope.jeeves.view != 'contact') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('contact');
					});
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
			} else {
				navigator.tts.speak("You're already on the contact page. Whether you have an issue with our application or would like to express how much you love it, please feel free to email us at jeevescorp@gmail.com!", function() {
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				});
			}
			return true;
		} else if ($scope.regXloop(results, 'about')) {
			if ($scope.jeeves.view != 'about') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('about');
					});
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				})
			} else {
				navigator.tts.speak("You're already on the about page. Let me introduce myself to you!", function() {
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				});
			}
			return true;
		} else if ($scope.regXloop(results, 'help')) {
			if ($scope.jeeves.view != 'help') {
				navigator.tts.speak("On it.", function() {
					$scope.$apply(function() {
						$scope.changeView('help');
					});
					navigator.tts.speak("Let me know when you're finished, and I'll be happy to redirect you.");
				})
			} else {
				navigator.tts.speak("You're already on the help page, which displays all the possible commands for every part of the app. If you still cannot figure something out, please email us at jeevescorp@gmail.com with your issue, and we will do our best to promptly respond to you!", function() {
					navigator.tts.speak("What next?", function() {
						$scope.reco($scope.dialogMan);
					})
				});
			}
			return true;
		} else if ($scope.regXloop(results, 'back')) {
			navigator.tts.speak("No problem.", function() {
				$scope.$apply(function() {
					$scope.changeView('back');
				})
				navigator.tts.speak("What next?", function() {
					$scope.reco($scope.dialogMan)
				})
			})
			return true;
		} else {		// If the "go to" match no section, go to goToFallBack
			$scope.goToFallBack(results);
			return true;
		}
	}

	// A fall back to ask the user repeat the section they want to go.
	$scope.goToFallBack = function(results) {
		navigator.tts.speak("Sorry, I didn't catch all of that. Where would you like to go?", function() {
			$scope.reco($scope.goToSpeech);
		})
	}

	// Not Calling but leave for futreu use.
	// $scope.routeToNews = function(results) {
	// 	if (!$scope.confirmSpeech(results, ['go to news'])) {
	// 		navigator.tts.speak("Not to news? No problem. Let me know if you'd like anything else.", function() {
	// 			$scope.reco($scope.dialogMan);
	// 		})
	// 	}
	// }

	// A dialog manager for result starts with "read"
	$scope.globalReadSpeech = function(results) {
		if ($scope.regXloop(results, 'email') || $scope.jeeves.view == 'email') {
			if ($scope.jeeves.view != 'email') {
				navigator.tts.speak("Let's pull up your emails.", function () {
					$scope.$apply(function() {
						$scope.changeView('email');		// If the view is not email but ask for email, go to email view first.
					});
					return $scope.emailSpeech(results);
				});
			} else {
				return $scope.emailSpeech(results);
			}
		} else if ($scope.newsSpeech(results)) {		// If the email is not match, you should be news.
			return true;
		}
		return false;
	}

	// A fucntion control the help module in different view
	$scope.getHelp = function(results) {
		if ($scope.jeeves.view == 'weather') {
			$scope.jeeves.weathermodalhelp = $modal.open({
				templateUrl: "weather-help.html",
				windowClass: 'help-window'
			})
			navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'How's the weather?' or 'Change city to - city name.'", function() {
				$scope.jeeves.weathermodalhelp.close();
				navigator.tts.speak("What next?", function() {
					$scope.reco($scope.dialogMan);
				})
			});
			return true;
		}else if ($scope.jeeves.view == 'email') {
			$scope.jeeves.emailmodalhelp = $modal.open({
				templateUrl: "email-help.html",
				windowClass: "help-window"
			})
			navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'Read me my emails!' or, if you want to update the list of emails, you can say 'Refresh.'", function() {
				$scope.jeeves.emailmodalhelp.close();
				navigator.tts.speak("What next?", function() {
					$scope.reco($scope.dialogMan);
				})
			});
			return true;
		}else if ($scope.jeeves.view == 'news') {
			$scope.jeeves.newsmodalhelp = $modal.open({
				templateUrl: "news-help.html",
				windowClass: "help-window"
			})
			navigator.tts.speak("I welcome natural language! But if you need a hint, you can say 'continue,' if you want to resume an article you've paused, or say 'next' or 'previous' to listen to the next or previous article title.", function() {
				$scope.jeeves.newsmodalhelp.close();
				navigator.tts.speak("What next?", function() {
					$scope.reco($scope.dialogMan);
				})
			});
			return true;
		}else if ($scope.jeeves.view == 'about') {
			navigator.tts.speak("Nothing to do on this page! Let me open up the menu for you.", function() {
				$scope.$apply(function() {
					$scope.changeView('menu');
				})
			});
			return true;
		}else if ($scope.jeeves.view == 'settings') {
			navigator.tts.speak("you can say 'Change city' to change the city on the weather page, or say 'Log in' to be signed into your gmail account.", function() {
				navigator.tts.speak("What next?", function() {
					$scope.reco($scope.dialogMan);
				})
			}); 
			return true;
		}else if ($scope.jeeves.view == 'contact') {
			navigator.tts.speak("Nothing to do on this page! Let me open up the menu for you.", function() {
				$scope.$apply(function() {
					$scope.changeView('menu');
				})
			});
			return true;
		}
	}
	
	// A function catching confirm
	$scope.confirmSpeech = function(results, command) {
		if ($scope.regXloop(results, 'yes') || $scope.regXloop(results, 'yeah') || $scope.regXloop(results, 'yup') || $scope.regXloop(results, 'sure') || $scope.regXloop(results, 'ok')) {
			$scope.dialogMan(command); // Command must be an array.
			return true;
		}
		return false;
	}

	// Dialog man for weather speech
	$scope.weatherSpeech = function(results) {
		var city = "INVALID";

		for (var i = 0;i < results.length; i++) {
			if (results[i].lastIndexOf("change city to")==0){
				city = results[i].slice(15);
			}else if (results[i].lastIndexOf("change to")==0){
				city = results[i].slice(10);
			}else if (results[i].lastIndexOf("change weather to")==0){
				city = results[i].slice(18);
			}else if (results[i].lastIndexOf("what's the weather of")==0){
				city = results[i].slice(22);
			}else if (results[i].lastIndexOf("change the city to")==0){
				city = results[i].slice(19);
			}

			if(city != "INVALID"){
				var cityChange = $scope.capitaliseFirstLetter(city)
				$scope.changeWeather(cityChange);
				return true;
			} 
		}
		return false;
	}

	// A fall back to catch the city name again.
	$scope.weatherSpeechFallBack = function(cityName){
		var city = $scope.capitaliseFirstLetter(cityName[0]);
		$scope.changeWeather(city);
	}

	// A dialog manager for news Speech
	//Trying more accurate pause, pause when speech is called, and change section of news
	//Commands are: read, read <section>, read article, continue, previous, more articles
	$scope.newsSpeech = function(results){
		// Should only go to news page if it match anything from here.
		// ########Potential problem here: even though it is not "read something about news", it will still change the view to news.
		if ($scope.jeeves.view != 'news') {
			$scope.$apply(function(){
				$scope.changeView('news');
			});
		 }

		// Begin news speech recognition.
		for (var i = 0; i<results.length; i++) {
			if ($scope.regXloopForNews(results[i], 'read')){
				return $scope.readDiagNews(results);
			} else if ($scope.regXloopForNews(results[i], 'next')) {
				return $scope.contDiagNews();
			} else if($scope.regXloopForNews(results[i], 'previous five')||$scope.regXloopForNews(results[i], 'previous articles')||$scope.regXloopForNews(results[i], 'previous news')){
				$scope.$apply(function(){
					$scope.differentFive($scope.jeeves.newsPosition.section,false);
				});
				return true;
			} else if ($scope.regXloopForNews(results[i], 'previous')){
				return $scope.previousDiagNews();
			} else if($scope.regXloopForNews(results[i], 'more articles')){
				$scope.$apply(function(){
					$scope.differentFive($scope.jeeves.newsPosition.section,true);
				});
				return true;
			} else if($scope.regXloopForNews(results[i], 'change news to')){
				return $scope.changeNewsSection(results[i]);
			}
			$scope.$apply(); // This might need to be called before every return statement.
			return false;
		}
	}

	// Match recogniser result to open accordian
	$scope.changeNewsSection=function(results){
		if ($scope.regXloopForNews(results, 'news')||$scope.regXloopForNews(results, 'world')||$scope.regXloopForNews(results, 'sports')||$scope.regXloopForNews(results, 'business')||$scope.regXloopForNews(results, 'tech')||$scope.regXloopForNews(results, 'science')){
				$scope.changeNewsHelper(results);
				return true;
			}
			return false;
	}

	// Open different seciton of accordian
	$scope.changeNewsHelper=function(sectionName){
		if($scope.regXloopForNews(sectionName, 'news')){
			$scope.$apply(function(){
				$scope.jeeves.newsPosition.section='news';
				$scope.jeeves.newsPosition.articleIndex = 0;
				$scope.status.isNewsOpen=true;
				$scope.status.isWorldOpen=false;
				$scope.status.isSportsOpen=false;
				$scope.status.isBusinessOpen=false;
				$scope.status.isTechOpen=false;
				$scope.status.isScienceOpen=false;
			});
		}else if($scope.regXloopForNews(sectionName, 'world')){
			$scope.$apply(function(){
				$scope.jeeves.newsPosition.section='world';
				$scope.jeeves.newsPosition.articleIndex = 0;
				$scope.status.isWorldOpen=true;
				$scope.status.isNewsOpen=false;
				$scope.status.isSportsOpen=false;
				$scope.status.isBusinessOpen=false;
				$scope.status.isTechOpen=false;
				$scope.status.isScienceOpen=false;
			});
		}else if($scope.regXloopForNews(sectionName, 'sports')){
			$scope.$apply(function(){
				$scope.jeeves.newsPosition.section='sports';
				$scope.jeeves.newsPosition.articleIndex = 0;
				$scope.status.isSportsOpen=true;
				$scope.status.isWorldOpen=false;
				$scope.status.isNewsOpen=false;
				$scope.status.isBusinessOpen=false;
				$scope.status.isTechOpen=false;
				$scope.status.isScienceOpen=false;
			});
		}else if($scope.regXloopForNews(sectionName, 'business')){
			$scope.$apply(function(){
				$scope.jeeves.newsPosition.section='business';
				$scope.jeeves.newsPosition.articleIndex = 0;
				$scope.status.isBusinessOpen=true;
				$scope.status.isWorldOpen=false;
				$scope.status.isSportsOpen=false;
				$scope.status.isNewsOpen=false;
				$scope.status.isTechOpen=false;
				$scope.status.isScienceOpen=false;
			});
		}else if($scope.regXloopForNews(sectionName, 'tech')){
			$scope.$apply(function(){
				$scope.jeeves.newsPosition.section='tech';
				$scope.jeeves.newsPosition.articleIndex = 0;
				$scope.status.isTechOpen=true;
				$scope.status.isWorldOpen=false;
				$scope.status.isSportsOpen=false;
				$scope.status.isBusinessOpen=false;
				$scope.status.isNewsOpen=false;
				$scope.status.isScienceOpen=false;
			});
		}else if($scope.regXloopForNews(sectionName, 'science')){
			$scope.$apply(function(){
				$scope.jeeves.newsPosition.section='science';
				$scope.jeeves.newsPosition.articleIndex = 0;
				$scope.status.isScienceOpen=true;
				$scope.status.isWorldOpen=false;
				$scope.status.isSportsOpen=false;
				$scope.status.isBusinessOpen=false;
				$scope.status.isTechOpen=false;
				$scope.status.isNewsOpen=false;
			});
		}else{	
			navigator.tts.speak("You requested change section but the name of the section was unclear. Please repeat the command.", function(){
				$scope.$apply(function(){
					$scope.reco($scope.dialogMan);
				})
			})
		}
	}

	// Read news title for the open section.
	// Either reads the web title for the article on that section or reads the whole article if said read article
	$scope.readDiagNews = function(results1){
		for(var i=0; i<results1.length;i++){
			if($scope.regXloopForNews(results1[i], 'article')||$scope.regXloopForNews(results1[i], 'this')||$scope.regXloopForNews(results1[i], 'now')){
				$scope.readArticle();
				return true;
			}
			else{
				if ($scope.regXloopForNews(results1[i], 'news')||$scope.regXloopForNews(results1[i], 'world')||$scope.regXloopForNews(results1[i], 'sports')||$scope.regXloopForNews(results1[i], 'business')||$scope.regXloopForNews(results1[i], 'tech')||$scope.regXloopForNews(results1[i], 'science')){
					if($scope.changeNewsSection(results1[i])){
						$scope.sayWebTitle($scope.jeeves.newsPosition.section);
						return true;
					}
				}
				else{
					navigator.tts.speak("Reading news.", function(){
						if($scope.changeNewsSection('news')){
							$scope.sayWebTitle($scope.jeeves.newsPosition.section);
							return true;
						}
					})
					return true;
				}
			}
		}
		return false;
	}

	// Reading news manger
	$scope.routeToReadSection = function(results){
		if($scope.regXloop(results, 'news')||$scope.regXloop(results, 'world')||$scope.regXloop(results, 'sports')||$scope.regXloop(results, 'tech')||$scope.regXloop(results, 'science')){
			$scope.readDiagNews(results);
		}
		else{
			$scope.dialogMan(results);	// If it does not match anything, take a reuslt again.
			// ###### But this should be a fall back instead of going to dialogMan directly
		}
	}

	// A fucntion switching the reading pointer to the next article.
	$scope.contDiagNews = function(){
		navigator.tts.speak("Going to next article", function(){
		$scope.$apply(function(){
			$scope.jeeves.newsPosition.articleIndex++;
			$scope.sayWebTitle($scope.jeeves.newsPosition.section);
			});
		});
		return true;
	}

	// A function switching the reading pointer to the previous article.
	$scope.previousDiagNews = function(){
		if($scope.jeeves.newsPosition.articleIndex>=1){
			navigator.tts.speak("Going to previous article", function(){
				$scope.$apply(function(){
					$scope.jeeves.newsPosition.articleIndex=$scope.jeeves.newsPosition.articleIndex-1;
					$scope.sayWebTitle($scope.jeeves.newsPosition.section);
				});
			});
		} else{		//Catch the case that if there is no previous article.
			navigator.tts.speak("There are no previous articles. Would you like to hear the next article? Say yes or other command.", function(){
				$scope.reco($scope.routeToPrevious);
			});
		}
		return true;
	}

	// A function for comfirming and keep reading article.(used in catching no previous article situation)
	$scope.routeToPrevious = function(results){
		if($scope.regXloop(results, 'yes')){
			var x = ['continue'];
			$scope.newsSpeech(x);
		}else{
			$scope.dialogMan(results);	// If it does not match anything, take a reuslt again.
			// ###### But this should be a fall back instead of going to dialogMan directly
		}
	}

	// A pause and play control for playing news.
    $scope.redirect = function() {
	  	if ($scope.jeeves.readingArticle){
	  		navigator.tts.stop();
			$scope.jeeves.newsPosition.pause=true;
	  		$scope.reco(function(results){
	  			if ($scope.regXloop(results, 'pause') || $scope.regXloop(results, 'stop')){
	  			}else if($scope.regXloop(results, 'play') || $scope.regXloop(results, 'resume') || $scope.regXloop(results, 'start') || $scope.regXloop(results, 'continue')){
	  				$scope.pauseAndPlay();	
	  			}else {
	  				$scope.dialogMan(results);
	  			}
	  		})
		 } else {
	  		$scope.reco($scope.dialogMan);	// If it does not match anything, take a reuslt again.
			// ###### But this should be a fall back instead of going to dialogMan directly
	  	}
	}

	// News command hint.
	$scope.adaptivePrompt = function(){
		$scope.jeeves.webTitle.calledTitle++;
		if($scope.jeeves.webTitle.calledTitle==1){	// Hint at the beggining
			$scope.jeeves.webTitle.calledWebTitle=". If you need a hint, some example commands are 'read article', 'read, section name', 'continue,' 'previous,' or 'more articles.' Say 'help' if you would like to hear these again.";
		}
		else if($scope.jeeves.webTitle.calledTitle>2){
			$scope.jeeves.webTitle.calledWebTitle=". Say read article or continue.";
		}
	}

	// A regular mathing fucntion for news section.
	// Specify for a string instead of an array.
	$scope.regXloopForNews = function(result, match) {
		var regX = new RegExp(match);
		if (regX.test(result)) {
			return true;
		}
		return false;
	}

	// A fucntion reading article titles and keeping track of the progress
	$scope.sayWebTitle = function(section){
		$scope.adaptivePrompt();
		if ($scope.jeeves.newsPosition.section == "news"){
			navigator.tts.speak($scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
				$scope.reco($scope.dialogMan);
			});
		}else if ($scope.jeeves.newsPosition.section == "world"){
			navigator.tts.speak($scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
				$scope.reco($scope.dialogMan);
			});
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			navigator.tts.speak($scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
				$scope.reco($scope.dialogMan);
			});
		}else if ($scope.jeeves.newsPosition.section == "business"){
			navigator.tts.speak($scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
				$scope.reco($scope.dialogMan);
			});
		}else if ($scope.jeeves.newsPosition.section == "technology"){
			navigator.tts.speak($scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
				$scope.reco($scope.dialogMan);
			});
		}else if ($scope.jeeves.newsPosition.section == "science"){
			navigator.tts.speak($scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle+ $scope.jeeves.webTitle.calledWebTitle, function() {
				$scope.reco($scope.dialogMan);
			});
		}
		$scope.$apply();
	}

	// Reading the article
	$scope.readArticle = function(){
		$scope.jeeves.newsPosition.pause=false;
		$scope.jeeves.newsPosition.pausePosition=0;
		$scope.jeeves.newsPosition.contArticleContent="";

		if ($scope.jeeves.newsPosition.section == "news"){			
			// Get the body of the news
			var gotResult = $scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			// Transcript it into natural language without tag.
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.news[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
				$scope.$apply(function() {
					// Keep the current reading article in record.
					$scope.jeeves.newsPosition.contArticleContent=finalResult;
					// Passing the readiing starting point and a array of sentences in the article.
					$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
				});
			});
		}else if ($scope.jeeves.newsPosition.section == "world"){
			var gotResult = $scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.world[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
				$scope.$apply(function() {
					$scope.jeeves.newsPosition.contArticleContent=finalResult;
					$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
				});
			});
		}else if ($scope.jeeves.newsPosition.section == "sports"){
			var gotResult = $scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.sports[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
				$scope.$apply(function() {
					$scope.jeeves.newsPosition.contArticleContent=finalResult;
					$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
				});
			});
		}else if ($scope.jeeves.newsPosition.section == "business"){
			var gotResult = $scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.business[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
				$scope.$apply(function() {
					$scope.jeeves.newsPosition.contArticleContent=finalResult;
					$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
				});
			});
		}else if ($scope.jeeves.newsPosition.section == "tech"){
			var gotResult = $scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.tech[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
				$scope.$apply(function() {
					$scope.jeeves.newsPosition.contArticleContent=finalResult;
					$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
				});
			});
		}else if ($scope.jeeves.newsPosition.section == "science"){
			var gotResult = $scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].fields.body;
			div1=document.createElement('div');
			div1.innerHTML=gotResult;
			var finalResult=$(div1).text();
			navigator.tts.speak("Starting to read article: "+$scope.jeeves.newsArticles.science[$scope.jeeves.newsPosition.articleIndex].webTitle, function() {
				$scope.$apply(function() {
					$scope.jeeves.newsPosition.contArticleContent=finalResult;
					$scope.recursiveArticleChunk(finalResult.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
				});
			});
		}
		$scope.$apply();
	}

	// Recursively call to read the article sentece by sentence.
	$scope.recursiveArticleChunk = function(chunkArray, position){
	 	output = chunkArray[position];
	 	$scope.jeeves.readingArticle=true;
	 	$scope.jeeves.newsPosition.pausePosition=position;
	 	if($scope.jeeves.newsPosition.pause==true){

	 	} else if(position>=chunkArray.length){
	 		navigator.tts.speak("Available commands are: next article, read section name, read article, previous, more articles or previous five articles.", function(){
	 			$scope.$apply(function(){
	 				 $scope.jeeves.readingArticle=false;
	 				 $scope.jeeves.newsPosition.articleIndex++;
	 				 $scope.jeeves.newsPosition.pause=false;
	 				 $scope.jeeves.newsPosition.pausePosition=0;
	 				$scope.reco($scope.dialogMan);
	 			});
	 		});
	 	} else{
	 		navigator.tts.speak(output, function(){
	 			$scope.recursiveArticleChunk(chunkArray, (position+1));
	 		});
	 	}
	}

	// Pause and play function to start reading again.
	$scope.pauseAndPlay = function(){
		if($scope.jeeves.newsPosition.pause==false){
			navigator.tts.stop(function() {
				$scope.jeeves.newsPosition.pause=true;
			});
		} else{
			$scope.jeeves.newsPosition.pause=false;
			var cont=$scope.jeeves.newsPosition.contArticleContent;
			$scope.recursiveArticleChunk(cont.match( /[^\.!\?]+[\.!\?]+/g ), $scope.jeeves.newsPosition.pausePosition);
			return true;
		}
	}

	// Speak out the emails
	$scope.emailSpeech = function(results) {
		if ($scope.jeeves.emailCount < $scope.jeeves.emailList.length) {
			var email = $scope.jeeves.emailList[$scope.jeeves.emailCount];
			var content = email.content;
			navigator.tts.speak(email.subject + " from " + email.from + ". " + content + ".", function() {
				$scope.jeeves.emailCount++;
				if ($scope.jeeves.emailCount < $scope.jeeves.emailList.length) {
					navigator.tts.speak("Would you like me to read the next email?", function() {
						$scope.reco($scope.confirmReadEmail);
					})
				} else {	// After reading all the email
					navigator.tts.speak("That's all the emails. What now?", function() {
						$scope.reco($scope.dialogMan);
					})
				}
			});
		} else {		// If there is no more email
			navigator.tts.speak("You have no new emails. Should I begin reading from the beginning?", function() {
				$scope.reco($scope.confirmRestartEmail);
			})
		}
		
		return true;
	}

	// A little dialog to comfirm reading next email.
	$scope.confirmReadEmail = function(results) {
		if (!$scope.confirmSpeech(results, ['read email'])) {
			navigator.tts.speak("Ok. So what next?", function() {
				$scope.reco($scope.dialogMan);
			})
		}
	}

	// A little dialog to comfirm restart reading the email when there is no more email.
	$scope.confirmRestartEmail = function(results) {
		$scope.jeeves.emailCount = 0;
		if (!$scope.confirmSpeech(results, ['read email'])) {
			navigator.tts.speak("Ok. So what next?", function() {
				$scope.reco($scope.dialogMan);
			})
		}
	}

	// A continue dialog design after asking how's the weather.
	$scope.confirmReadWeather = function(results) {
		if (!$scope.confirmSpeech(results, ["how's the weather"])) {
			navigator.tts.speak("OK. So what next?", function() {
				$scope.reco($scope.dialogMan);
			})
		}
	}

	// Capitalize all the words in a sentence. Use to capitalize city name.
	$scope.capitaliseFirstLetter=function(string){
    	return string.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	};

	// Pipe content from the api to the div with the title id.
	$scope.setInnerHTML = function(entry){
	 	var article = document.getElementById(entry.webTitle);
	 	article.innerHTML = entry.fields.body;
	 	var link = document.createElement('a');
	 	link.href = entry.webUrl;
	 	link.innerHTML = "Read this on The Guardian";
	 	article.appendChild(link);
	 };

	// Get different five article displayed under different section.
	$scope.differentFive = function(selected, increment){
		var change = 5;

		if(!increment){		// When increment is false, it will minus five and give the previous five.
			change = -5;
		}
		if(selected=="news"){
			$scope.jeeves.displayNews.newsCount += change;
		}else if (selected=="world"){
			$scope.jeeves.displayNews.worldCount += change;
		}else if (selected=="sports"){
			$scope.jeeves.displayNews.sportsCount += change;
		}else if (selected=="business"){
			$scope.jeeves.displayNews.businessCount += change;
		}else if (selected=="tech"){
			$scope.jeeves.displayNews.techCount += change;
		}else if (selected=="science"){
			$scope.jeeves.displayNews.scienceCount += change;
		}else{
			//console.log("Something wrong with the cutting");
		}

		// After setting up the cutting point, do the cut.
		$scope.cutNews();
	}

	// When there is no previous five, disable the back button.
	$scope.disableBack = function(){
		if($scope.jeeves.displayNews.newsCount<5){
			var button = document.getElementById('newsBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('newsBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.worldCount<5){
			var button = document.getElementById('worldBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('worldBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.sportsCount<5){
			var button = document.getElementById('sportsBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('sportsBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.businessCount<5){
			var button = document.getElementById('businessBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('businessBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.techCount<5){
			var button = document.getElementById('techBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('techBack');
			button.disabled = null;
		}
		if($scope.jeeves.displayNews.scienceCount<5){
			var button = document.getElementById('scienceBack');
			button.disabled = 'disabled';
		}else{
			var button = document.getElementById('scienceBack');
			button.disabled = null;
		}
	}

	// Cut five articles from the whole article list to display.
	$scope.cutNews = function(){
		$scope.jeeves.displayNews.news = $scope.jeeves.newsArticles.news.slice($scope.jeeves.displayNews.newsCount, $scope.jeeves.displayNews.newsCount+5);
		$scope.jeeves.displayNews.world = $scope.jeeves.newsArticles.world.slice($scope.jeeves.displayNews.worldCount, $scope.jeeves.displayNews.worldCount+5);
		$scope.jeeves.displayNews.sports = $scope.jeeves.newsArticles.sports.slice($scope.jeeves.displayNews.sportsCount, $scope.jeeves.displayNews.sportsCount+5);
		$scope.jeeves.displayNews.business = $scope.jeeves.newsArticles.business.slice($scope.jeeves.displayNews.businessCount, $scope.jeeves.displayNews.businessCount+5);
		$scope.jeeves.displayNews.tech = $scope.jeeves.newsArticles.tech.slice($scope.jeeves.displayNews.techCount, $scope.jeeves.displayNews.techCount+5);
		$scope.jeeves.displayNews.science = $scope.jeeves.newsArticles.science.slice($scope.jeeves.displayNews.scienceCount, $scope.jeeves.displayNews.scienceCount+5);
		$scope.disableBack();
	}

	// The oauthlogin sdk for gmail authentication.
	$scope.oauthlogin = function() {
		OAuth.initialize("hmTB5riczHFLIGKSA73h1_Tw9bU");
		OAuth.popup('google_mail', {cache: true})
		.done(function(result) {
			$scope.getEmail();
			navigator.tts.speak("You are now logged in to Gmail!", function() {
				if ($scope.jeeves.view == 'email') {
					$timeout(function() {
						navigator.tts.speak("Would you like me to read your email?", function() {
							$scope.reco($scope.confirmReadEmail);
						})
					}, 500);
				} else {	// If the app is not on email app, comfirm first.
					navigator.tts.speak("Would you like to check your emails?", function() {
						$scope.reco($scope.confirmReadEmail);
					})
				}
			});
		})
	}

	// Get the email from the gamil api.
	$scope.getEmail = function() {
		$scope.jeeves.emailList.length = 0;
		$scope.jeeves.emailCount = 0;
		// After get the email, hide the refiresh button.
		document.getElementById("refresh-button").style.visibility = "hidden";
		OAuth.initialize("hmTB5riczHFLIGKSA73h1_Tw9bU");
		var loggedIn = OAuth.create("google_mail");
		loggedIn.me().done(function(data) {
			loggedIn.get("https://www.googleapis.com/gmail/v1/users/me/messages?labelIds=INBOX")
			.done(function(list) {
				$scope.jeeves.emailListCount = 0;
				// Update the announcement div and tell the user which box the app is reading.
				document.getElementById('email-announcement').innerHTML = '<i>Hello! I am reading your <b>inbox</b> emails.</i><br><br>';
				var prologue = document.getElementById("message-list");
				if (list.messages == null) {
			        prologue.innerHTML = "<b>Your inbox is empty.</b>";
			      } else {
			        prologue.innerHTML = "---------<br><br>";
			        angular.forEach(list.messages, function(message) {	// Loop all the eamil.
			        	var emailObject = {};
			        	loggedIn.get("https://www.googleapis.com/gmail/v1/users/me/messages/" + message.id)
			        	.done(function(email) {
		        			var header = "";
		            		var sender = "";
		            		angular.forEach(email.payload.headers, function(item) {		// Loop all the information of the email.
		            			if (item.name == 'Subject') {
		            				header = item.value;
		              			}
		              			if (item.name == "From") {
					                sender = item.value;
					            }
		            		})
			              	emailObject.subject = header;
			              	emailObject.from = sender;
			              	if (email.payload.parts == null) {
			              		emailObject.content = unescape(atob(email.payload.body.data));
			              	} else {
			              		emailObject.content = unescape(atob(email.payload.parts[0].body.data));
			              	}
			              	$scope.$apply(function() {
			              		$scope.jeeves.emailList.push(emailObject);
			              	});
			              	// Make the refresh button visible again.
			              	// ## Is this contradic to the code above?
			              	document.getElementById("refresh-button").style.visibility = "visible";
			        	})
			        })
			    }
			})
		});
	}

	// Start loading email.
	$scope.checkEmail = function() {
		OAuth.initialize("hmTB5riczHFLIGKSA73h1_Tw9bU");
		if (!OAuth.create('google_mail')) {		// If the user is not logged in,
			$scope.oauthlogin();
		} else {		// If the user is already logged in.
			$scope.getEmail();
		}
	}

	// Reload Email
	$scope.refreshEmail = function() {
		navigator.tts.speak("Refreshing...");
		$scope.checkEmail();
	}
});
