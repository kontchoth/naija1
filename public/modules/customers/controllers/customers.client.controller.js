'use strict';

// Customers controller

var custumersApp = angular.module('customers');


custumersApp.controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log',
	function($scope, $stateParams, Authentication, Customers , $modal, $log) {

		// Authenticate the user
		this.authentication = Authentication;

		// Find a list of Customers
		this.customers = Customers.query();

		// modal for the controller
		// Open a modal window to Update a single customer record
		this.modalCreate = function (size) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/customers/views/create-customer.client.view.html',
				controller: function ($scope, $modalInstance) {


					$scope.ok = function () {
						if (!$scope.createCustomerForm.$invalid){
							$modalInstance.close();
						} else {
							$log.info('form not valid ');
						}

					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};



		// modal for the controller
		// Open a modal window to Update a single customer record
		this.modalUpdate = function (size, selectedCustomer) {

			var modalInstance = $modal.open({
				templateUrl: 'modules/customers/views/edit-customer.client.view.html',
				controller: function ($scope, $modalInstance, customer) {
					$scope.customer = customer;

					$scope.ok = function () {
						if (!$scope.updateCustomer.$invalid){
							$modalInstance.close($scope.customer);
						} else {
							$log.info('form not valid ');
						}

					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel');
					};
				},
				size: size,
				resolve: {
					customer: function () {
						return selectedCustomer;
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};



		// Remove existing Customer
		this.remove = function(customer) {
			if ( customer ) {
				customer.$remove();

				for (var i in this.customers) {
					if (this.customers [i] === customer) {
						this.customers.splice(i, 1);
					}
				}
			} else {
				this.customer.$remove(function() {

				});
			}
		};


	}
]);



custumersApp.controller('CustomersCreateController', ['$scope', 'Customers', 'Notify',
	function($scope, Customers, Notify) {
		// Create new Customer
		this.create = function() {
			// Create new Customer object
			var customer = new Customers ({
				firstName: this.firstName,
				surname: this.surname,
				suburb: this.suburb,
				country: this.country,
				referred: this.referred,
				industry: this.industry,
				email: this.email,
				phone: this.phone,
				channel: this.channel
			});

			// Redirect after save
			customer.$save(function(response) {
				Notify.sendMsg('NewCustomer', {'id': response._id});
				// Clear form fields
				$scope.firstName = '';
				$scope.surname = '';
				$scope.suburb = '';
				$scope.country = '';
				$scope.referred = '';
				$scope.industry = '';
				$scope.email = '';
				$scope.phone = '';
				$scope.channel = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);


custumersApp.controller('CustomersUpdateController', ['$scope', 'Customers',
	function($scope,  Customers) {
		$scope.channelOptions = [
			{id: 1, item: 'Facebook' },
			{id: 2, item: 'Twitter' },
			{id: 3, item: 'Email' },
		];
		// Update existing Customer
		this.update = function(updatedCustomer) {
			var customer = updatedCustomer;

			customer.$update(function() {

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);


custumersApp.directive('customerList', ['Customers', 'Notify',  function(Customers, Notify){
	return {
		restrict: 'E',
		transclude: true,
		templateUrl: 'modules/customers/views/customer-list-template.html',
		link: function(scope, element, attrs){

			//when a new customer is added, update the customer list
			Notify.getMsg('NewCustomer', function(event, data) {
				//we need to requeries
				scope.customersCtrl.customers = Customers.query();
			});
		}
	};
}]);





