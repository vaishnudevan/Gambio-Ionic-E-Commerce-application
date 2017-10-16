angular.module('starter.services',['ionic'])


.factory('DataService', function($http, $localStorage, $rootScope, $ionicPopup) {
  var requestService = {

    data: function(reqparams, reqtype, reqcontent) {


        var urlBase = 'http://gm.vaishnudevan.de/test-2.php';

        
        console.log("request parameter in factory: " + reqparams);

        var con = {
      requrl: reqparams, reqtype: reqtype, reqcon:reqcontent
    };
      
      var temp = $http.post(urlBase, con).then(function (response) {
        
        console.log(response);
        
        return response.data;
      });
      
      return temp;
    }, 

    addtocart: function (product) {
      var increaseCount = false;
      
        $localStorage.cart.forEach(function (item, index) {   //checking the each product in local stroage cart with the product clicked by the user  by product id
          if (item.id == product.id && !increaseCount) {

            console.log('Product count: '+ product.count);
            console.log('Item Count count: '+ item.count);
            //item.count = item.count++;
           // product.count = 1;
            item.count = product.count;
             item.count += 1;
            product.count=item.count;
            increaseCount = true;
           
                        if( item.count<=50){
                          $ionicPopup.show({
                            title: "Hai,",
                            template: '<center>There product is added '+item.count+' times</center>',
                            buttons: [{
                              text: "OK",
                              type: "button-assertive"
                            }]
                          })
                      }
                      else  
                        {
                          $ionicPopup.show({
                            title: "OOPS",
                            template: '<center>You can not order more than 50 items <br> or<br> Please give a valid number.<center>',
                            buttons: [{
                              text: "OK",
                              type: "button-assertive"
                            }]
                          })
                            
                        }
            console.log(item.id + "==" + product.id);
            console.log("Cart count has been increased by" + item.count);
            
          }

         } );

     if (!increaseCount) {
        
       

        product.count = 1;

        $localStorage.cart.push(product);
        //adding the product to the cart and set the count value to 1
      } 

      $rootScope.cartCount = $localStorage.cart.length;

      return;


    }

  };
  return requestService;
});