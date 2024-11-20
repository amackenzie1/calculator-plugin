jQuery(document).ready(function($) {

jQuery('.check-error').hide();
jQuery('.check-success').hide();

jQuery('body').on('change','#wsc_u_country',function(){
    var country_code = jQuery(this).val();
    var state_id = 'wsc_u_province';
    show_state_list(country_code, state_id);
});
jQuery('body').on('change','#wsc_country',function(){
    var country_code = jQuery(this).val();
    var state_id = 'wsc_province';
    show_state_list(country_code, state_id);
});

jQuery(document.body).on('keyup','#wsc_card_number',function(){
    this.value = this.value.replace(/[^0-9]/g,'').replace(/(.{4})/g, '$1 ').trim();
});
jQuery(document.body).on('keyup','#wsc_card_Name',function(){
    this.value = this.value.replace(/[^a-zA-Z ]/g,'');
});
jQuery(document.body).on('keyup','#wsc_cvv',function(){
    this.value = this.value.replace(/[^^0-9]/g,'');
});

function formatString(e) {
    var inputChar = String.fromCharCode(event.keyCode);
    var code = event.keyCode;
    var allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
        return;
    }

    event.target.value = event.target.value.replace(
        /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
    ).replace(
        /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
    ).replace(
        /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
    ).replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
    ).replace(
        /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
    ).replace(
        /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
    ).replace(
        /\/\//g, '/' // Prevent entering more than 1 `/`
     );
}

    jQuery('#wsc_card_expiry').on('click keyup', function(e) {
        e.preventDefault();
        formatString(e);
    });

  jQuery('.btIconWidgetText').on('click', function(e) {
    e.preventDefault();
   jQuery('.modal').toggleClass('is-visible');
  });

  jQuery(".signup-display").click(function(){
    jQuery(".response-error").html("");
    jQuery(".wsc-login-form").hide();
    jQuery(".wsc-forgot-form").hide();
    jQuery(".wsc-registration-form").show();
  });

  jQuery(".login-display").click(function(){
    jQuery(".response-error").html("");
    jQuery(".wsc-registration-form").hide();
    jQuery(".wsc-forgot-form").hide();
    jQuery(".wsc-login-form").show();
  });

  jQuery(".forgot-psw-display").click(function(){
    jQuery(".response-error").html("");
    jQuery(".wsc-registration-form").hide();
    jQuery(".wsc-login-form").hide();
    jQuery(".wsc-forgot-form").show();
  });

  //var $form = $("#ma_custom_signup"),
  //$successMsg = $(".indicator");
  $.validator.addMethod("letters", function(value, element) {
    return this.optional(element) || value == value.match(/^[a-zA-Z\s]*$/);
  });
  $.validator.addMethod("pwcheck", function(value) {
     return /^[A-Za-z0-9\d=!\-@._*]*$/.test(value) // consists of only these
         && /[a-z]/.test(value) // has a lowercase letter
         && /\d/.test(value) // has a digit
  });


    /* Simple AJAX start */
    jQuery('#wsc_g_recaptcha_error').hide();
    jQuery('#wsc-new-user-btn').click(function (evt) {        
        var grecaptcha_response = grecaptcha.getResponse();
        if(grecaptcha_response.length == 0) 
        { 
            evt.preventDefault();
            jQuery('#wsc_g_recaptcha_error').show();
            return false;            
        }else{
            jQuery('#wsc_g_recaptcha').val(grecaptcha_response);
            jQuery('#wsc_g_recaptcha_error').hide();
        }        
    });
    
    jQuery("#wsc_custom_signup").validate({
        rules: {
          wsc_first_name: {
                required: true,
                minlength: 3,
                letters: true
            },
            wsc_last_name: {
                required: true,
                minlength: 3,
                letters: true
            },
            wsc_email: {
                required: true,
                email: true
            },
            wsc_pass: {
                required: true,
                minlength: 4,
                //pwcheck: true,
            },
            wsc_confirm_pass: {
                required: true,
                minlength: 4,
                equalTo: "#wsc_pass"
            },
        },
        messages: {
            wsc_first_name: "First name required.",
            wsc_last_name: "Last name required.",
            wsc_email: "Email required.",
            wsc_pass: "Password required.",
            wsc_confirm_pass: "Confirm password does not match.",
        },
        submitHandler: function(form) {
        }
    });

    jQuery('#wsc-new-user-btn').click(function () {
        if (jQuery("#wsc_custom_signup").valid()) {
            // alert('valid');
            var wsc_reg_nonce = $('#wsc_new_user_nonce').val();
            var wsc_first_name  = $('#wsc_first_name').val();
            var wsc_last_name  = $('#wsc_last_name').val();
            var wsc_email  = $('#wsc_email').val();
            var wsc_pass  = $('#wsc_pass').val();
            var wsc_plan_sec  = $('#wsc_plan_sec').val();
            var wsc_auto = $('#wsc_auto').val();

            data = {
                'action': 'wsc_register_user',
                'wsc_reg_nonce': wsc_reg_nonce,
                'wsc_first_name': wsc_first_name,
                'wsc_last_name': wsc_last_name,
                'wsc_email': wsc_email,
                'wsc_pass': wsc_pass,
                'wsc_plan_sec': wsc_plan_sec,
                'wsc_auto' : wsc_auto,
            };

            jQuery.ajax({
                url: wsc_custom_vars.wsc_ajax_url,
                type: 'POST',
                data: data, 
                beforeSend: function() {
                  //jQuery('.submit-loader').show();
                },
                success: function (res) {                    
                  var response = JSON.parse(res);
                  if( response.success ) {  
                 
                    location.href = "/checkout";
                  } else {
                    // alert('error');                    
                  }
                },
                complete: function() { 
            
                }
                          
            });
        }
    });

    //jQuery('body').on('change','#wsc_plan_sec',function(){
       
        //alert('ddsff');
        /*var wsc_plan_sec = jQuery(this).val();
        var data1 = {
                    action: 'wsc_register_user',
                    product_id: wsc_plan_sec
        };
        //console.log(data1);
        jQuery.ajax({
            url: wsc_custom_vars.wsc_ajax_url,
            type: 'POST',
            data: data1, 
        });*/
    //});

    /* Simple AJAX end */

  jQuery.validator.addMethod("creditcardtypes", function(value, element, param) {
    if (/[^0-9-]+/.test(value)) {
        return false;
    }

    value = value.replace(/\D/g, "");

    var validTypes = 0x0000;

    if (param.mastercard)
        validTypes |= 0x0001;
    if (param.visa)
        validTypes |= 0x0002;

    if (validTypes & 0x0001 && /^(5[12345])/.test(value)) { //mastercard
        return value.length == 16;
    }
    if (validTypes & 0x0002 && /^(4)/.test(value)) { //visa
        return value.length == 16;
    }
    return false;
}, "Please enter a valid credit card number.");

  

  // WSC Login User Ajax
  $("#wsc_custom_login").validate({
    rules: {
      wsc_login_name: {
        required: true,
      },
      wsc_login_pass: {
        required: true,
      }
    },
    messages: {
      wsc_login_name: "Username Or Email is required",
      wsc_login_pass: "Password is required",
    },
    submitHandler: function() {
      jQuery(".wsc_msg").hide();      
      jQuery('.check-error').hide();
      jQuery('.check-success').hide();
      
      var wsc_login_nonce = $('#wsc_login_user_nonce').val();
      var wsc_login_name  = $('#wsc_login_name').val();
      var wsc_login_pass  = $('#wsc_login_pass').val();
      
      data = {
        action: 'wsc_login_user',
        wsc_login_nonce: wsc_login_nonce,
        wsc_login_name: wsc_login_name,
        wsc_login_pass: wsc_login_pass,
      };

      jQuery.ajax({
        url: wsc_custom_vars.wsc_ajax_url,
        type: 'POST',
        data: data, 
        beforeSend: function() {
          //jQuery('.submit-loader').show();
        },
        success: function (res) {
          var response = JSON.parse(res);
          if( response.success ) { 
            jQuery("#wsc_login_register_model").find(".login-check-success").show().html(response.message);
            window.location.reload();
          } else {
            jQuery("#wsc_login_register_model").find(".login-check-error").show().html(response.message);
            
          }
        },
        complete: function() {         
        }
      }); 
    }
  });

  // WSC Forgot User Ajax
  $("#wsc_custom_forgot").validate({
     rules: {
      wsc_forgot_email: {
        required: true,
        email: true
      }
    },
    messages: {
       wsc_forgot_email: "Please Enter a Valid Email Id",
    },

    submitHandler: function() {
      jQuery(".wsc_msg").hide();
      jQuery('.check-error').hide();
      jQuery('.check-success').hide();
      var wsc_forgot_nonce = $('#wsc_forgot_user_nonce').val();
      var wsc_forgot_email  = $('#wsc_forgot_email').val();
      
      data = {
        action: 'wsc_forgot_user',
        wsc_forgot_nonce: wsc_forgot_nonce,
        wsc_forgot_email: wsc_forgot_email,
      };

      jQuery.ajax({
        url: wsc_custom_vars.wsc_ajax_url,
        type: 'POST',
        data: data, 
        beforeSend: function() {
           ///jQuery('.submit-loader').show();
        },
        success: function (res) {
           var response = JSON.parse(res);
          if( response.success ) { 
            jQuery("#wsc_login_register_model").find(".forgot-check-success").show().html(response.message);
            setTimeout(function(){ window.location.reload(); }, 5000);
          } else {
            jQuery("#wsc_login_register_model").find(".forgot-check-error").show().html(response.message);
          } 
        },
        complete: function() { 
           //jQuery('.submit-loader').hide();
        }
      }); 
    }
  });



  // WSC reset password User Ajax
  $("#wsc_reset_password_frm").validate({
     rules: {
      wsc_new_password: {
        required: true,
        minlength: 8,
        pwcheck: true,
      },
      wsc_cnfrmnew_password: {
        required: true,
        minlength: 8,
        equalTo: "#wsc_new_password"
      },
    },
    messages: {
      wsc_new_password: "Please Enter a Password",
      wsc_cnfrmnew_password: "Password and Confirm Password dosn't Match",
    },

       submitHandler: function() {
      jQuery(".wsc_msg").hide();
      // jQuery('.check-error').hide();
      // jQuery('.check-success').hide();
      var wsc_reset_password_nonce = $('#wsc_reset_password_nonce').val();
      var wsc_new_password  = $('#wsc_new_password').val();
      var user_login  = $('#user_login').val();
      
      data = {
        action: 'wsc_reset_password_user',
        wsc_reset_password_nonce: wsc_reset_password_nonce,
        wsc_new_password: wsc_new_password,
        user_login: user_login,
      };

      jQuery.ajax({
        url: wsc_custom_vars.wsc_ajax_url,
        type: 'POST',
        data: data, 
        beforeSend: function() {
          //jQuery('.submit-loader').show();
        },
        success: function (res) {
          var response = JSON.parse(res);
          if( response.success ) { 
            jQuery("#wsc_login_register_model").find(".response-check-success").show().html(response.message);
          } else {
            jQuery("#wsc_login_register_model").find(".response-check-error").show().html(response.message);
          }
        },
        complete: function() { 
          //jQuery('.submit-loader').hide();
          jQuery('#wsc_reset_password_frm')[0].reset();        
          setTimeout(function(){ 
            jQuery('.response-check-error').html("");
            document.location.href=window.location.origin; 
          }, 5000);
          
        }
      }); 
    }
  });



/*var url_string = location.href;
var url = new URL(url_string);  
var c = url.searchParams.get("action");
if(c=='rp'){
  jQuery('#wsc_login_register_model').trigger("click");
  console.log("rp");
  
}*/


var locationValue = (new URL(location.href)).searchParams.get('action');

if(locationValue =='rp'){
      jQuery("#wsc_login_register_model").show();
      jQuery(".wsc-reset-password").show();
      jQuery(".wsc-login-form").hide();
      jQuery(".wsc-forgot-form").hide();
      jQuery(".wsc-registration-form").hide();
}

jQuery(".action-btns").click(function(){
  //console.log('trigger');
    jQuery("#wsc_login_register_model").show();
    if(jQuery(this).data('form')=='login'){
      jQuery(".wsc-login-form").show();
      jQuery(".wsc-registration-form").hide();
      jQuery(".wsc-forgot-form").hide();
      jQuery(".wsc-reset-password").hide();
    }
    if(jQuery(this).data('form')=='register'){
      jQuery(".wsc-login-form").hide();
      jQuery(".wsc-forgot-form").hide();
      jQuery(".wsc-reset-password").hide();
      jQuery(".wsc-registration-form").show();
    }

    
});

jQuery(".close").click(function(){
  jQuery("#wsc_login_register_model").hide();
});


  // Get the modal
var modal = document.getElementById("wsc_login_register_model");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

});

function show_state_list(country_code, state_id){    
    jQuery( ".response-loader" ).remove();
    jQuery('#'+state_id).after('<div class="submit-loader response-loader" style="display: none;"></div>');
    
    data = {
        action: 'wsc_list_states',
        country_code: country_code,
    };
    jQuery.ajax({
        url: wsc_custom_vars.wsc_ajax_url,
        type: 'POST',
        data: data, 
        beforeSend: function() {
          jQuery('.response-loader').show();
        },
        success: function (res) {
            jQuery('.response-loader').remove();
            jQuery("#"+state_id).html(res);
        }
      }); 
}

var verifyCallback = function(response) {
    console.log('response-error');
    alert(response);
};



/*---------------------03-01-23 meet----------------------*/
// jQuery(document).ready(function($) {
//     jQuery(".action-btns-new").click(function(){
//         console.log("hello meet");
//         data = {
//             action: 'wsc_checkout_register_fun',
//             productID: '3231',
//         };
//         jQuery.ajax({
//             url: wsc_custom_vars.wsc_ajax_url,
//             type: 'POST',
//             data: data, 
//             // beforeSend: function() {
//             //   jQuery('.response-loader').show();
//             // },
//             success: function (res) {
//                 //jQuery('.response-loader').remove();
//                 console.log(res.success );
//                 //if( res.success ) { 
                   
//                     setInterval(function () {
//                         jQuery("#wsc_checkout_register_model").show();
//                     },3000);
//                 //}
//             }
//         }); 
//     });


//     jQuery('body').on('click','#registermyBtn',function(e){
//         e.preventDefault();
//         data = {
//             action: 'wsc_add_product_cart',
//             product_id: 3232,
//         };
//         jQuery.ajax({
//             url: wsc_custom_vars.wsc_ajax_url,
//             type: 'POST',
//             data: data, 
//             beforeSend: function() {
//                 jQuery('.response-loader').show();
//             },
//             success: function (res) {
//                 jQuery("#wsc_login_register_model").find(".modal-content").html( res.data.html ); 
//             }
//         }); 
//     });
// });
/*--------------------------------------------------------*/


