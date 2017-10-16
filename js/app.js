// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.imageservice', 'ngStorage'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('gmapp', {
    url: '/gmapp',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('gmapp.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            controller: 'HomeCtrl'
          }
        }
      })
      
      
      
  .state('gmapp.categories', {
        url: '/categories',
        views: {
          'menuContent': {
            templateUrl: 'templates/categories.html',
            controller: 'CategoriesCtrl'
          }
        }
      })    

  .state('gmapp.categoryprds', {
        url: '/categoryprds/:categoryID',
        views: {
          'menuContent': {
            templateUrl: 'templates/categoryprds.html',
            controller: 'categoryprdsCtrl'
          }
        }
      })


  .state('gmapp.products', {
        url: '/products',
        views: {
          'menuContent': {
            templateUrl: 'templates/products.html',
            controller: 'ProductsCtrl'
          }
        }
      })

    .state('gmapp.product', {
        url: '/product/:productID',
        views: {
          'menuContent': {
            templateUrl: 'templates/product.html',
            controller: 'ProductCtrl'
          }
        }
      })


     .state('gmapp.signup', {
        url: '/signup',
        views: {
          'menuContent': {
            templateUrl: 'templates/signup.html',
            controller: 'SignUpCtrl'
          }
        }
      })

      .state('gmapp.login', {
        url: '/login',
        views: {
          'menuContent': {
            templateUrl: 'templates/login.html',
            controller: 'LoginCtrl'
          }
        }
      })


      .state('gmapp.checkout', {
        url: '/checkout',
        views: {
          'menuContent': {
            templateUrl: 'templates/checkout.html',
            controller: 'CheckoutCtrl'
          }
        }
      })


      .state('gmapp.orders', {
        url: '/orders',
        views: {
          'menuContent': {
            templateUrl: 'templates/orders.html',
            controller: 'OrdersCtrl'
          }
        }
      })

      .state('gmapp.update', {
        url: '/update',
        views: {
          'menuContent': {
            templateUrl: 'templates/update.html',
            controller: 'UpdateCtrl'
          }
        }
      })

      .state('gmapp.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html',
            controller: 'SearchCtrl'
          }
        }
      })
      
      
      
      ;



  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/gmapp/home');
})