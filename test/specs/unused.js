describe("toggleSet directive", function() {
	var elem
		,scope
		,compile
		,compiled;

	beforeEach(module('app', function($provide) {
		//
	}));

	beforeEach(inject(function($rootScope, $compile) {
		compile = $compile;
		scope = $rootScope;
		
		scope.val = '';

		var html = '<toggle-set ng-model="val"><button val="">btn0</button><button val="a">btn1</button><button val="b">btn2</button></toggle-set>';
		elem = angular.element(html);

		//compile the element into a function to process the view.
		compiled = $compile(elem);

		//run the compiled view.
		compiled(scope);

		scope.$digest();
		scope.$apply();
	}));

	it("should hide all elements except one", function() {
		//console.log(elem.find("button"));
		expect($(elem).find(".ng-hide").length).toBe(2);
	});

	it("should set the scope value to the next value on click", function() {
		elem.find("button:first").trigger("click");
		scope.$apply();
		expect(scope.val).toBe('a');
	});

	it("should set the scope value to the FIRST value on click of last element", function() {
		elem.find("button:first").trigger("click");
		scope.$apply();
		elem.find("button:first").trigger("click");
		scope.$apply();
		elem.find("button:first").trigger("click");
		scope.$apply();
		expect(scope.val).toBe('');
	});

	xit("should add an alert with html equal to the message property of the obj added", function() {
		messages = [];
		var msgObj = {success:false, message: 'test'};
		informerService.messages.push(msgObj);
		scope.$apply();
		var alert = elem.find(".alert");
		expect(alert.html()).toBe(msgObj.message);
	});

	xit("should add an alert with a class of error to the elem when an error message is added to the queue", function() {
		informerService.messages.push({success:false, message: ''});
		scope.$apply();
		var alert = elem.find(".alert");
		expect(alert.hasClass('alert-error')).toBe(true);
	});

	xit("should add an alert with a class of success to the elem when a success message is added to the queue", function() {
		informerService.messages.push({success:true, message: ''});
		scope.$apply();
		var alert = elem.find(".alert");
		expect(alert.hasClass('alert-success')).toBe(true);
	});

	xit("should add a shown property to the message object", function() {
		var msgObj = {success:false, message: 'test'};
		informerService.messages.push(msgObj);
		scope.$apply();
		expect(msgObj.shown).toBe(true);
	});

	xit("should expire and then hide the message after a timeout", function() {
		var msgObj = {success:false, message: 'test'};
		informerService.messages.push(msgObj);
		scope.$apply();
		timeout.flush();
		expect(msgObj.expired).toBeTruthy();
		timeout.flush();
		expect(msgObj.hidden).toBeTruthy();
	});
});