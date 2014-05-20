var app = angular.module("app",['ngSanitize','ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider
  	.when('/', {
        templateUrl: 'main.html',
        controller: 'Main'
    })
	.when('/:signId', {
		templateUrl: 'main.html',
		controller: 'Main'
	})
	.when('/:signId/image', {
		templateUrl: 'output.html',
		controller: 'Main'
	})
  	.otherwise({ redirectTo: '/' });
})

.controller("Main", function($scope,$routeParams,$location,signService) {
	signService.getSign($routeParams.signId).then(function(resp) {
		$scope.sign = resp;
	});

	$scope.icons = ['', 'fa fa-arrow-left', 'fa fa-arrow-left angle','fa fa-arrow-up','fa fa-arrow-right angle','fa fa-arrow-right','fa fa-arrow-down'];
	$scope.appendLeft = function(line) {
		var index = _.indexOf($scope.icons, line.appendLeft || '');
		index++;
		index = index > $scope.icons.length - 1 ? 0 : index;
		line.appendLeft = $scope.icons[index];
	}

	$scope.appendRight = function(line) {
		var index = _.indexOf($scope.icons, line.appendRight || '');
		index++;
		index = index > $scope.icons.length - 1 ? 0 : index;
		line.appendRight = $scope.icons[index];
	}

	$scope.sizes = ['SM','MD','LG','XL'];
	$scope.setSize = function(line) {
		var index = _.indexOf($scope.sizes, line.size || '');
		index++;	
		index = index > $scope.sizes.length - 1 ? 0 : index;
		line.size = $scope.sizes[index];
	}

	$scope.save = function() {
		signService.save($scope.sign).then(function(resp) {
			$location.path(resp.data._id)
		})
	};
})

.service("signService", function($http,$q,Sign) {
	var self = this;

	self.getSign = function(id) {
		var deferred = $q.defer();
		var sign = new Sign();
		if(!id) { 
			deferred.resolve(sign); 
		} else {
			$http.get("/sign/" + id).then(function(resp) {
				sign._id = resp.data._id;
				sign.color = resp.data.color;
				sign.clearLines();

				if(resp.data.lines)
				{
					resp.data.lines.forEach(function(line) {
						//map old sizes to new sizes
						var sizes = {
							'small': 'SM',
							'big': 'MD',
							'xbig': 'LG'
						};
						var size = sizes[line.size];
						if(size)
						{
							line.size = size;
						}
						sign.lines.push(line);
					})
				}
				
				deferred.resolve(sign);
			});	
		}
		
		return deferred.promise;
	};

	self.save = function(sign) {
		if(sign._id)
		{
			return $http.put('/sign/' + sign._id, sign);
		} else {
			return $http.post('/sign/', sign);
		}
	};
})

.factory("Sign", function($http,$q) {
	var lines = [];

	var Sign = function() {
		lines = [];
		return {
			color: 'blue',
			lines: lines,
			addLine: function(text,size) {
				size = lines.length > 0 ? lines[lines.length-1].size : size;
				text = text || lines.length > 0 ? '' : 'ENTER TEXT';
				lines.push({text: text, size: size||'LG', appendRight: '', appendLeft: ''})
			},
			clearLines: function() {
				lines.splice(0,lines.length);
			}
		}		
	};

	return Sign;
})

.directive("sign", function() {
	return {
		restrict: "E",
		require: "ngModel",
		scope: {
			sign: "=ngModel"
		},
		link: function(scope,element,attr)
		{

		},
		templateUrl:'sign.html'
	}
})

.directive("line", function() {
	return {
		restrict: "E",
		scope: {
			line: "=ngModel"
		},
		link: function(scope,element,attr)
		{
			// scope.$watch('line.text', function(newVal,oldVal) {
			// 	if(newVal === '') {
			// 		scope.line.text = 'ENTER TEXT';
			// 	}
			// });
		},
		templateUrl: 'line.html'
	}
})

.filter("htmlSpaces", function() {
	return function(val) {
		// if(val.length === 0) { 
		// 	val = ' '; 
		// }
		return val.replace(/\s/g, '&#160;');
	}
})