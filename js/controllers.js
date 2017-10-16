angular.module('starter.controllers', ['starter.services'])

  .controller('AppCtrl', function ($scope, DataService, $ionicLoading, $localStorage, $rootScope, $ionicPopup, $ionicModal, $state) {


    $scope.$on('$ionicView.enter', function (e) {
      //defined ionic  $ionicView.enter event will fire event when user 



      //$localStorage.userData exists in local storage then is copied to rootscope
      if ($localStorage.userData) {
        console.log("userData: is", $localStorage.userData);
        $rootScope.userData = $localStorage.userData;
      }
    });

    $scope.logout = function () {
      $rootScope.userData = undefined;
      $localStorage.userData = undefined;
      console.log('The control is in logout function.');
      console.log($localStorage.userData);
      console.log($localStorage.userData);
    }

   $localStorage.cart = [];

    if ($localStorage.cart) {
      $rootScope.cartCount = $localStorage.cart.length;
    }

    else {
      $rootScope.cartCount = 0;

    }


    $ionicLoading.show({
      template: '<ion-spinner></ion-spinner>'
    });

    DataService.data('categories', 'getcontents').then(function (d) {
      $scope.categories = d;
      $ionicLoading.hide();
    });

    $scope.showCart = function () {
      $scope.cartContents = $localStorage.cart;
      if (!$scope.cartContents || $scope.cartContents.length == 0) {
        console.log("There are no contents in the cart or local storage");
        $ionicPopup.show({
          template: "<center>There are no items in cart. Please continue shopping</center>",
          buttons: [{
            text: "Ok"
          }]
        })

        return $scope.cartContents;
      }

      $scope.total = 0;
      $scope.cartContents.forEach(function (element, index) {
        $scope.total = $scope.total + (Number(element.price) * Number(element.count));
      });
      $scope.total = $scope.total.toFixed(2);
      $localStorage.totalMoney = $scope.total;


      $scope.modal = {};
      $ionicModal.fromTemplateUrl('templates/cart.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function (modal) {
        $scope.modal = modal;
        $scope.modal.show();
      });

    }



    $scope.handleCheckout = function () {

      $scope.modal.hide();
      if ($localStorage.userData) {
        $state.go("gmapp.checkout");
      }
      else {
        $state.go("gmapp.login")
        /* $ionicPopup.show({
           title: "Hai Guest",
           template: "<center>Please login to proceeed your order</center>",
           buttons: [{
             text: "OK",
             type: "button-assertive"
           }]
         }) */

      }

    }
  })
  .controller('CategoriesCtrl', function ($scope, DataService, $http) {

    DataService.data('categories', 'getcontents').then(function (d) {
      $scope.categories = d;

    });

  })
  .controller('categoryprdsCtrl', function ($scope, DataService, $stateParams, $ionicLoading) {

    $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
    console.log('categorie id is:products?q=' + $stateParams.categoryID);
    DataService.data('products?q=' + $stateParams.categoryID, 'getcontents').then(function (d) {
      $scope.categoriesproducts = d;
      $ionicLoading.hide();
      console.log('categoriesproducts are :' + $scope.categoriesproducts);
    });

    /* $scope.addtoCart = function (product) {
        var increaseCount = false;
        //this is to increase number when user click the number of times

        $localStorage.cart.forEach(function (item, index) {   //checking the each product in local stroage cart with the product clicked by the user  by product id
            if (item.id == product.id) {
                item.count = item.count++;
                product.count = item.count;
                //increase the product count
                console.log(item.id + "==" + product.id);
                console.log("Cart count has been increased by" + item.count);
                increaseCount = true;
            }

        });

        if (!increaseCount) {
            product.count = 1;
            $localStorage.cart.push(product);
            //adding the product to the cart and set the count value to 1
        }

        $rootScope.cartCount = $localStorage.cart.length;


    } */

  })


  .controller('ProductsCtrl', function ($scope, DataService, $ionicLoading) {

    $scope.pagecount = 1;

    $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
    $scope.getProducts = function () {
      DataService.data('products?per_page=10&page=1', 'getcontents').then(function (d) {

        d.forEach(function (element, index) {
          element.count = 0;
        }

        )
        $scope.products = d;
        $scope.pagecount = $scope.pagecount + 1;
        $scope.allowLoadmore = true;
        $ionicLoading.hide();
      })
    }
    $scope.getProducts();


    $scope.refreshProducts = function () {
      $scope.getProducts();
      $scope.$broadcast('scroll.refreshComplete');
      // To say that refresh is done
    }

    $scope.loadMore = function () {

      $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
      

      DataService.data('products?per_page=10&page=' + $scope.pagecount, 'getcontents').then(function (d) {


        d.forEach(function (element, index) {
          element.count = 0;
          $scope.products.push(element);
          $ionicLoading.hide();
        })

        $scope.$broadcast('scroll.infiniteScrollComplete');

        if (d.length < 10) {
          $scope.allowLoadmore = false;
          console.log("there are no more products to load");
          return;

        }

        else {
          $scope.pagecount = $scope.pagecount + 1;
        }

      })


    }
  })

  .controller('ProductCtrl', function ($scope, DataService, $ionicSlideBoxDelegate, $stateParams, $localStorage, $rootScope, $ionicLoading) {

    $scope.getProducts = function () {
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
      DataService.data('products/' + $stateParams.productID, 'getcontents').then(function (d) {
        $scope.product = d;
        $scope.images = d.images;
        console.log('Image array: ' + $scope.images);
        console.log('image array list' + $scope.images.filename);
        $ionicSlideBoxDelegate.update();
        $ionicSlideBoxDelegate.loop(true);
        $ionicLoading.hide();

      })

    }
    $scope.getProducts();


    $scope.addtoCart = function (product) {

      DataService.addtocart(product);

    }

    /* $scope.addtoCart = function (product) {
       var increaseCount = false;
 
       if ($localStorage.cart !== 0)
         $localStorage.cart.forEach(function (item, index) {   //checking the each product in local stroage cart with the product clicked by the user  by product id
           if (item.id == product.id && !increaseCount) {
             item.count = item.count++;
             // product.count = item.count;
             //increase the product count
             console.log(item.id + "==" + product.id);
             console.log("Cart count has been increased by" + item.count);
             increaseCount = true;
           }
 
         });
 
       if (!increaseCount) {
         product.count = 1;
         $localStorage.cart.push(product);
         //adding the product to the cart and set the count value to 1
       }
 
       $rootScope.cartCount = $localStorage.cart.length;
 
    } */

  })

  .controller('SignUpCtrl', function ($scope, $ionicPopup, $state, DataService, $ionicLoading) {

    $scope.newUser = {};
    $scope.newUser.isValid = true;

    $scope.checkUserEmail = function (email) {

      var regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

      if (!regex.test(email)) {

        $scope.newUser.isValid = false;

        $ionicPopup.show({
          template: "<center>Invalid Email! Please Check!</center>",
          buttons: [{
            text: 'OK'
          }]
        });

        return;

      }


      DataService.data('emails?q=' + email, 'getcontents').then(function (d) {



        // $scope.receivedEmail = d.recipitent.emailAddress;

        if (d.length > 0) {

          $ionicLoading.show({ template: 'Checking in our system........<br><ion-spinner></ion-spinner>' });



          $scope.newUser.isValid = false;

          $ionicLoading.hide();


          $ionicPopup.show({
            template: "<center>EMail is already registered. Please login or use another email address.</center>",
            buttons: [{
              text: "Login",
              onTap: function (e) {
                $state.go("gmapp.login");
              }
            }, {
              text: "OK"
            }]
          })

        }
        else {
          $scope.newUser.isValid = true;
        }

      })

    }


    $scope.signUp = function (newUser) {
      var t0 = performance.now();

      $ionicLoading.show({ template: '<ion-spinner></ion-spinner><br><br>Contacting our system' });



      var customerData = {};

      customerData.customer = {

        "gender": newUser.gender,
        "firstname": newUser.first_name,
        "lastname": newUser.last_name,
        "dateOfBirth": "",
        "vatNumber": "",
        "telephone": newUser.telephone,
        "fax": "",
        "email": newUser.email,
        "password": newUser.password,
        "isGuest": false,
        "address": {

          "company": "",
          "street": newUser.street,
          "houseNumber": newUser.houseNumber,
          "additionalAddressInfo": newUser.additionalAddressInfo,
          "suburb": "",
          "postcode": newUser.postcode,
          "city": newUser.city,
          "countryId": 81,
          "zoneId": 84,
          "b2bStatus": true
        },
        "addonValues": {
          "test_key": "test_value"
        }
      }


      DataService.data('customers', 'postcontents', customerData.customer).then(function (d) {
        var t1 = performance.now();
        console.log("Time taken to create a customer is : " + (t1 - t0)/1000 + " seconds.");


        $ionicLoading.hide();

        console.log("This is the response of posted data: " + d.status);

        if (d.error != 1) {
          $ionicPopup.show({
            title: "Congratulations",
            template: "Hello " + d.lastname + "<br>Your account has been created successfully.<br>Your Customer Id is: " + d.id + "<br>Please note is down for future use.",
            buttons: [{
              text: "Login",
              type: "button-assertive",
              onTap: function (e) {
                $state.go('gmapp.login');
              }
            }]
          })
        }

        else {
          $ionicPopup.show({
            title: "OOPS",
            template: "There is error: " + d.errormsg.message,
            buttons: [{
              text: "OK",
              type: "button-assertive"
            }]
          })
        }
      }


      )
    }


  })

  .controller('LoginCtrl', function ($scope, $ionicPopup, $http, $state, DataService, $localStorage, $ionicHistory) {
    $scope.loginData = {};

    $scope.checkUserEmail = function (email) {
      console.log('Your entered email is: ' + email);

      DataService.data('customers?q=' + email, 'getcontents').then(function (d) {

        if (d.length == 0) {
          $ionicPopup.show({
            title: 'Sorry',
            template: '<center>You are not a member of our shop or Enter your correct email. </center>',
            buttons: [{
              text: 'OK',
              type: "button-assertive"
            }]
          })

        }

        else {

          console.log("The control is in else conditon: First Name is " + d[0].firstname);

          $scope.userInfo = d[0];
          $scope.rawUserInfo = d;
          console.log('Raw user info Login control');
          console.log($scope.rawUserInfo);

          console.log('Saved userinfo is: ' + $scope.userInfo);

          $ionicPopup.show({
            title: 'Hai ' + d[0].firstname + '',
            template: '<center>Please enter your lastname to Login. </center>',
            buttons: [{
              text: 'OK', type: "button-assertive"
            }]
          })
        }

      })
    }

    $scope.login = function (userData) {

      console.log("The Login data you entered is: " + userData.email + "LastName: " + userData.lastname);


      console.log("The Scope Saved data  is: " + $scope.userInfo.email + "LastName: " + $scope.userInfo.lastname);


      if ($scope.userInfo.email == userData.email && $scope.userInfo.lastname == userData.lastname) {
        $localStorage.userData = $scope.rawUserInfo;
        $ionicPopup.show({
          title: 'Welcome ' + $scope.userInfo.lastname,
          template: '<center>Login Successful</center>',
          buttons: [{
            text: 'OK',
            type: "button-assertive",
            onTap: function (e) {
              $ionicHistory.nextViewOptions({
                disableBack: true
              });
              //clean the ionic memory
              $ionicHistory.clearHistory();
              $ionicHistory.clearCache();
              $state.go('gmapp.home');
            }
          }]
        })
      }

      else {
        $ionicPopup.show({
          title: 'Sorry we can not login',
          template: '<center>Please check your Familyname</center>',
          buttons: [{
            text: 'Try again!!',
            type: "button-assertive"
          }]
        })
      }
    }

  })



  .controller('CheckoutCtrl', function (DataService, $ionicLoading, $filter, $scope, $rootScope, $state, $localStorage, $ionicHistory, $ionicPopup) {
    console.log("The user data in Checkout Control: ");
    console.log($localStorage.userData[0]);


    $scope.newOrder = {};

    $scope.paymentMethods = [
      { module: "invoice", title: "Rechnung " },
      { module: "cod", title: "Nachnahme" }

    ];

    $scope.shippingMethods = [
      { module: "dp_dp", title: "Deutsche Post" },
      { module: "hermesprops", title: "Hermes-Versand" },
      { module: "hermesprops_hermesprops", title: "Versandkostenfrei" }
    ];


    $scope.switchBillingToShipping = function () {
      console.log($scope.newOrder);
      $scope.newOrder.shipping = $scope.newOrder.billing;
    }



    $scope.getOrderid = function () {
      DataService.data('orders', 'getcontents').then(function (d) {
        $scope.LastorderItem = d[d.length - 1].id;
        $scope.dateandtime = $filter("date")(Date.now(), 'yyyy-MM-dd HH:mm:ss');
      })
    }
    $scope.getOrderid();

    console.log('The user information stored in local storage is: ');
    console.log($localStorage.userData[0]);

    $scope.getCustomeraddress = function () {
      DataService.data('addresses/' + $localStorage.userData[0].addressId, 'getcontents').then(function (d) {
        $scope.customerdbAddress = d;
        $scope.customerfinalAddress = {
          "gender": $scope.customerdbAddress.gender,
          "firstname": $scope.customerdbAddress.firstname,
          "lastname": $scope.customerdbAddress.lastname,
          "company": $scope.customerdbAddress.company,
          "street": $scope.customerdbAddress.street,
          "houseNumber": '',
          "additionalAddressInfo": '',
          "suburb": $scope.customerdbAddress.suburb,
          "postcode": $scope.customerdbAddress.postcode,
          "city": $scope.customerdbAddress.city,
          "countryId": 81,
          "zoneId": 84,
          "b2bStatus": false
        };


      })
    }
    $scope.getCustomeraddress();


    console.log('Gender outside the function is: ');
    console.log($scope.customerdbAddress);


    $scope.placeOrder = function (newOrder) {

      $ionicLoading.show({ template: 'Placing your order........<br><br><ion-spinner></ion-spinner>' });

      $scope.PaymentData = {};
      $scope.paymentMethods.forEach(function (element, index) {
        if (element.title == newOrder.paymentMethod) {
          $scope.PaymentData = element;
        }
      });

      $scope.ShippingData = {};
      $scope.shippingMethods.forEach(function (element, index) {
        if (element.title == newOrder.shippingMethod) {
          $scope.ShippingData = element;
        }
      });



      console.log('order items are: ');
      console.log();

      $scope.orderTotal = [];
      $scope.orderTotal = [{
        "id": 52,
        "title": "Zwischensumme:",
        "value": $localStorage.totalMoney,
        "valueText": $localStorage.totalMoney + ' EUR',
        "class": "ot_subtotal",
        "sortOrder": 10
      },
      {
        "id": 53,
        "title": "Summe:",
        "value": $localStorage.totalMoney,
        "valueText": $localStorage.totalMoney + ' EUR',
        "class": "ot_total",
        "sortOrder": 99
      }];

      console.log("The ordered items are: ");
      console.log($scope.orderItems);


      $scope.finalCustomerinfo = {
        "id": $localStorage.userData[0].id,
        "number": $localStorage.userData[0].number,
        "email": $localStorage.userData[0].email,
        "phone": $localStorage.userData[0].telephone,
        "vatId": $localStorage.userData[0].vatNumber,
        "status": {
          "id": $localStorage.userData[0].statusId,
          "name": "Admin",
          "image": "admin_status.gif",
          "discount": 0,
          "isGuest": $localStorage.userData[0].isGuest,
        }
      };

      $scope.orderItems = [];
      if ($localStorage.cart) {
        var i = 48;
        $localStorage.cart.forEach(function (element, index) {
          $scope.orderItems.push(

            {
              'id': element.id,
              "model": element.productModel,
              'name': element.name.de,
              'quantity': element.count,
              'price': element.price,
              'finalPrice': element.price,
              'tax': 19,
              'isTaxAllowed': true,
              'discount': element.discountAllowed,
              'shippingTimeInformation': '',
              'checkoutInformation': '',
              'quantityUnitName': '',
              'attributes': [],
              'downloadInformation': []
            }

          );
          console.log('Pushed element is: ');
          console.log($scope.orderItems);

        });
      }
      else {
        console.log("No products added");
        return;
      }





      var data = {

        "id": $scope.LastorderItem + 1,
        "statusId": 1,
        "purchaseDate": $scope.dateandtime,
        "currencyCode": "EUR",
        "languageCode": "DE",
        "totalWeight": 0.23,
        "comment": '',
        "paymentType": {
          "title": $scope.PaymentData.title,
          "module": $scope.PaymentData.module,
        },
        "shippingType": {
          "title": $scope.ShippingData.title,
          "module": $scope.ShippingData.module,
        },
        "customer": $scope.finalCustomerinfo,
        "addresses": {
          "customer": $scope.customerfinalAddress,
          "billing": {
            "gender": newOrder.billing.gender,
            "firstname": newOrder.billing.first_name,
            "lastname": newOrder.billing.last_name,
            "company": "",
            "street": newOrder.billing.street,
            "houseNumber": newOrder.billing.houseNumber,
            "additionalAddressInfo": newOrder.billing.additionalAddressInfo,
            "suburb": "",
            "postcode": newOrder.billing.postcode,
            "city": newOrder.billing.city,
            "countryId": 81,
            "zoneId": 84,
            "b2bStatus": false
          },
          "delivery": {
            "gender": newOrder.shipping.gender,
            "firstname": newOrder.shipping.first_name,
            "lastname": newOrder.shipping.last_name,
            "company": "",
            "street": newOrder.shipping.street,
            "houseNumber": newOrder.shipping.houseNumber,
            "additionalAddressInfo": newOrder.shipping.additionalAddressInfo,
            "suburb": "",
            "postcode": newOrder.shipping.postcode,
            "city": newOrder.shipping.city,
            "countryId": 81,
            "zoneId": 84,
            "b2bStatus": false
          }
        },
        "items": $scope.orderItems,
        "totals": $scope.orderTotal,
        "statusHistory": [
          {
            "id": 22,
            "statusId": 1,
            "dateAdded": $scope.dateandtime,
            "comment": "",
            "customerNotified": true
          }
        ],

        "addonValues": {
          "customerIp": "",
          "downloadAbandonmentStatus": 0,
          "serviceAbandonmentStatus": 0,
          "ccType": "",
          "ccOwner": "",
          "ccNumber": "",
          "ccExpires": "",
          "ccStart": "",
          "ccIssue": "",
          "ccCvv": "123"
        }
      };




      console.log("The final order data is: ");

      console.log(data);

      DataService.data('orders', 'postcontents', data).then(function (d) {
        $ionicLoading.hide();
        console.log('The posted order reply is: ');
        console.log(d);

        if (d.error != 1) {

          $ionicPopup.show({
            title: 'Congratulations',
            template: '<center>You order has been placed successfully. Your order number is ' + d.id + '.</center>',
            buttons: [{
              text: 'OK',
              type: 'button-assertive',
              onTap: function (e) {
                $localStorage.cart = [];
                $localStorage.productcount = [];
                $rootScope.cartCount = 0;
                $ionicHistory.nextViewOptions({
                  disableAnimate: true,
                  disableBack: true
                });
                $ionicHistory.clearHistory();
                $ionicHistory.clearCache();
                $state.go('gmapp.home');
              }
            }]
          })
        }

        else {
          $ionicPopup.show({
            title: "OOPS",
            template: "There is error: " + d.errormsg.message,
            buttons: [{
              text: "OK",
              type: "button-assertive"
            }]
          })
        }


      })




    }


  })

  .controller('OrdersCtrl', function (DataService, $ionicLoading, $filter, $scope, $rootScope, $state, $localStorage, $ionicHistory, $ionicPopup) {

    $scope.getorders = function () {
      DataService.data('orders', 'getcontents').then(function (d) {


        $scope.orders = [];
        var ordersort = d;
        ordersort.forEach(function (element, index) {

          if ($localStorage.userData[0].id == element.customerId) {
            $scope.orders.push(element);
          }

        });
        console.log($scope.orders);
        if ($scope.orders.length == 0) {
          $scope.msg = "There is no orders.";
        }
      })

    }

    $scope.getorders();

    $scope.delete = function (order) {
      var t0 = performance.now();
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
      


      DataService.data('orders/' + order.id, 'deletecontents').then(function (d) {
        var t1 = performance.now();
        console.log("T0 is:" +t0 );
        console.log("T1 is:" +t1 );
        console.log("Time taken to delete an order is: " + (t1 - t0)/1000 + " seconds."); 
        console.log("The delete order request is: ");
        console.log(d);
        $ionicLoading.hide();
        $ionicPopup.show({
          title: "Hai",
          template: '<center>' + d.errormsg.status + '<br>Your order no: ' + d.errormsg.orderId + ' is successfully Deleted</center>',
          buttons: [{
            text: "OK",
            type: "button-assertive"
          }]
        })
        $scope.getorders();
      })
    };
  })


  .controller('UpdateCtrl', function (DataService, $ionicLoading, $filter, $scope, $rootScope, $state, $localStorage, $ionicHistory, $ionicPopup) {



    $scope.getAddress = function () {
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
      
      DataService.data('addresses/' + $localStorage.userData[0].addressId, 'getcontents').then(function (d) {
        $ionicLoading.hide();
        $scope.a = [];
        $scope.a = d;
        console.log('User address is: ');
        console.log($scope.UserAddress);
      })

    };

     $scope.getAddress();

     console.log($scope.UpdateAddress);

    $scope.UpdateAddress = function (UpdateAddressdata) {
      var t0 = performance.now();
      $ionicLoading.show({ template: '<ion-spinner></ion-spinner><br>Updating' });
     
      DataService.data('addresses/' + $localStorage.userData[0].addressId, 'updatecontents', UpdateAddressdata).then(function (d, s) {
        
        var t1 = performance.now();
        console.log("Time taken to update the address is: " + (t1 - t0)/1000 + " seconds.");
        console.log($localStorage.userData[0].addressId);
        console.log(d);
        console.log(d.id);
         $ionicLoading.hide();
        if(d.id==$localStorage.userData[0].addressId)
        { 
          
          $ionicPopup.show({
          title: "Hai "+d.lastname,
          template: 'New address is:<br><br>Gender: '  + d.gender +'<br><br>firstname: ' + d.firstname + '<br><br>Street: '  + d.street +'<br><br>Pincode: '  + d.postcode +'<br><br>City: '  + d.city+'<br><br>Company: '  + d.company,
          buttons: [{
            text: "OK",
            type: "button-assertive"
          }]
        })
        $state.go('gmapp.home');
        }
        else
          {
            $ionicPopup.show({
          title: "Sorry",
          template: '<center>You did not update any field. Please correct it. </center>',
          buttons: [{
            text: "OK",
            type: "button-assertive"
          }]
        })
          }


        console.log('The address is updated: ');
        console.log(d);
        $scope.getAddress();
        
      })

    };
  })

  .controller('SearchCtrl', function (DataService, $ionicLoading, $filter, $scope, $rootScope, $state, $localStorage, $ionicHistory, $ionicPopup) {
    
     
            
    
           $scope.getproducts = function() { 
            $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });

             DataService.data('products?page=1&per_page=10', 'getcontents').then(function (d) {
              $ionicLoading.hide();
                          
              $scope.products = d;
                    })
            }
    
             $scope.getproducts();
            
    
             $scope.Search = function (s) {
                $ionicLoading.show({ template: '<ion-spinner></ion-spinner>' });
    
                console.log(s.num);
                var t0 = performance.now();

                DataService.data('products?page=1&per_page='+s.num, 'getcontents').then(function (d) {
                  $scope.products = d;
                  var t1 = performance.now();
                  console.log("time taken to get products is: " + (t1 - t0)/1000 + " seconds.")
                  $ionicLoading.hide();
                  
           })  
        }         
                })
 




  .controller('HomeCtrl', function () {

  });
