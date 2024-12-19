"use strict";

/**
 * All of the code for your public-facing JavaScript source
 * should reside in this file.
 *
 * Note: It has been assumed you will write $ code here, so the
 * $ function reference has been prepared for usage within the scope
 * of this function.
 *
 * This enables you to define handlers, for when the DOM is ready:
 *
 * $(function() {
 *
 * });
 *
 * When the window is loaded:
 *
 * $( window ).load(function() {
 *
 * });
 *
 * ...and/or other possibilities.
 *
 * Ideally, it is not considered best practise to attach more than a
 * single DOM-ready or window-load handler for a particular page.
 * Although scripts in the WordPress core, Plugins and Themes may be
 * practising this, we should strive to set a better example in our own work.
 */

let chartTest;

window.addEventListener("beforeunload", function (event) {
    sessionStorage.setItem("isRefreshed", "true");
});

var wsc_remove_storage_data = wsc_cal_local_st_var.wsc_remove_storage_data; // This value stores the account status. 0 means user is premium.
var isfreemium = wsc_remove_storage_data != "0";
var user_step_data = isfreemium ? "all_step_data_free" : "all_step_data";

jQuery(document).ready(function ($) {
  /* clear local storage data if exist for non active member start*/

  if (wsc_remove_storage_data != "0") {
    if (sessionStorage.getItem("isRefreshed")) {
      sessionStorage.removeItem("isRefreshed");
  } else {
      localStorage.removeItem(user_step_data);
  }
    // localStorage.removeItem('all_step_data');
    jQuery("#msform").find("input:text").val("");
  }

  /* clear local storage data if exist for non active member end */

  var stored_data_get = localStorage.getItem(user_step_data);

  /* get data from DB if local storage emptu for user start */

  if (stored_data_get == null) {
    var wsc_user_all_step_calc_form_data = wsc_cal_local_st_var.wsc_user_all_step_calc_form_data;

    if (wsc_user_all_step_calc_form_data) {
      localStorage.setItem(user_step_data, JSON.stringify(wsc_user_all_step_calc_form_data));

      stored_data_get = localStorage.getItem(user_step_data);
    }
  }

  /* get data from DB if local storage emptu for user end */

  var stored_json_obj = jQuery.parseJSON(stored_data_get);
  //console.log(stored_data_get);
  if (stored_data_get) {
    var all_step_data_json_parse = JSON.parse(localStorage.getItem(user_step_data));

    if (stored_json_obj.step_1) {
      set_field_value(stored_json_obj.step_1);

      var est_with_spouse_loc_stor_val = all_step_data_json_parse.step_1.est_with_spouse;
      if (est_with_spouse_loc_stor_val == "yes") {
        jQuery("#step1-tglr").addClass("active");
        jQuery("#est_with_spouse").val("yes");
        jQuery("#show-field").show();
        jQuery("#show-field01").show();
        jQuery("#show-field02").show();
        jQuery(".spouse-hide-class").show();
        jQuery("#cb_value").prop("checked", "checked");
      }
    }
    if (stored_json_obj.step_2) {
      set_field_value(stored_json_obj.step_2);

      var wsc_own_ror = all_step_data_json_parse.step_2.wsc_own_ror;

      if (wsc_own_ror == "yes") {
        $("#step2-tglr").addClass("active");
        $(".sp-show-field").show();
        $("#wsc_own_ror").val("yes");
      }
    }
    if (stored_json_obj.step_2) {
      set_field_value(stored_json_obj.step_2);
    }
    if (stored_json_obj.step_3) {
      set_field_value(stored_json_obj.step_3);

      /* display other income add more data on load if filled start */

      var other_income_loc_stor_val = all_step_data_json_parse.step_3.other_income;
      var other_spouse_income_loc_stor_val = all_step_data_json_parse.step_3.other_spouse_income;
      var other_date_loc_stor_val = all_step_data_json_parse.step_3.other_date;
      var other_spouse_date_loc_stor_val = all_step_data_json_parse.step_3.other_spouse_date;

      var other_income_loc_stor_val_count = other_income_loc_stor_val.length;
      var other_spouse_income_loc_stor_val_count = other_spouse_income_loc_stor_val.length;
      var other_date_loc_stor_val_count = other_date_loc_stor_val.length;
      var other_spouse_date_loc_stor_val_count = other_spouse_date_loc_stor_val.length;

      let uiw_max_record_counts = [other_income_loc_stor_val_count, other_spouse_income_loc_stor_val_count, other_date_loc_stor_val_count, other_spouse_date_loc_stor_val_count];

      var max_rec_oth_inc = Math.max.apply(Math, uiw_max_record_counts);

      if (other_income_loc_stor_val_count < max_rec_oth_inc) {
        for (var i = other_income_loc_stor_val_count; i <= max_rec_oth_inc; i++) {
          other_income_loc_stor_val.push("");
        }
      }

      if (other_spouse_income_loc_stor_val_count < max_rec_oth_inc) {
        for (var i = other_spouse_income_loc_stor_val_count; i <= max_rec_oth_inc; i++) {
          other_spouse_income_loc_stor_val.push("");
        }
      }

      if (other_date_loc_stor_val_count < max_rec_oth_inc) {
        for (var i = other_date_loc_stor_val_count; i <= max_rec_oth_inc; i++) {
          other_date_loc_stor_val.push("");
        }
      }

      if (other_spouse_date_loc_stor_val_count < max_rec_oth_inc) {
        for (var i = other_spouse_date_loc_stor_val_count; i <= max_rec_oth_inc; i++) {
          other_spouse_date_loc_stor_val.push("");
        }
      }

      var wrapper = jQuery(".new-add-more-field");

      if (!jQuery.isEmptyObject(other_income_loc_stor_val) && other_income_loc_stor_val.length > 1) {
        for (var i = 1; i < max_rec_oth_inc; i++) {
          var other_income_loc_stor_val_rec = other_income_loc_stor_val[i] != null ? other_income_loc_stor_val[i] : "";
          var other_income_sp_loc_stor_val_rec = other_spouse_income_loc_stor_val[i] != null ? other_spouse_income_loc_stor_val[i] : "";
          var other_date_loc_stor_val_rec = other_date_loc_stor_val[i] != null ? other_date_loc_stor_val[i] : "";
          var other_date_sp_loc_stor_val_rec = other_spouse_date_loc_stor_val[i] != null ? other_spouse_date_loc_stor_val[i] : "";

          var data_input = "'mask': '9999-9999'";

          jQuery(wrapper).append(
            '<div class="other-income-add"><div class="wisely-form-row bg-grey"> <div class="wisely-form-column01"> <label class="fieldlabels">Are you expecting any other income (before tax)??</label> </div><div class="wisely-form-column02"> <div class="input_fields_wrap"> <div> <input type="text" class="number_custom" placeholder="$" id="other_income" name="other_income[]" value="' +
              other_income_loc_stor_val_rec +
              '"/> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="input_fields_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="other_spouse_income[]" id="other_spouse_income"  value="' +
              other_income_sp_loc_stor_val_rec +
              '" /> </div></div></div></div><div class="wisely-form-row bg-white"> <div class="wisely-form-column01"> <label class="fieldlabels">When will you receive this other income?</label> </div><div class="wisely-form-column02"> <div class="date_wrap"> <div> <input type="text" class="other_date" id="other_date" name="other_date[]" data-inputmask="' +
              data_input +
              '" placeholder="Year to Year"  value="' +
              other_date_loc_stor_val_rec +
              '"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="date_wrap"> <div> <input type="text" data-inputmask="' +
              data_input +
              '" placeholder="Year to Year" class="other_spouse_date" id="other_spouse_date" name="other_spouse_date[]"  value="' +
              other_date_sp_loc_stor_val_rec +
              '"> </div></div></div></div><a href="#" class="date_remove"><span>Remove</span><i class="fa-light fa-trash"></i></a></div>'
          ); //add input box
        }

        jQuery(".other-income-add .other_date").mask("9999-9999");
        jQuery(".other-income-add .other_spouse_date").mask("9999-9999");

        jQuery(".number_custom").on("input", function () {
          formatInputValue(this);
        });
      }

      /* display other income add more data on load if filled end */
    }
    if (stored_json_obj.step_4) {
      set_field_value(stored_json_obj.step_4);

      var start_rec_pay_cpp_qpp_loc_stor_val = all_step_data_json_parse.step_4.start_rec_pay_cpp_qpp;

      var start_rec_pay_cpp_qpp_spouse_loc_stor_val = all_step_data_json_parse.step_4.start_rec_pay_cpp_qpp_spouse;

      var start_OAS_pay_loc_stor_val = all_step_data_json_parse.step_4.start_OAS_pay;

      var start_OAS_pay_spouse_loc_stor_val = all_step_data_json_parse.step_4.start_OAS_pay_spouse;

      var start_def_ben_pens_loc_stor_val = all_step_data_json_parse.step_4.start_def_ben_pens;
      var start_def_ben_pens_spouse_loc_stor_val = all_step_data_json_parse.step_4.start_def_ben_pens_spouse;

      var indexed_to_inflatiton_loc_stor_val = all_step_data_json_parse.step_4.indexed_to_inflatiton;
      var indexed_to_inflatiton_spouse_loc_stor_val = all_step_data_json_parse.step_4.indexed_to_inflatiton_spouse;

      if (start_rec_pay_cpp_qpp_loc_stor_val == "yes") {
        jQuery("#step3-tglr").addClass("active");

        let activeClass12 = jQuery("#step12-tglr").hasClass("active");
        if (activeClass12) {
          $(".spouse-pay-show-field").hide();
        }
        $(".pension-age-first").hide();

        $("#start_rec_pay_cpp_qpp").val("yes");
      }

      if (start_rec_pay_cpp_qpp_spouse_loc_stor_val == "yes") {
        jQuery("#step12-tglr").addClass("active");
        $(".pension-age-second").addClass("hidden");
        let activeClass3 = jQuery("#step3-tglr").hasClass("active");

        if (activeClass3) {
          $(".spouse-pay-show-field").hide();
        }

        $(".pension-age-second").hide();

        $("#start_rec_pay_cpp_qpp_spouse").val("yes");
      }

      if (start_OAS_pay_loc_stor_val == "yes") {
        jQuery("#step4-tglr").addClass("active");

        let activeClass13 = jQuery("#step13-tglr").hasClass("active");

        if (activeClass13) {
          $(".security-pay-show-field").hide();
        }

        $(".security-age-first").hide();
        $("#start_OAS_pay").val("yes");
      }

      if (start_OAS_pay_spouse_loc_stor_val == "yes") {
        jQuery("#step13-tglr").addClass("active");
        $(".security-age-second").addClass("hidden");
        let activeClass4 = jQuery("#step4-tglr").hasClass("active");

        if (activeClass4) {
          $(".security-pay-show-field").hide();
        }

        $(".security-age-second").hide();
        $("#start_OAS_pay_spouse").val("yes");
      }

      if (start_def_ben_pens_loc_stor_val == "yes") {
        jQuery("#step5-tglr").addClass("active");

        let activeClass15 = jQuery("#step15-tglr").hasClass("active");

        if (activeClass15) {
          $(".benifit-pay-show-field").hide();
        }

        $(".benifit-age-first").hide();
        $("#start_def_ben_pens").val("yes");
      }

      if (start_def_ben_pens_spouse_loc_stor_val == "yes") {
        jQuery("#step15-tglr").addClass("active");
        $(".benifit-age-second").addClass("hidden");
        let activeClass5 = jQuery("#step5-tglr").hasClass("active");

        if (activeClass5) {
          $(".benifit-pay-show-field").hide();
        }

        $(".benifit-age-second").hide();
        $("#start_def_ben_pens_spouse").val("yes");
      }

      if (indexed_to_inflatiton_loc_stor_val == "yes") {
        $("#step6-tglr").addClass("active");
        $("#index-show-field").show();
        $("#indexed_to_inflatiton").val("yes");
      }

      if (indexed_to_inflatiton_spouse_loc_stor_val == "yes") {
        $("#step17-tglr").addClass("active");
        $("#spouse-index-show-field").show();
        $("#indexed_to_inflatiton_spouse").val("yes");
      }
    }
    if (stored_json_obj.step_5) {
      set_field_value(stored_json_obj.step_5);

      /* other assets unlimied account if already filled  start  */

      var account_main_loc_stor_val = all_step_data_json_parse.step_5.account_main;
      var spouse_main_loc_stor_val = all_step_data_json_parse.step_5.spouse_main;
      var account_value_loc_stor_val = all_step_data_json_parse.step_5.account_value;
      var spouse_value_loc_stor_val = all_step_data_json_parse.step_5.spouse_value;

      var account_main_loc_stor_val_count = account_main_loc_stor_val.length;
      var spouse_main_loc_stor_val_count = spouse_main_loc_stor_val.length;
      var account_value_loc_stor_val_count = account_value_loc_stor_val.length;
      var spouse_value_loc_stor_val_count = spouse_value_loc_stor_val.length;

      let uiw_max_main_account_record_arr = [account_main_loc_stor_val_count, spouse_main_loc_stor_val_count];

      var uix_max_main_acc_count = Math.max.apply(Math, uiw_max_main_account_record_arr);

      if (account_main_loc_stor_val_count < uix_max_main_acc_count) {
        for (var i = account_main_loc_stor_val_count; i <= uix_max_main_acc_count; i++) {
          account_main_loc_stor_val.push("");
        }
      }

      if (spouse_main_loc_stor_val_count < uix_max_main_acc_count) {
        for (var i = spouse_main_loc_stor_val_count; i <= uix_max_main_acc_count; i++) {
          spouse_main_loc_stor_val_count.push("");
        }
      }

      if (account_value_loc_stor_val_count < uix_max_main_acc_count) {
        for (var i = account_value_loc_stor_val_count; i <= uix_max_main_acc_count; i++) {
          account_value_loc_stor_val.push("");
        }
      }

      if (spouse_value_loc_stor_val_count < uix_max_main_acc_count) {
        for (var i = spouse_value_loc_stor_val_count; i <= uix_max_main_acc_count; i++) {
          spouse_value_loc_stor_val.push("");
        }
      }

      var spouse_account_wrapper = jQuery(".select-account-field"); //Fields wrapper
      var spouse_account_add_button = jQuery(".add_spouse_button"); //Add button ID

      if (!jQuery.isEmptyObject(account_main_loc_stor_val) && account_main_loc_stor_val.length > 1) {
        for (var i = 1; i < uix_max_main_acc_count; i++) {
          var account_main_loc_stor_val_rec = account_main_loc_stor_val[i] != null ? account_main_loc_stor_val[i] : "";
          var spouse_main_loc_stor_val_rec = spouse_main_loc_stor_val[i] != null ? spouse_main_loc_stor_val[i] : "";
          var account_value_loc_stor_val_rec = account_value_loc_stor_val[i] != null ? account_value_loc_stor_val[i] : "";
          var spouse_value_loc_stor_val_rec = spouse_value_loc_stor_val[i] != null ? spouse_value_loc_stor_val[i] : "";

          var acc_main_sel_TFSA = account_main_loc_stor_val_rec == "TFSA" ? '<option value="TFSA" selected="selected">TFSA</option>' : '<option value="TFSA">TFSA</option>';
          var acc_main_sel_RRSP = account_main_loc_stor_val_rec == "RRSP" ? '<option value="RRSP" selected="selected">RRSP</option>' : '<option value="RRSP">RRSP</option>';
          var acc_main_sel_RRIF = account_main_loc_stor_val_rec == "RRIF" ? '<option value="RRIF" selected="selected">RRIF</option>' : '<option value="RRIF">RRIF</option>';
          var acc_main_sel_LIRA = account_main_loc_stor_val_rec == "LIRA" ? '<option value="LIRA" selected="selected">LIRA</option>' : '<option value="LIRA">LIRA</option>';
          var acc_main_sel_LIF = account_main_loc_stor_val_rec == "LIF" ? '<option value="LIF" selected="selected">LIF</option>' : '<option value="LIF">LIF</option>';

          var spo_main_sel_TFSA = spouse_main_loc_stor_val_rec == "TFSA" ? '<option value="TFSA" selected="selected">TFSA</option>' : '<option value="TFSA">TFSA</option>';
          var spo_main_sel_RRSP = spouse_main_loc_stor_val_rec == "RRSP" ? '<option value="RRSP" selected="selected">RRSP</option>' : '<option value="RRSP">RRSP</option>';
          var spo_main_sel_RRIF = spouse_main_loc_stor_val_rec == "RRIF" ? '<option value="RRIF" selected="selected">RRIF</option>' : '<option value="RRIF">RRIF</option>';
          var spo_main_sel_LIRA = spouse_main_loc_stor_val_rec == "LIRA" ? '<option value="LIRA" selected="selected">LIRA</option>' : '<option value="LIRA">LIRA</option>';
          var spo_main_sel_LIF = spouse_main_loc_stor_val_rec == "LIF" ? '<option value="LIF" selected="selected">LIF</option>' : '<option value="LIF">LIF</option>';

          jQuery(spouse_account_wrapper).append(
            '<div class="other-account-add"><div class="wisely-form-row bg-grey"> <div class="wisely-form-column01"> <label>Please select any account(s) you have?</label> </div><div class="wisely-form-column02"> <div class="account_wrap"> <div> <select class="account_main" id="account_main" name="account_main"> <option value="">Please select</option>' +
              acc_main_sel_TFSA +
              acc_main_sel_RRSP +
              acc_main_sel_RRIF +
              acc_main_sel_LIRA +
              acc_main_sel_LIF +
              '</select> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="account_wrap"> <div> <select class="spouse_main" id="spouse_main" name="spouse_main"> <option value="">Please select</option> ' +
              spo_main_sel_TFSA +
              spo_main_sel_RRSP +
              spo_main_sel_RRIF +
              spo_main_sel_LIRA +
              spo_main_sel_LIF +
              '</select> </div></div></div></div><div class="wisely-form-row bg-white"> <div class="wisely-form-column01"> <label>What is the current value in this account?</label> </div><div class="wisely-form-column02"> <div class="spouse_account_wrap"> <div> <input type="text" class="number_custom" placeholder="$" id="account_value" name="account_value[]" value="' +
              account_value_loc_stor_val_rec +
              '"/> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="spouse_account_wrap"> <div> <input type="text" class="number_custom" placeholder="$" id="spouse_value" name="spouse_value[]" value="' +
              spouse_value_loc_stor_val_rec +
              '"/> </div></div></div></div><a href="#" class="spouse_account_remove"><span>Remove</span><i class="fa-light fa-trash"></i></a></div>'
          );
        }
      }

      /* other assets unlimied account if already filled end */
    }
    if (stored_json_obj.step_6) {
      set_field_value(stored_json_obj.step_6);

      var wsc_sell_home_future_loc_stor_val = all_step_data_json_parse.step_6.wsc_sell_home_future;

      if (wsc_sell_home_future_loc_stor_val == "yes") {
        $("#step7-tglr").addClass("active");
        $("#plan-show-field").show();
        $("#wsc_sell_home_future").val("yes");
      }
    }
    if (stored_json_obj.step_7) {
      set_field_value(stored_json_obj.step_7);

      var expe_each_stage_ret_loc_stor_val = all_step_data_json_parse.step_7.expe_each_stage_ret;
      var expe_each_stage_ret_spouse_loc_stor_val = all_step_data_json_parse.step_7.expe_each_stage_ret_spouse;

      if (expe_each_stage_ret_loc_stor_val == "yes") {
        jQuery("#step8-tglr").addClass("active");
        $(".expense-amounts-hide").show();
        $(".retirement-first").show();
        $("#expe_each_stage_ret").val("yes");
      }

      if (expe_each_stage_ret_spouse_loc_stor_val == "yes") {
        $("#step16-tglr").addClass("active");
        $(".expense-amounts-hide").show();
        $(".retirement-second").show();
        $("#expe_each_stage_ret_spouse").val("yes");
      }
    }
    if (stored_json_obj.step_8) {
      set_field_value(stored_json_obj.step_8);

      /* display other one off expense add more data on load if filled start */

      var expense_type_main_val_loc_stor_val = all_step_data_json_parse.step_8.expense_type_main_val;
      var expense_type_spouse_val_loc_stor_val = all_step_data_json_parse.step_8.expense_type_spouse_val;
      var oneoff_expense_main_loc_stor_val = all_step_data_json_parse.step_8.oneoff_expense_main;
      var oneoff_expense_spouse_loc_stor_val = all_step_data_json_parse.step_8.oneoff_expense_spouse;

      var expense_type_main_val_loc_stor_val_count = expense_type_main_val_loc_stor_val.length;
      var expense_type_spouse_val_loc_stor_val_count = expense_type_spouse_val_loc_stor_val.length;
      var oneoff_expense_main_loc_stor_val_count = oneoff_expense_main_loc_stor_val.length;
      var oneoff_expense_spouse_loc_stor_val_count = oneoff_expense_spouse_loc_stor_val.length;

      let uiw_max_record_oneoff_exp_counts_arr = [
        expense_type_main_val_loc_stor_val_count,
        expense_type_spouse_val_loc_stor_val_count,
        oneoff_expense_main_loc_stor_val_count,
        oneoff_expense_spouse_loc_stor_val_count,
      ];

      var uiw_max_record_oneoff_exp = Math.max.apply(Math, uiw_max_record_oneoff_exp_counts_arr);

      if (expense_type_main_val_loc_stor_val_count < uiw_max_record_oneoff_exp) {
        for (var i = expense_type_main_val_loc_stor_val_count; i <= uiw_max_record_oneoff_exp; i++) {
          expense_type_main_val_loc_stor_val.push("");
        }
      }

      if (expense_type_spouse_val_loc_stor_val_count < uiw_max_record_oneoff_exp) {
        for (var i = expense_type_spouse_val_loc_stor_val_count; i <= uiw_max_record_oneoff_exp; i++) {
          expense_type_spouse_val_loc_stor_val.push("");
        }
      }

      if (oneoff_expense_main_loc_stor_val_count < uiw_max_record_oneoff_exp) {
        for (var i = oneoff_expense_main_loc_stor_val_count; i <= uiw_max_record_oneoff_exp; i++) {
          oneoff_expense_main_loc_stor_val.push("");
        }
      }

      if (oneoff_expense_spouse_loc_stor_val_count < uiw_max_record_oneoff_exp) {
        for (var i = oneoff_expense_spouse_loc_stor_val_count; i <= uiw_max_record_oneoff_exp; i++) {
          oneoff_expense_spouse_loc_stor_val.push("");
        }
      }

      var expense_spouse_wrapper = jQuery(".one‐off-expenses"); //Fields wrapper
      var data_expense_input = "'mask': '9999'";

      if (!jQuery.isEmptyObject(expense_type_main_val_loc_stor_val) && expense_type_main_val_loc_stor_val.length > 1) {
        for (var i = 1; i < uiw_max_record_oneoff_exp; i++) {
          var expense_type_main_val_loc_stor_val_rec = expense_type_main_val_loc_stor_val[i] != null ? expense_type_main_val_loc_stor_val[i] : "";
          var expense_type_spouse_val_loc_stor_val_rec = expense_type_spouse_val_loc_stor_val[i] != null ? expense_type_spouse_val_loc_stor_val[i] : "";
          var oneoff_expense_main_loc_stor_val_rec = oneoff_expense_main_loc_stor_val[i] != null ? oneoff_expense_main_loc_stor_val[i] : "";
          var oneoff_expense_spouse_loc_stor_val_rec = oneoff_expense_spouse_loc_stor_val[i] != null ? oneoff_expense_spouse_loc_stor_val[i] : "";

          jQuery(expense_spouse_wrapper).append(
            '<div class="one-off-addmore-field"><div class="wisely-form-row bg-grey"> <div class="wisely-form-column01"> <label>One-off expense amount: </label> </div><div class="wisely-form-column02"> <div class="expense_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="expense_type_main_val[]" id="expense_type_main_val" value="' +
              expense_type_main_val_loc_stor_val_rec +
              '"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="expense_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="expense_type_spouse_val[]" id="expense_type_spouse_val" value="' +
              expense_type_spouse_val_loc_stor_val_rec +
              '"> </div></div></div></div><div class="wisely-form-row bg-white"> <div class="wisely-form-column01"> <label class="fieldlabels"> When will this one-off expense occur?</label> </div><div class="wisely-form-column02"> <div class="expense_spouse_wrap"> <div> <input type="text" class="d-date-income oneoff_expense_main" data-inputmask="' +
              data_expense_input +
              '" name="oneoff_expense_main[]" id="oneoff_expense_main" placeholder="Year" value="' +
              oneoff_expense_main_loc_stor_val_rec +
              '"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="expense_spouse_wrap"> <div> <input type="text" class="d-date-income oneoff_expense_spouse" data-inputmask="' +
              data_expense_input +
              '" name="oneoff_expense_spouse[]" id="oneoff_expense_spouse" placeholder="Year" value="' +
              oneoff_expense_spouse_loc_stor_val_rec +
              '"> </div></div></div></div><a href="#" class="expense_spouse_remove"><span>Remove</span><i class="fa-light fa-trash"></i></a></div>'
          );
        }

        jQuery(".one-off-addmore-field .oneoff_expense_main").mask("9999");
        jQuery(".one-off-addmore-field .oneoff_expense_spouse").mask("9999");
      }

      /* display other one off expense add more data on load if filled end */

      /* display other charity expense add more data on load if filled start */

      var donate_plan_main_loc_stor_val = all_step_data_json_parse.step_8.donate_plan_main;
      var donate_plan_spouse_loc_stor_val = all_step_data_json_parse.step_8.donate_plan_spouse;
      var donate_plan_no_main_loc_stor_val = all_step_data_json_parse.step_8.donate_plan_no_main;
      var donate_plan_no_spouse_loc_stor_val = all_step_data_json_parse.step_8.donate_plan_no_spouse;

      var donate_plan_main_loc_stor_val_count = donate_plan_main_loc_stor_val.length;
      var donate_plan_spouse_loc_stor_val_count = donate_plan_spouse_loc_stor_val.length;
      var donate_plan_no_main_loc_stor_val_count = donate_plan_no_main_loc_stor_val.length;
      var donate_plan_no_spouse_loc_stor_val_count = donate_plan_no_spouse_loc_stor_val.length;

      let uiw_max_record_charity_exp_counts_arr = [
        donate_plan_main_loc_stor_val_count,
        donate_plan_spouse_loc_stor_val_count,
        donate_plan_no_main_loc_stor_val_count,
        donate_plan_no_spouse_loc_stor_val_count,
      ];

      var uiw_max_record_charity_exp = Math.max.apply(Math, uiw_max_record_charity_exp_counts_arr);

      if (donate_plan_main_loc_stor_val_count < uiw_max_record_charity_exp) {
        for (var i = donate_plan_main_loc_stor_val_count; i <= uiw_max_record_charity_exp; i++) {
          donate_plan_main_loc_stor_val.push("");
        }
      }

      if (donate_plan_spouse_loc_stor_val_count < uiw_max_record_charity_exp) {
        for (var i = donate_plan_spouse_loc_stor_val_count; i <= uiw_max_record_charity_exp; i++) {
          donate_plan_spouse_loc_stor_val.push("");
        }
      }

      if (donate_plan_no_main_loc_stor_val_count < uiw_max_record_charity_exp) {
        for (var i = donate_plan_no_main_loc_stor_val_count; i <= uiw_max_record_charity_exp; i++) {
          donate_plan_no_main_loc_stor_val.push("");
        }
      }

      if (donate_plan_no_spouse_loc_stor_val_count < uiw_max_record_charity_exp) {
        for (var i = donate_plan_no_spouse_loc_stor_val_count; i <= uiw_max_record_charity_exp; i++) {
          donate_plan_no_spouse_loc_stor_val.push("");
        }
      }

      var donate_spouse_wrapper = jQuery(".charitable-section"); //Fields wrapper
      var data_spouse_input = "'mask': '9999-9999'";

      if (!jQuery.isEmptyObject(donate_plan_main_loc_stor_val) && donate_plan_main_loc_stor_val.length > 1) {
        for (var i = 1; i < uiw_max_record_charity_exp; i++) {
          var donate_plan_main_loc_stor_val_rec = donate_plan_main_loc_stor_val[i] != null ? donate_plan_main_loc_stor_val[i] : "";
          var donate_plan_spouse_loc_stor_val_rec = donate_plan_spouse_loc_stor_val[i] != null ? donate_plan_spouse_loc_stor_val[i] : "";
          var donate_plan_no_main_loc_stor_val_rec = donate_plan_no_main_loc_stor_val[i] != null ? donate_plan_no_main_loc_stor_val[i] : "";
          var donate_plan_no_spouse_loc_stor_val_rec = donate_plan_no_spouse_loc_stor_val[i] != null ? donate_plan_no_spouse_loc_stor_val[i] : "";

          jQuery(donate_spouse_wrapper).append(
            '<div class="donate-remove"><div class="wisely-form-row bg-grey"> <div class="wisely-form-column01"> <label>Annual donation amount:</label> </div><div class="wisely-form-column02"> <div class="donate_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="donate_plan_main[]" id="donate_plan_main" value="' +
              donate_plan_main_loc_stor_val_rec +
              '"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="donate_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="donate_plan_spouse[]" id="donate_plan_spouse" value="' +
              donate_plan_spouse_loc_stor_val_rec +
              '"> </div></div></div></div><div class="wisely-form-row bg-white"> <div class="wisely-form-column01"> <label class="fieldlabels"> When will the donation occur?</label> </div><div class="wisely-form-column02"> <div class="donate_spouse_wrap"> <div> <input type="text" class="d-date-income donate_plan_no_main" data-inputmask="' +
              data_spouse_input +
              '" name="donate_plan_no_main[]" id="donate_plan_no_main" placeholder="Year to Year" value="' +
              donate_plan_no_main_loc_stor_val_rec +
              '"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="donate_spouse_wrap"> <div> <input type="text" class="d-date-income donate_plan_no_spouse" data-inputmask="' +
              data_spouse_input +
              '" name="donate_plan_no_spouse[]" id="donate_plan_no_spouse" placeholder="Year to Year" value="' +
              donate_plan_no_spouse_loc_stor_val_rec +
              '"> </div></div></div></div><a href="#" class="donate_spouse_remove"><span>Remove</span><i class="fa-light fa-trash"></i></a></div>'
          );
        }

        jQuery(".donate-remove .donate_plan_no_main").mask("9999-9999");
        jQuery(".donate-remove .donate_plan_no_spouse").mask("9999-9999");
      }

      /* display other charity expense add more data on load if filled end */
    }
  }

  /* ==========   Initialize tooltip ========== */
  jQuery(document).ready(function () {
    jQuery('.tootltip-icon').tooltip({html:true})
  })

  /* ==========   popup register js start ========== */

  /* ============ popup register js start ========== */

  /* ==========add-remove field js start ========== */

  jQuery(document).ready(function () {
    // format all input fields with class "number_custom"
    jQuery(".number_custom").on("input", function () {
      formatInputValue(this);
    });

    jQuery(":input").inputmask();
    /* ==========income add-remove field js end ========== */
    var max_fields = 50; //maximum input boxes allowed
    var wrapper = jQuery(".new-add-more-field"); //Fields wrapper
    var add_button = jQuery(".add_date_button"); //Add button ID

    var x = 1; //initlal text box count
    jQuery(add_button).click(function (e) {
      //on add input button click
      e.preventDefault();
      if (x < max_fields) {
        //max input box allowed
        x++; //text box increment
        var data_input = "'mask': '9999-9999'";
        jQuery(wrapper).append(
          '<div class="other-income-add"><div class="wisely-form-row bg-grey"> <div class="wisely-form-column01"> <label class="fieldlabels">Are you expecting any other income (before tax)?</label> </div><div class="wisely-form-column02"> <div class="input_fields_wrap"> <div> <input type="text" class="number_custom" placeholder="$" id="other_income" name="other_income[]"/> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="input_fields_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="other_spouse_income[]" id="other_spouse_income"/> </div></div></div></div><div class="wisely-form-row bg-white"> <div class="wisely-form-column01"> <label class="fieldlabels">When will you receive this other income?</label> </div><div class="wisely-form-column02"> <div class="date_wrap"> <div> <input type="text" class="other_date" id="other_date" name="other_date[]" data-inputmask=' +
            data_input +
            ' placeholder="Year to Year"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="date_wrap"> <div> <input type="text" data-inputmask=' +
            data_input +
            ' placeholder="Year to Year" class="other_spouse_date" id="other_spouse_date" name="other_spouse_date[]"> </div></div></div></div><a href="#" class="date_remove"><span>Remove</span><i class="fa-light fa-trash"></i></a></div>'
        ); //add input box
        jQuery(".other-income-add .other_date").mask("9999-9999");
        jQuery(".other-income-add .other_spouse_date").mask("9999-9999");

        jQuery(".number_custom").on("input", function () {
          formatInputValue(this);
        });
      }

      if (jQuery("#cb_value").is(":checked")) {
        jQuery(".spouse-hide-class").show();
      } else {
        jQuery(".spouse-hide-class").hide();
      }
    });

    jQuery(wrapper).on("click", ".date_remove", function (e) {
      //user click on remove text
      e.preventDefault();
      jQuery(this).parent("div").remove();
      x--;
    });
    /* ==========income  add-remove field js end ========== */

    /* ==========assests add-remove field js end ========== */
    var spouse_account_max_fields = 50; //maximum input boxes allowed
    var spouse_account_wrapper = jQuery(".select-account-field"); //Fields wrapper
    var spouse_account_add_button = jQuery(".add_spouse_button"); //Add button ID

    var x = 1; //initlal text box count
    jQuery(spouse_account_add_button).click(function (e) {
      //on add input button click
      e.preventDefault();
      if (x < spouse_account_max_fields) {
        //max input box allowed
        x++; //text box increment
        jQuery(spouse_account_wrapper).append(
          '<div class="other-account-add"><div class="wisely-form-row bg-grey"> <div class="wisely-form-column01"> <label>Please select any account(s) you have?</label> </div><div class="wisely-form-column02"> <div class="account_wrap"> <div> <select class="account_main" id="account_main" name="account_main"> <option value="">Please select</option> <option value="TFSA">TFSA</option> <option value="RRSP">RRSP</option> <option value="RRIF">RRIF</option> <option value="LIRA">LIRA</option> <option value="LIF">LIF</option> </select> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="account_wrap"> <div> <select class="spouse_main" id="spouse_main" name="spouse_main"> <option value="">Please select</option> <option value="TFSA">TFSA</option> <option value="RRSP">RRSP</option> <option value="RRIF">RRIF</option> <option value="LIRA">LIRA</option> <option value="LIF">LIF</option> </select> </div></div></div></div><div class="wisely-form-row bg-white"> <div class="wisely-form-column01"> <label>What is the current value in this account?</label> </div><div class="wisely-form-column02"> <div class="spouse_account_wrap"> <div> <input type="text" class="number_custom" placeholder="$" id="account_value" name="account_value[]"/> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="spouse_account_wrap"> <div> <input type="text" class="number_custom" placeholder="$" id="spouse_value" name="spouse_value[]"/> </div></div></div></div><a href="#" class="spouse_account_remove"><span>Remove</span><i class="fa-light fa-trash"></i></a></div>'
        );
      }
      if (jQuery("#cb_value").is(":checked")) {
        jQuery(".spouse-hide-class").show();
      } else {
        jQuery(".spouse-hide-class").hide();
      }

      jQuery(".number_custom").on("input", function () {
        formatInputValue(this);
      });
    });

    jQuery(spouse_account_wrapper).on("click", ".spouse_account_remove", function (e) {
      //user click on remove text
      e.preventDefault();
      jQuery(this).parent("div").remove();
      x--;
    });
    /* ==========assests add-remove field js end ========== */

    /* ==========expense add-remove field js end ========== */
    var expense_spouse_max_fields = 50; //maximum input boxes allowed
    var expense_spouse_wrapper = jQuery(".one‐off-expenses"); //Fields wrapper
    var expense_spouse_add_button = jQuery(".add_expense_spouse_button"); //Add button ID

    var x = 1; //initlal text box count
    jQuery(expense_spouse_add_button).click(function (e) {
      //on add input button click
      e.preventDefault();
      var data_expense_input = "'mask': '9999'";
      if (x < expense_spouse_max_fields) {
        //max input box allowed
        x++; //text box increment
        jQuery(expense_spouse_wrapper).append(
          '<div class="one-off-addmore-field"><div class="wisely-form-row bg-grey"> <div class="wisely-form-column01"> <label>One-off expense amount: </label> </div><div class="wisely-form-column02"> <div class="expense_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="expense_type_main_val[]" id="expense_type_main_val"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="expense_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="expense_type_spouse_val[]" id="expense_type_spouse_val"> </div></div></div></div><div class="wisely-form-row bg-white"> <div class="wisely-form-column01"> <label class="fieldlabels"> When will this one-off expense occur?</label> </div><div class="wisely-form-column02"> <div class="expense_spouse_wrap"> <div> <input type="text" class="d-date-income oneoff_expense_main" data-inputmask=' +
            data_expense_input +
            ' name="oneoff_expense_main[]" id="oneoff_expense_main" placeholder="Year"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="expense_spouse_wrap"> <div> <input type="text" class="d-date-income oneoff_expense_spouse" data-inputmask=' +
            data_expense_input +
            ' name="oneoff_expense_spouse[]" id="oneoff_expense_spouse" placeholder="Year"> </div></div></div></div><a href="#" class="expense_spouse_remove"><span>Remove</span><i class="fa-light fa-trash"></i></a></div>'
        );
        jQuery(".one-off-addmore-field .oneoff_expense_main").mask("9999");
        jQuery(".one-off-addmore-field .oneoff_expense_spouse").mask("9999");
      }
      if (jQuery("#cb_value").is(":checked")) {
        jQuery(".spouse-hide-class").show();
      } else {
        jQuery(".spouse-hide-class").hide();
      }

      jQuery(".number_custom").on("input", function () {
        formatInputValue(this);
      });
    });

    jQuery(expense_spouse_wrapper).on("click", ".expense_spouse_remove", function (e) {
      //user click on remove text
      e.preventDefault();
      jQuery(this).parent("div").remove();
      x--;
    });

    var donate_spouse_max_fields = 50; //maximum input boxes allowed
    var donate_spouse_wrapper = jQuery(".charitable-section"); //Fields wrapper
    var donate_spouse_add_button = jQuery(".add_donate_spouse_button"); //Add button ID

    var x = 1; //initlal text box count
    jQuery(donate_spouse_add_button).click(function (e) {
      //on add input button click
      e.preventDefault();
      var data_spouse_input = "'mask': '9999-9999'";
      if (x < donate_spouse_max_fields) {
        //max input box allowed
        x++; //text box increment
        jQuery(donate_spouse_wrapper).append(
          '<div class="donate-remove"><div class="wisely-form-row bg-grey"> <div class="wisely-form-column01"> <label>Annual donation amount:</label> </div><div class="wisely-form-column02"> <div class="donate_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="donate_plan_main[]" id="donate_plan_main"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="donate_wrap"> <div> <input type="text" class="number_custom" placeholder="$" name="donate_plan_spouse[]" id="donate_plan_spouse"> </div></div></div></div><div class="wisely-form-row bg-white"> <div class="wisely-form-column01"> <label class="fieldlabels"> When will the donation occur?</label> </div><div class="wisely-form-column02"> <div class="donate_spouse_wrap"> <div> <input type="text" class="d-date-income donate_plan_no_main" data-inputmask=' +
            data_spouse_input +
            ' name="donate_plan_no_main[]" id="donate_plan_no_main" placeholder="Year to Year"> </div></div></div><div class="wisely-form-column03 spouse-hide-class"> <div class="donate_spouse_wrap"> <div> <input type="text" class="d-date-income donate_plan_no_spouse" data-inputmask=' +
            data_spouse_input +
            ' name="donate_plan_no_spouse[]" id="donate_plan_no_spouse" placeholder="Year to Year"> </div></div></div></div><a href="#" class="donate_spouse_remove"><span>Remove</span><i class="fa-light fa-trash"></i></a></div>'
        ); //add input box
        jQuery(".donate-remove .donate_plan_no_main").mask("9999-9999");
        jQuery(".donate-remove .donate_plan_no_spouse").mask("9999-9999");
      }
      if (jQuery("#cb_value").is(":checked")) {
        jQuery(".spouse-hide-class").show();
      } else {
        jQuery(".spouse-hide-class").hide();
      }

      jQuery(".number_custom").on("input", function () {
        formatInputValue(this);
      });
    });

    jQuery(donate_spouse_wrapper).on("click", ".donate_spouse_remove", function (e) {
      //user click on remove text
      e.preventDefault();
      jQuery(this).parent("div").remove();
      x--;
    });
    /* ==========expense add-remove field js end ========== */
  });

  /* ==========add-remove field js end ========== */
  jQuery(".btContentHolder").find(".main-content").addClass("first-img-sec");
  jQuery("#second_section").hide();
  jQuery("#second_field").hide();
  jQuery("#third_field").hide();
  jQuery("#four_field").hide();
  jQuery("#five_field").hide();
  jQuery("#six_field").hide();
  jQuery("#seven_field").hide();

  jQuery("#first_step").click(function (e) {
    var form = jQuery("#first_form");
    form.validate({
      rules: {
        old_are: {
          required: true,
          // number: true,
        },
        life_expect: {
          required: true,
          // number: true,
        },
        live: {
          required: true,
        },
      },
      messages: {
        old_are: {
          required: "Please enter the age.",
        },
        life_expect: {
          required: "Please enter life expectancy estimate.",
        },
        live: {
          required: "Please choose the option.",
        },
      },
    });

    if (form.valid() === true) {
      jQuery("#first_section").hide();
      jQuery("#second_section").show();
      jQuery(".progress-step").find("span").css("width", "80%");
    }
  });

  jQuery("#third_step").click(function (e) {
    jQuery("#first_section").show();
    jQuery("#second_section").hide();
    jQuery(".progress-step").find("span").css("width", "50%");
  });

  jQuery("#second_step").click(function (e) {
    var formnew = jQuery("#second_form");
    formnew.validate({
      rules: {
        investor_main: {
          required: "#step2-tglr input:unchecked",
        },
        inflation_rate: {
          required: true,
        },
        income_rate: {
          required: "#step2-tglr input:checked",
        },
        growth_rate: {
          required: "#step2-tglr input:checked",
        },
      },
      messages: {
        investor_main: {
          required: "Please choose the type.",
        },
        inflation_rate: {
          required: "Please enter Inflation rate.",
        },
        income_rate: {
          required: "Please enter Income rate.",
        },
        growth_rate: {
          required: "Please enter Growth rate.",
        },
      },
    });

    if (formnew.valid() === true) {
      jQuery("#second_field").show();
      jQuery("#sf_second_section").hide();
      jQuery("#second_section").hide();
      jQuery("#second_step").click(function (e) {
        jQuery("#second_section").hide();
        jQuery("#sf_first_section").show();
      });
      jQuery(".progress-step").find("span").css({ width: "100%" });
      jQuery(".btContentHolder").find(".main-content").removeClass("first-img-sec");
      jQuery(".btContentHolder").find(".main-content").addClass("second-img-sec");
      jQuery(".progress-step").find(".progress-step-icon").removeClass("active");
      jQuery(".progress-step").find(".progress-step-icon").addClass("inactive");
      jQuery(".progress-income").find(".progress-step-icon").addClass("active");
      jQuery(".progress-income").find("span").css({ width: "70%" });
    }
  });

  jQuery("#fifth_step").click(function (e) {
    jQuery("#second_field").hide();
    jQuery("#second_section").show();
    jQuery(".progress-step").find(".progress-step-icon").addClass("active");
    jQuery(".progress-step").find("span").css("width", "80%");
    jQuery(".progress-income").find("span").css("width", "0%");
    jQuery(".btContentHolder").find(".main-content").removeClass("second-img-sec");
    jQuery(".btContentHolder").find(".main-content").addClass("first-img-sec");
    jQuery(".progress-income").find(".progress-step-icon").removeClass("active");
  });

  jQuery("#fourth_step").click(function (e) {
    var form = jQuery("#third_form");

    // form.validate({
    //     rules: {
    //         your_income: {
    //             required: true,
    //             //number: true,
    //         },
    //         your_date: {
    //             required: true,
    //         },
    //         other_income: {
    //             required: true,
    //             //number: true,
    //         },
    //         other_spouse_income: {
    //             required: true,
    //             //number: true,
    //         },
    //         other_date: {
    //             required: true,
    //         },
    //         other_spouse_date: {
    //             required: true,
    //         }

    //     },
    //     messages: {
    //         your_income: {
    //             required: "Please enter annual income.",
    //         },
    //         your_date: {
    //             required: "Please enter the income date.",
    //         },
    //         other_income: {
    //             required: "Please enter the other income.",
    //         },
    //         other_spouse_income: {
    //             required: "Please enter the other income.",
    //         },
    //         other_date: {
    //             required: "Please enter the other income date.",
    //         },
    //         other_spouse_date: {
    //             required: "Please enter the other income date.",
    //         }

    //     }
    // });

    //if (form.valid() === true) {
    jQuery("#second_field").show();
    jQuery("#sf_first_section").hide();
    jQuery("#sf_second_section").show();
    jQuery(".progress-income").find("span").css("width", "80%");
    //}
  });

  jQuery("#seven_step").click(function (e) {
    jQuery("#second_field").show();
    jQuery("#sf_first_section").show();
    jQuery("#sf_second_section").hide();
    jQuery(".progress-income").find("span").css("width", "65%");
  });

  jQuery("#six_step").click(function (e) {
    //var form1 = jQuery("#fourth_form");

    // form1.validate({
    //     rules: {
    //         pension_age: {
    //             required: true,
    //             number: true,
    //         },
    //         pension_amount: {
    //             required: true,
    //             //number: true,
    //         },
    //         pension_sn_amount: {
    //             required: true,
    //             //number: true,
    //         },
    //         security_age: {
    //             required: true,
    //             number: true,
    //         },
    //         security_amount: {
    //             required: true,
    //             //number: true,
    //         },
    //         security_sn_amount: {
    //             required: true,
    //             //number: true,
    //         },
    //         benifit_age: {
    //             required: true,
    //             number: true,
    //         },
    //         benifit_amount: {
    //             required: true,
    //             //number: true,
    //         },
    //         benifit_sn_amount: {
    //             required: true,
    //             //number: true,
    //         }

    //     },
    //     messages: {
    //         pension_age: {
    //             required: "Please enter the Age.",
    //         },
    //         pension_amount: {
    //             required: "Please enter annual amount.",
    //         },
    //         pension_sn_amount: {
    //             required: "Please enter annual amount.",
    //         },
    //         security_age: {
    //             required: "Please enter the Age.",
    //         },
    //         security_amount: {
    //             required: "Please enter annual amount.",
    //         },
    //         security_sn_amount: {
    //             required: "Please enter annual amount.",
    //         },
    //         benifit_age: {
    //             required: "Please enter the Age.",
    //         },
    //         benifit_amount: {
    //             required: "Please enter annual amount.",
    //         },
    //         benifit_sn_amount: {
    //             required: "Please enter annual amount.",
    //         }
    //     }
    // });

    //if (form1.valid() === true) {
    jQuery("#third_field").show();
    jQuery("#td_second_section").hide();
    jQuery("#second_field").hide();
    jQuery("#six_step").click(function (e) {
      jQuery("#sf_second_section").hide();
      jQuery("#td_first_section").show();
    });
    jQuery(".progress-income").find("span").css("width", "100%");
    jQuery(".progress-income").find(".progress-step-icon").addClass("inactive");
    jQuery(".progress-income").find(".progress-step-icon").removeClass("active");
    jQuery(".progress-asset").find(".progress-step-icon").addClass("active");
    jQuery(".btContentHolder").find(".main-content").removeClass("second-img-sec");
    jQuery(".btContentHolder").find(".main-content").addClass("third-img-sec");

    //}
  });

  jQuery("#nine_step").click(function (e) {
    jQuery("#second_field").show();
    jQuery("#sf_first_section").hide();
    jQuery("#sf_second_section").show();
    jQuery("#third_field").hide();
    jQuery(".progress-asset").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-income").find(".progress-step-icon").addClass("active");
    jQuery(".progress-asset").find("span").css("width", "0%");
    jQuery(".btContentHolder").find(".main-content").removeClass("third-img-sec");
    jQuery(".btContentHolder").find(".main-content").addClass("second-img-sec");
    jQuery(".progress-asset").find(".progress-step-icon").removeClass("active");
  });

  jQuery("#eight_step").click(function (e) {
    //var form1 = jQuery("#fifth_form");

    // form1.validate({
    //     rules: {
    //         account_main: {
    //             required: true,
    //         },
    //         spouse_main: {
    //             required: true,
    //         },
    //         account_value: {
    //             required: true,
    //             number: true,
    //         },
    //         spouse_value: {
    //             required: true,
    //             number: true,
    //         },
    //         ct_account_value: {
    //             required: true,
    //             //number: true,
    //         },
    //         st_account_value: {
    //             required: true,
    //             //number: true,
    //         },
    //         ct_book_value: {
    //             required: true,
    //             //number: true,
    //         },
    //         st_book_value: {
    //             required: true,
    //             //number: true,
    //         },
    //         estate_value: {
    //             required: true,
    //             //number: true,
    //         },
    //         se_estate_value: {
    //             required: true,
    //             //number: true,
    //         },
    //         asset_by_main: {
    //             required: true,
    //         },
    //         se_asset_by_main: {
    //             required: true,
    //         },

    //     },
    //     messages: {
    //         account_main: {
    //             required: "Please choose the option.",
    //         },
    //         spouse_main: {
    //             required: "Please choose the option.",
    //         },
    //         account_value: {
    //             required: "Please enter the account value.",
    //         },
    //         spouse_value: {
    //             required: "Please enter the account value.",
    //         },
    //         ct_account_value: {
    //             required: "Please enter the current value.",
    //         },
    //         st_account_value: {
    //             required: "Please enter the current value.",
    //         },
    //         ct_book_value: {
    //             required: "Please enter the inital cost.",
    //         },
    //         st_book_value: {
    //             required: "Please enter the inital cost.",
    //         },
    //         estate_value: {
    //             required: "Please enter the value.",
    //         },
    //         se_estate_value: {
    //             required: "Please enter the value.",
    //         },
    //         asset_by_main: {
    //             required: "Please choose the option.",
    //         },
    //         se_asset_by_main: {
    //             required: "Please choose the option.",
    //         }
    //     }
    // });

    //if (form1.valid() === true) {
    jQuery("#third_field").show();
    jQuery("#td_second_section").show();
    jQuery("#td_first_section").hide();
    jQuery(".progress-asset").find("span").css("width", "70%");
    //}
  });

  jQuery("#eleven_step").click(function (e) {
    jQuery("#third_field").show();
    jQuery("#td_first_section").show();
    jQuery("#td_second_section").hide();
    jQuery(".progress-asset").find("span").css("width", "60%");
  });

  jQuery("#twelve_step").click(function (e) {
    var form2 = jQuery("#seven_form");

    form2.validate({
      rules: {
        /* annual_expense: {
          //required: "#step8-tglr input:unchecked",
          required: function (element) {
            if (!jQuery("#step8-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        se_annual_expense: {
          //required: "#step16-tglr input:unchecked",
          required: function (element) {
            if (!jQuery("#step16-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        care_expense: {
          //required: "#step8-tglr input:unchecked",
          required: function (element) {
            if (!jQuery("#step8-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        se_care_expense: {
          //required: "#step16-tglr input:unchecked",
          required: function (element) {
            if (!jQuery("#step16-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        annual_age: {
          //required: '#step8-tglr input:checked',
          required: function (element) {
            if (jQuery("#step8-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        spouse_annual_age: {
          //required: '#step16-tglr input:checked',
          required: function (element) {
            if (jQuery("#step16-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        care_age: {
          //required: '#step8-tglr input:checked',
          required: function (element) {
            if (jQuery("#step8-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        spouse_care_age: {
          //required: '#step16-tglr input:checked',
          required: function (element) {
            if (jQuery("#step16-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        second_annual_age: {
          //required: '#step8-tglr input:checked',
          required: function (element) {
            if (jQuery("#step8-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        spouse_se_annual_age: {
          //required: '#step16-tglr input:checked',
          required: function (element) {
            if (jQuery("#step16-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        second_care_age: {
          //required: '#step8-tglr input:checked',
          required: function (element) {
            if (jQuery("#step8-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        spouse_se_care_age: {
          // required: '#step16-tglr input:checked',
          required: function (element) {
            if (jQuery("#step16-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        third_annual_age: {
          //required: '#step8-tglr input:checked',
          required: function (element) {
            if (jQuery("#step8-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        spouse_th_annual_age: {
          //required: '#step16-tglr input:checked',
          required: function (element) {
            if (jQuery("#step16-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        third_care_age: {
          //required: '#step8-tglr input:checked',
          required: function (element) {
            if (jQuery("#step8-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        },
        spouse_th_care_age: {
          //required: '#step16-tglr input:checked',
          required: function (element) {
            if (jQuery("#step16-tglr").hasClass("active")) {
              return true;
            } else {
              return false;
            }
          },
          //number: true,
        }, */
      },
      messages: {
        annual_expense: {
          required: "Please enter the value",
        },
        se_annual_expense: {
          required: "Please enter the value",
        },
        care_expense: {
          required: "Please enter the value",
        },
        se_care_expense: {
          required: "Please enter the value",
        },
        annual_age: {
          required: "Please enter the value",
        },
        spouse_annual_age: {
          required: "Please enter the value",
        },
        care_age: {
          required: "Please enter the value",
        },
        spouse_care_age: {
          required: "Please enter the value",
        },
        second_care_age: {
          required: "Please enter the value",
        },
        second_annual_age: {
          required: "Please enter the value",
        },
        spouse_se_annual_age: {
          required: "Please enter the value",
        },
        spouse_se_care_age: {
          required: "Please enter the value",
        },
        third_annual_age: {
          required: "Please enter the value",
        },
        spouse_th_annual_age: {
          required: "Please enter the value",
        },
        third_care_age: {
          required: "Please enter the value",
        },
        spouse_th_care_age: {
          required: "Please enter the value",
        },
      },
    });

    if (form2.valid() === true) {
      jQuery("#four_field").hide();
      jQuery("#five_field").show();
      jQuery(".progress-expense").find("span").css("width", "80%");
    } else {
      return false;
    }

    let annual_expense = jQuery("#annual_expense").val();
    let se_annual_expense = jQuery("#se_annual_expense").val();
    let care_expense = jQuery("#care_expense").val();
    let se_care_expense = jQuery("#se_care_expense").val();
    //let prefer_value = jQuery('#prefer_value').val();
    let annual_age = jQuery("#annual_age").val();
    let spouse_annual_age = jQuery("#spouse_annual_age").val();
    let care_age = jQuery("#care_age").val();
    let spouse_care_age = jQuery("#spouse_care_age").val();
    let second_annual_age = jQuery("#second_annual_age").val();
    let spouse_se_annual_age = jQuery("#spouse_se_annual_age").val();
    let second_care_age = jQuery("#second_care_age").val();
    let spouse_se_care_age = jQuery("#spouse_se_care_age").val();
    let third_annual_age = jQuery("#third_annual_age").val();
    let spouse_th_annual_age = jQuery("#spouse_th_annual_age").val();
    let se_estate_value = jQuery("#se_estate_value").val();
    let third_care_age = jQuery("#third_care_age").val();
    let spouse_th_care_age = jQuery("#spouse_th_care_age").val();
    let expe_each_stage_ret = jQuery("#expe_each_stage_ret").val();
    let expe_each_stage_ret_spouse = jQuery("#expe_each_stage_ret_spouse").val();

    let all_step_data_json_string = localStorage.getItem(user_step_data);
    let all_step_data_arr = JSON.parse(all_step_data_json_string);

    let step_7 = {
      annual_expense: annual_expense,
      se_annual_expense: se_annual_expense,
      care_expense: care_expense,
      se_care_expense: se_care_expense,
      //"prefer_value": prefer_value,
      annual_age: annual_age,
      spouse_annual_age: spouse_annual_age,
      care_age: care_age,
      spouse_care_age: spouse_care_age,
      second_annual_age: second_annual_age,
      spouse_se_annual_age: spouse_se_annual_age,
      second_care_age: second_care_age,
      spouse_se_care_age: spouse_se_care_age,
      third_annual_age: third_annual_age,
      spouse_th_annual_age: spouse_th_annual_age,
      se_estate_value: se_estate_value,
      third_care_age: third_care_age,
      spouse_th_care_age: spouse_th_care_age,
      expe_each_stage_ret: expe_each_stage_ret,
      expe_each_stage_ret_spouse: expe_each_stage_ret_spouse,
    };

    Object.assign(all_step_data_arr, {
      step_7: step_7,
    });

    let all_step_data_string = JSON.stringify(all_step_data_arr);

    localStorage.setItem(user_step_data, all_step_data_string);
  });

  jQuery("#thirteen_step").click(function (e) {
    jQuery("#four_field").hide();
    jQuery("#third_field").show();
    jQuery("#td_second_section").show();
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery(".progress-asset").find(".progress-step-icon").addClass("active");
    jQuery(".btContentHolder").find(".main-content").removeClass("fourth-img-sec");
    jQuery(".btContentHolder").find(".main-content").addClass("third-img-sec");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("active");
  });
  jQuery("#fifteen_step").click(function (e) {
    jQuery("#five_field").hide();
    jQuery("#four_field").show();
    jQuery(".progress-expense").find("span").css("width", "75%");
  });
  jQuery("#seventeen_step").click(function (e) {
    jQuery("#six_field").hide();
    jQuery("#five_field").show();
  });


  $("#fourteen_step").click(function () {
    let expense_type_main_val = jQuery("input[name^=expense_type_main_val]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();
    let expense_type_spouse_val = jQuery("input[name^=expense_type_spouse_val]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    let oneoff_expense_main = jQuery("input[name^=oneoff_expense_main]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    let oneoff_expense_spouse = jQuery("input[name^=oneoff_expense_spouse]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    let donate_plan_main = jQuery("input[name^=donate_plan_main]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    let donate_plan_spouse = jQuery("input[name^=donate_plan_spouse]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    let donate_plan_no_main = jQuery("input[name^=donate_plan_no_main]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();
    // $( donate_plan_no_main ).each(function( index, element ) {
    //     // console.log( index + " : " + element );
    //     const donate_new = element.split("-");
    //     let word0 = donate_new[0];
    //     let word1 = donate_new[1];
    // });

    let donate_plan_no_spouse = jQuery("input[name^=donate_plan_no_spouse]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    let desired_estate_main = jQuery("#desired_estate_main").val();
    let all_step_data_json_string = localStorage.getItem(user_step_data);
    let all_step_data_arr = JSON.parse(all_step_data_json_string);

    let step_8 = {
      expense_type_main_val: expense_type_main_val,
      expense_type_spouse_val: expense_type_spouse_val,
      oneoff_expense_main: oneoff_expense_main,
      oneoff_expense_spouse: oneoff_expense_spouse,
      donate_plan_main: donate_plan_main,
      donate_plan_spouse: donate_plan_spouse,
      donate_plan_no_main: donate_plan_no_main,
      donate_plan_no_spouse: donate_plan_no_spouse,
      desired_estate_main: desired_estate_main,
    };

    Object.assign(all_step_data_arr, {
      step_8: step_8,
    });

    let all_step_data_string = JSON.stringify(all_step_data_arr);

    localStorage.setItem(user_step_data, all_step_data_string);
  });

  /* ========== toggle button js start ========== */
  $(
    ".spouse-index-value, .spouse-prefer-value, .spouse-benifit-value, .spouse-security-value, .spouse-pay-value, .prefer-value, .plan-value, .specify-value, .cb-value, .payment-value, .security-value, .benifit-value, .index-value"
  ).click(function () {
    var mainParent = $(this).parent(
      ".spouse-index-btn, .spouse-prefer-btn, .benifit-spouse-btn, .spouse-security-btn, .prefer-btn, .spouse-pay-btn, .plan-btn, .specify-btn, .toggle-btn, .payment-btn, .security-btn, .benifit-btn, .index-btn"
    );

    if (
      $(mainParent)
        .find(
          "input.spouse-index-value, input.spouse-prefer-value, input.spouse-benifit-value, input.spouse-security-value, input.prefer-value, input.spouse-pay-value, input.plan-value, input.specify-value, input.cb-value, input.payment-value, input.security-value, input.benifit-value, input.index-value"
        )
        .is(":checked")
    ) {
      $(mainParent).addClass("active");
      //console.log("add");
    } else {
      $(mainParent).removeClass("active");
      //console.log("remove");
    }
  });

  /* jQuery(document).('click','.payment-value',function(){
         alert("hello");
     });
 */

  $("#step1-tglr").click(function (e) {
    if ($(this).hasClass("active")) {
      $("#show-field").show();
    } else {
      $("#show-field").hide();
    }
  });
  $("#step1-tglr").click(function (e) {
    if ($(this).hasClass("active")) {
      $("#show-field01").show();
    } else {
      $("#show-field01").hide();
    }
  });
  $("#step1-tglr").click(function (e) {
    if ($(this).hasClass("active")) {
      $("#show-field02").show();
      $("#est_with_spouse").val("yes");
    } else {
      $("#show-field02").hide();
      $("#est_with_spouse").val("no");
    }
  });

  jQuery(document).on("click", "#step2-tglr", function () {
    // $('#step2-tglr').click(function(e) {

    $("#income_rate").val("");
    $("#growth_rate").val("");

    if ($(this).hasClass("active")) {
      // alert('show now...');
      $(".sp-show-field").show();
      $("#wsc_own_ror").val("yes");
    } else {
      $(".sp-show-field").hide();
      $("#wsc_own_ror").val("");
    }
  });

  $("#step6-tglr").click(function (e) {
    if ($(this).hasClass("active")) {
      // alert('show now...');
      $("#index-show-field").show();
      $("#indexed_to_inflatiton").val("yes");
    } else {
      $("#index-show-field").hide();
      $("#indexed_to_inflatiton").val("no");
    }
  });
  $("#step17-tglr").click(function (e) {
    if ($(this).hasClass("active")) {
      // alert('show now...');
      $("#spouse-index-show-field").show();
      $("#indexed_to_inflatiton_spouse").val("yes");
    } else {
      $("#spouse-index-show-field").hide();
      $("#indexed_to_inflatiton_spouse").val("no");
    }
  });

  $("#step7-tglr").click(function (e) {
    if ($(this).hasClass("active")) {
      // alert('show now...');
      $("#plan-show-field").show();
      $("#wsc_sell_home_future").val("yes");
    } else {
      $("#plan-show-field").hide();
      $("#wsc_sell_home_future").val();
    }
  });

  $("#step8-tglr").click(function (e) {
    let activeClass = jQuery("#step16-tglr").hasClass("active");

    if ($(this).hasClass("active")) {
      $(".expense-amounts-hide").show();
      $(".retirement-first").show();
      $("#expe_each_stage_ret").val("yes");
    } else {
      if (activeClass == false) {
        $(".expense-amounts-hide").hide();
      }
      $(".retirement-first").hide();
      $("#expe_each_stage_ret").val("no");
    }
  });

  $("#step16-tglr").click(function (e) {
    let activeClass = jQuery("#step8-tglr").hasClass("active");

    //console.log(activeClass);
    if ($(this).hasClass("active")) {
      $(".expense-amounts-hide").show();
      $(".retirement-second").show();
      $("#expe_each_stage_ret_spouse").val("yes");
    } else {
      if (activeClass == false) {
        $(".expense-amounts-hide").hide();
      }
      $(".retirement-second").hide();
      $("#expe_each_stage_ret_spouse").val("no");
    }
  });

  $("#step12-tglr").click(function (e) {
    let activeClass3 = jQuery("#step3-tglr").hasClass("active");
    if ($(this).hasClass("active")) {
      if (activeClass3) {
        $(".spouse-pay-show-field").hide();
      }
      $(".pension-age-second").hide();

      $("#start_rec_pay_cpp_qpp_spouse").val("yes");
    } else {
      $(".spouse-pay-show-field").show();
      $(".pension-age-second").removeClass("hidden");

      $(".pension-age-second").show();
      $("#start_rec_pay_cpp_qpp_spouse").val("no");
    }
  });

  $("#step3-tglr").click(function (e) {
    let activeClass12 = jQuery("#step12-tglr").hasClass("active");
    if ($(this).hasClass("active")) {
      if (activeClass12) {
        $(".spouse-pay-show-field").hide();
      }
      $(".pension-age-first").hide();

      $("#start_rec_pay_cpp_qpp").val("yes");
    } else {
      $(".spouse-pay-show-field").show();
      $(".pension-age-first").show();
      $("#start_rec_pay_cpp_qpp").val("no");
    }
  });

  $("#step4-tglr").click(function (e) {
    let activeClass13 = jQuery("#step13-tglr").hasClass("active");

    if ($(this).hasClass("active")) {
      if (activeClass13) {
        $(".security-pay-show-field").hide();
      }
      $(".security-age-first").hide();
      $("#start_OAS_pay").val("yes");
    } else {
      $(".security-pay-show-field").show();
      $(".security-age-first").show();
      $("#start_OAS_pay").val("no");
    }
  });

  $("#step13-tglr").click(function (e) {
    let activeClass4 = jQuery("#step4-tglr").hasClass("active");
    if ($(this).hasClass("active")) {
      if (activeClass4) {
        $(".security-pay-show-field").hide();
      }
      $(".security-age-second").hide();
      $("#start_OAS_pay_spouse").val("yes");
    } else {
      $(".security-pay-show-field").show();
      $(".security-age-second").removeClass("hidden");
      $(".security-age-second").show();
      $("#start_OAS_pay_spouse").val("no");
    }
  });

  $("#step5-tglr").click(function (e) {
    let activeClass15 = jQuery("#step15-tglr").hasClass("active");
    if ($(this).hasClass("active")) {
      if (activeClass15) {
        $(".benifit-pay-show-field").hide();
      }
      $(".benifit-age-first").hide();
      $("#start_def_ben_pens").val("yes");
    } else {
      $(".benifit-pay-show-field").show();
      $(".benifit-age-first").show();
      $("#start_def_ben_pens").val("no");
    }
  });

  $("#step15-tglr").click(function (e) {
    let activeClass5 = jQuery("#step5-tglr").hasClass("active");
    if ($(this).hasClass("active")) {
      if (activeClass5) {
        $(".benifit-pay-show-field").hide();
      }
      $(".benifit-age-second").hide();
      $("#start_def_ben_pens_spouse").val("yes");
    } else {
      $(".benifit-pay-show-field").show();
      $(".benifit-age-second").removeClass("hidden");
      $(".benifit-age-second").show();
      $("#start_def_ben_pens_spouse").val("no");
    }
  });
  /* ========== toggle button js end ========== */

  /* ========== data-save js start ========== */

  $("#first_step").click(function () {
    let old_data = $("#old_are").val();
    let life_expect = $("#life_expect").val();
    let live = $("#live").val();
    let live_spouse = live;
    let info_are = $("#info_are").val();
    let info_sn_are = $("#info_sn_are").val();
    let estimate_expect = $("#estimate_expect").val();
    let estimate_sn_expect = $("#estimate_sn_expect").val();
    let est_with_spouse = $("#est_with_spouse").val();

    let step_1 = {
      old_are: old_data,
      life_expect: life_expect,
      live: live,
      live_spouse: live_spouse,
      info_are: info_are,
      info_sn_are: info_sn_are,
      estimate_expect: estimate_expect,
      estimate_sn_expect: estimate_sn_expect,
      est_with_spouse: est_with_spouse,
    };

    // let all_step_data = {
    //     step_1,
    // }

    // let all_step_data_string = JSON.stringify(all_step_data);

    let all_step_data_json_string = localStorage.getItem(user_step_data);

    if (all_step_data_json_string) {
      let all_step_data_arr = JSON.parse(all_step_data_json_string);

      Object.assign(all_step_data_arr, {
        step_1: step_1,
      });

      let all_step_data_string = JSON.stringify(all_step_data_arr);

      localStorage.setItem(user_step_data, all_step_data_string);
    } else {
      let all_step_data = {
        step_1,
      };

      let all_step_data_string = JSON.stringify(all_step_data);

      localStorage.setItem(user_step_data, all_step_data_string);
    }
  });

  $("#second_step").click(function () {
    let investor_main = $("#investor_main").val();

    let income_rate = $("#income_rate").val();
    let growth_rate = $("#growth_rate").val();

    /* rate calucaltion from table start  */

    if (investor_main == "risk") {
      if (growth_rate == "") {
        growth_rate = 1.5;
      } else {
        growth_rate = growth_rate;
      }

      if (income_rate == "") {
        income_rate = 1.5;
      } else {
        income_rate = income_rate;
      }
    } else if (investor_main == "conservative") {
      if (growth_rate == "") {
        growth_rate = 2;
      } else {
        growth_rate = growth_rate;
      }

      if (income_rate == "") {
        income_rate = 2;
      } else {
        income_rate = income_rate;
      }
    } else if (investor_main == "moderate") {
      if (growth_rate == "") {
        growth_rate = 2.5;
      } else {
        growth_rate = growth_rate;
      }

      if (income_rate == "") {
        income_rate = 2.5;
      } else {
        income_rate = income_rate;
      }
    } else if (investor_main == "aggressive") {
      if (growth_rate == "") {
        growth_rate = 3;
      } else {
        growth_rate = growth_rate;
      }

      if (income_rate == "") {
        income_rate = 3;
      } else {
        income_rate = income_rate;
      }
    } else if (investor_main == "speculative") {
      if (growth_rate == "") {
        growth_rate = 3.5;
      } else {
        growth_rate = growth_rate;
      }

      if (income_rate == "") {
        income_rate = 3.5;
      } else {
        income_rate = income_rate;
      }
    }

    /* rate calucaltion from table end */

    let specify_return = $("#specify_return").val();
    let all_step_data_json_string = localStorage.getItem(user_step_data);
    let all_step_data_arr = JSON.parse(all_step_data_json_string);
    let wsc_own_ror = $("#wsc_own_ror").val();

    let step_2 = {
      inflation_rate: $("input[name=inflation_rate]").val(),
      investor_main: investor_main,
      income_rate: income_rate,
      growth_rate: growth_rate,
      specify_return: specify_return,
      wsc_own_ror: wsc_own_ror,
    };

    Object.assign(all_step_data_arr, {
      step_2: step_2,
    });

    let all_step_data_string = JSON.stringify(all_step_data_arr);

    localStorage.setItem(user_step_data, all_step_data_string);
  });

  $("#fourth_step").click(function () {
    let your_income = $("#your_income").val();
    let spouse_income = $("#spouse_income").val();

    let your_date = $("#your_date").val();
    let arr = your_date.split("-");
    let start_date = arr[0];
    let end_date = arr[1];

    let spouse_date = $("#spouse_date").val();
    let spo_arr = spouse_date.split("-");
    let spouse_start_date = spo_arr[0];
    let spouse_end_date = spo_arr[1];

    let other_income = jQuery("input[name^=other_income]")
      .map(function (idx, elem) {
        //console.log(jQuery(elem).val());
        return jQuery(elem).val();
      })
      .get();

    // let other_income = jQuery('input[name^=other_income]').map(function(idx, elem) {
    //     let value = jQuery(elem).val();
    //     return value;
    // }).get();

    // var values = [];

    // jQuery('input[name="other_income"]').each(function() {
    //   var inputValue = $(this).val();
    //   values.push(inputValue);
    // });

    // console.log(values);

    //console.log(other_income);

    //console.log('other_income' + other_income);

    let other_spouse_income = jQuery("input[name^=other_spouse_income]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    let other_date = jQuery("input[name^=other_date]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    // jQuery.map(other_date,function(value){
    //     return value.split('');
    //  });

    // jQuery.each(other_date, function(key, value) {
    // });

    let other_spouse_date = jQuery("input[name^=other_spouse_date]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();

    let all_step_data_json_string = localStorage.getItem(user_step_data);
    let all_step_data_arr = JSON.parse(all_step_data_json_string);

    let step_3 = {
      spouse_date: spouse_date,
      spouse_start_date: spouse_start_date,
      spouse_end_date: spouse_end_date,
      your_date: your_date,
      start_date: start_date,
      end_date: end_date,
      spouse_income: spouse_income,
      your_income: your_income,
      other_income: other_income,
      other_spouse_income: other_spouse_income,
      other_date: other_date,
      // "other_start_date": other_start_date,
      // "other_end_date": other_end_date,
      other_spouse_date: other_spouse_date,
    };

    Object.assign(all_step_data_arr, {
      step_3: step_3,
    });

    let all_step_data_string = JSON.stringify(all_step_data_arr);

    localStorage.setItem(user_step_data, all_step_data_string);
  });

  $("#six_step").click(function () {
    //let ps_spouse_age = $('#ps_spouse_age').val();
    let pension_age = $("#pension_age").val();
    let pension_sn_age = $("#pension_sn_age").val();
    let pension_amount = $("#pension_amount").val();
    let pension_sn_amount = $("#pension_sn_amount").val();
    //let sc_spouse_age = $('#sc_spouse_age').val();
    let security_age = $("#security_age").val();
    let security_sn_age = $("#security_sn_age").val();
    let security_sn_amount = $("#security_sn_amount").val();
    //let bp_spouse_age = $('#bp_spouse_age').val();
    let benifit_age = $("#benifit_age").val();
    let benifit_sn_age = $("#benifit_sn_age").val();
    let benifit_amount = $("#benifit_amount").val();
    let benifit_sn_amount = $("#benifit_sn_amount").val();
    //let index_spouse_age = $('#index_spouse_age').val();
    let security_amount = $("#security_amount").val();

    let indexed_to_inflatiton = $("#indexed_to_inflatiton").val();
    let indexed_to_inflatiton_spouse = $("#indexed_to_inflatiton_spouse").val();

    let start_rec_pay_cpp_qpp = $("#start_rec_pay_cpp_qpp").val();
    let start_rec_pay_cpp_qpp_spouse = $("#start_rec_pay_cpp_qpp_spouse").val();

    let start_OAS_pay = $("#start_OAS_pay").val();
    let start_OAS_pay_spouse = $("#start_OAS_pay_spouse").val();

    let start_def_ben_pens = $("#start_def_ben_pens").val();
    let start_def_ben_pens_spouse = $("#start_def_ben_pens_spouse").val();

    let all_step_data_json_string = localStorage.getItem(user_step_data);
    let all_step_data_arr = JSON.parse(all_step_data_json_string);

    let step_4 = {
      //"ps_spouse_age": ps_spouse_age,
      pension_age: pension_age,
      pension_sn_age: pension_sn_age,
      pension_amount: pension_amount,
      pension_sn_amount: pension_sn_amount,
      //"sc_spouse_age": sc_spouse_age,
      security_age: security_age,
      security_sn_age: security_sn_age,
      security_amount: security_amount,
      security_sn_amount: security_sn_amount,
      //"bp_spouse_age": bp_spouse_age,
      benifit_age: benifit_age,
      benifit_sn_age: benifit_sn_age,
      benifit_amount: benifit_amount,
      benifit_sn_amount: benifit_sn_amount,
      //"index_spouse_age": index_spouse_age,
      indexed_to_inflatiton: indexed_to_inflatiton,
      indexed_to_inflatiton_spouse: indexed_to_inflatiton_spouse,
      start_rec_pay_cpp_qpp: start_rec_pay_cpp_qpp,
      start_rec_pay_cpp_qpp_spouse: start_rec_pay_cpp_qpp_spouse,
      start_OAS_pay: start_OAS_pay,
      start_OAS_pay_spouse: start_OAS_pay_spouse,
      start_def_ben_pens: start_def_ben_pens,
      start_def_ben_pens_spouse: start_def_ben_pens_spouse,
    };

    Object.assign(all_step_data_arr, {
      step_4: step_4,
    });

    let all_step_data_string = JSON.stringify(all_step_data_arr);

    localStorage.setItem(user_step_data, all_step_data_string);
  });

  $("#eight_step").click(function () {
    //let account_main = $('#account_main').val();
    let account_main = $(".account_main :selected")
      .map(function (i, el) {
        return $(el).val();
      })
      .get();

    let spouse_main = $(".spouse_main :selected")
      .map(function (i, el) {
        return $(el).val();
      })
      .get();
    let account_value = jQuery("input[name^=account_value]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();
    let spouse_value = jQuery("input[name^=spouse_value]")
      .map(function (idx, elem) {
        return jQuery(elem).val();
      })
      .get();
    let ct_account_value = $("#ct_account_value").val();
    let st_account_value = $("#st_account_value").val();
    let ct_book_value = $("#ct_book_value").val();
    let st_book_value = $("#st_book_value").val();
    let estate_value = $("#estate_value").val();
    let se_estate_value = $("#se_estate_value").val();
    let asset_by_main = $("#asset_by_main").val();
    let se_asset_by_main = $("#se_asset_by_main").val();

    let all_step_data_json_string = localStorage.getItem(user_step_data);
    let all_step_data_arr = JSON.parse(all_step_data_json_string);

    let step_5 = {
      account_main: account_main,
      spouse_main: spouse_main,
      account_value: account_value,
      spouse_value: spouse_value,
      ct_account_value: ct_account_value,
      st_account_value: st_account_value,
      ct_book_value: ct_book_value,
      st_book_value: st_book_value,
      estate_value: estate_value,
      se_estate_value: se_estate_value,
      asset_by_main: asset_by_main,
      se_asset_by_main: se_asset_by_main,
    };

    Object.assign(all_step_data_arr, {
      step_5: step_5,
    });

    let all_step_data_string = JSON.stringify(all_step_data_arr);

    localStorage.setItem(user_step_data, all_step_data_string);
  });

  $("#ten_step").click(function () {
    var form3 = jQuery("#six_form");

    form3.validate({
      rules: {
        plan_return: {
          required: true,
          //number: true,
        },
      },
      messages: {
        plan_return: {
          required: "Please enter the year",
        },
      },
    });
    if (form3.valid() === true) {
      jQuery("#third_field").hide();
      jQuery("#td_second_section").hide();
      jQuery("#td_first_section").hide();
      jQuery("#four_field").show();
      jQuery(".btContentHolder").find(".main-content").removeClass("third-img-sec");
      jQuery(".btContentHolder").find(".main-content").addClass("fourth-img-sec");
      jQuery(".progress-asset").find("span").css("width", "100%");
      jQuery(".progress-asset").find(".progress-step-icon").addClass("inactive");
      jQuery(".progress-asset").find(".progress-step-icon").removeClass("active");
      jQuery(".progress-expense").find(".progress-step-icon").addClass("active");
      jQuery(".progress-expense").find("span").css("width", "60%");
    }

    let primary_value = $("#primary_value").val();
    let plan_return = $("#plan_return").val();
    let wsc_sell_home_future = $("#wsc_sell_home_future").val();

    let all_step_data_json_string = localStorage.getItem(user_step_data);
    let all_step_data_arr = JSON.parse(all_step_data_json_string);

    let step_6 = {
      primary_value: primary_value,
      plan_return: plan_return,
      wsc_sell_home_future: wsc_sell_home_future,
    };

    Object.assign(all_step_data_arr, {
      step_6: step_6,
    });

    let all_step_data_string = JSON.stringify(all_step_data_arr);

    localStorage.setItem(user_step_data, all_step_data_string);
  });

  /* ========== data-save js end ========== */
  jQuery("#re-first-btn").click(function (e) {
    //alert('ewfrefr');
    jQuery("#first_field").show();
    jQuery("#first_section").show();
    jQuery("#second_field").hide();
    jQuery("#second_step").click(function (e) {
      jQuery("#second_section").hide();
      jQuery("#sf_first_section").show();
    });
    jQuery("#third_field").hide();
    jQuery("#six_step").click(function (e) {
      jQuery("#sf_second_section").hide();
      jQuery("#td_first_section").show();
    });
    jQuery("#four_field").hide();
    jQuery("#five_field").hide();
    jQuery("#seven_field").hide();
    jQuery(".progress-income").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-asset").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-step").find(".progress-step-icon").addClass("active");
    jQuery(".progress-done").find(".progress-step-icon").removeClass("active");
    jQuery(".progress-done").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "0%");
    jQuery(".progress-income").find("span").css("width", "0%");
    jQuery(".progress-step").find("span").css("width", "50%");
  });

  jQuery("#re-second-btn, #edit-second-btn").click(function (e) {
    //alert('ffdf');
    jQuery("#first_section").hide();
    jQuery("#second_section").hide();
    jQuery("#second_field").show();
    jQuery("#sf_first_section").show();
    jQuery("#sf_second_section").hide();
    jQuery("#second_step").click(function (e) {
      jQuery("#second_section").hide();
      jQuery("#sf_first_section").show();
    });
    jQuery("#third_field").hide();
    jQuery("#six_step").click(function (e) {
      jQuery("#sf_second_section").hide();
      jQuery("#td_first_section").show();
    });
    jQuery("#four_field").hide();
    jQuery("#five_field").hide();
    jQuery("#seven_field").hide();
    jQuery(".btContentHolder").find(".main-content").addClass("second-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-asset").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-income").find(".progress-step-icon").addClass("active");
    jQuery(".progress-done").find(".progress-step-icon").removeClass("active");
    jQuery(".progress-done").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "0%");
    jQuery(".progress-income").find("span").css("width", "50%");
  });

  jQuery("#re-third-btn, #edit-non-reg-btn, #edit-life-btn").click(function (e) {
    //alert('ffdf');
    jQuery("#seven_field").hide();
    jQuery("#four_field").hide();
    jQuery("#five_field").hide();
    jQuery("#second_field").hide();
    jQuery("#third_field").show();
    jQuery("#td_second_section").hide();
    jQuery("#td_first_section").show();

    //jQuery("#first_field").show();
    jQuery(".btContentHolder").find(".main-content").addClass("third-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-income").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-asset").find(".progress-step-icon").addClass("active");
    jQuery(".progress-done").find(".progress-step-icon").removeClass("active");
    jQuery(".progress-done").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "60%");
  });

  jQuery("#re-fourth-btn, #edit-care-btn").click(function (e) {
    //alert('ffdf');
    jQuery("#seven_field").hide();
    jQuery("#third_field").hide();
    jQuery("#five_field").hide();
    jQuery("#first_field").hide();
    jQuery("#second_field").hide();
    jQuery("#four_field").show();
    jQuery("#fr_first_section").show();
    jQuery(".btContentHolder").find(".main-content").addClass("fourth-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-expense").find(".progress-step-icon").addClass("active");
    jQuery(".progress-done").find(".progress-step-icon").removeClass("active");
    jQuery(".progress-done").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "60%");
  });

  /* ========== summary-edit-button js start ========== */

  jQuery("#editPension-second-btn, #editBenefit-second-btn, #editage-second-btn").click(function (e) {
    //alert('ffdf');
    jQuery("#first_section").hide();
    jQuery("#second_section").hide();
    jQuery("#second_field").show();
    jQuery("#sf_first_section").hide();
    jQuery("#sf_second_section").show();
    jQuery("#second_step").click(function (e) {
      jQuery("#second_section").hide();
      jQuery("#sf_first_section").show();
    });
    jQuery("#third_field").hide();
    jQuery("#six_step").click(function (e) {
      jQuery("#sf_second_section").hide();
      jQuery("#td_first_section").show();
    });
    jQuery("#four_field").hide();
    jQuery("#five_field").hide();
    jQuery("#seven_field").hide();
    jQuery(".btContentHolder").find(".main-content").addClass("second-img-sec");

    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");

    jQuery(".progress-asset").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-income").find(".progress-step-icon").addClass("active");
    jQuery(".progress-done").find(".progress-step-icon").removeClass("active");
    jQuery(".progress-done").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "0%");
    jQuery(".progress-income").find("span").css("width", "50%");
  });

  jQuery("#edit-primary-btn").click(function (e) {
    //alert('ffdf');
    jQuery("#seven_field").hide();
    jQuery("#four_field").hide();
    jQuery("#five_field").hide();
    jQuery("#second_field").hide();
    jQuery("#third_field").show();
    jQuery("#td_first_section").hide();
    jQuery("#td_second_section").show();
    jQuery("#first_field").show();
    jQuery(".btContentHolder").find(".main-content").addClass("third-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-income").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-asset").find(".progress-step-icon").addClass("active");
    jQuery(".progress-done").find(".progress-step-icon").removeClass("active");
    jQuery(".progress-done").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "60%");
  });

  jQuery("#edit-oneoff-btn, #edit-donate-btn, #edit-desired-btn").click(function (e) {
    //alert('ffdf');
    jQuery("#seven_field").hide();
    jQuery("#third_field").hide();
    jQuery("#four_field").hide();
    jQuery("#first_field").hide();
    jQuery("#second_field").hide();
    jQuery("#five_field").show();
    jQuery("#five_first_section").show();
    jQuery(".btContentHolder").find(".main-content").addClass("fourth-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-asset").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-income").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-expense").find(".progress-step-icon").addClass("active");
    jQuery(".progress-done").find(".progress-step-icon").removeClass("active");
    jQuery(".progress-done").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "60%");
  });

  /* ========== summary-edit-button js end ========== */

  function calculateTotal(income) {
    var total = 0;
    $.each(income, function (index, value) {
      var parsedValue = parseFloat(value.toString().replace("$", "").replace(/,/g, ""));
      total += parsedValue;
    });
    return total;
  }
  jQuery("#fourteen_step").on("click", function (e) {
    var spose_field_check = jQuery("#cb_value").prop("checked");
    var checkbox_value = jQuery("#cb_value").val();
    var abc = localStorage.getItem(user_step_data);
    var arr = jQuery.parseJSON(abc);

    // Generate chart from api call
    var local_data = localStorage.getItem(user_step_data);
    var local_stored_data = jQuery.parseJSON(local_data);
    var wsc_remove_storage_data = wsc_cal_local_st_var.wsc_remove_storage_data;


    var spinner = document.getElementById("spinner");
    // Show spinner
    spinner.classList.remove("hidden");

    var form9 = jQuery("#nine_form");
    form9.validate({
      rules: {
        // "expense_type_main_val[]": {
        //     required: true,
        //     //number: true,
        // },
        // "oneoff_expense_main[]": {
        //     required: true,
        //     //number: true,
        // },
        // "expense_type_spouse_val[]": {
        //     required: true,
        //     //number: true,
        // },
        // "oneoff_expense_spouse[]": {
        //     required: true,

        // },
        // "donate_plan_main[]": {
        //     required: true,

        // },
        // "donate_plan_spouse[]": {
        //     required: true,

        // },
        // "donate_plan_no_main[]": {
        //     required: true,

        // },
        // "donate_plan_no_spouse[]": {
        //     required: true,

        // },
        desired_estate_main: {
          required: true,
          //number: true,
        },
      },
      messages: {
        // "expense_type_main_val[]": {
        //     required: "Please enter the value.",
        // },
        // "oneoff_expense_main[]": {
        //     required: "Please enter the value.",
        // },
        // "expense_type_spouse_val[]": {
        //     required: "Please enter the value.",
        // },
        // "oneoff_expense_spouse[]": {
        //     required: "Please enter the value.",
        // },
        // "donate_plan_main[]": {
        //     required: "Please enter the value.",
        // },
        // "donate_plan_spouse[]": {
        //     required: "Please enter the value.",
        // },
        // "donate_plan_no_main[]": {
        //     required: "Please enter the value.",
        // },
        // "donate_plan_no_spouse[]": {
        //     required: "Please enter the value.",
        // },
        desired_estate_main: {
          required: "Please enter the value.",
        },
      },
    });

    if (form9.valid() === true) {
        jQuery.ajax({
        type: "POST",
        url: wsc_cal_local_st_var.wsc_storage_data_ajax_url,
        async: true,
        dataType: "JSON",
        data: {
            action: "local_storage_data",
            local_stored_data: local_stored_data,
        },
        success: function (response) {
            spinner.classList.add("hidden");

            jQuery(".progress-expense").find(".progress-step-icon").addClass("inactive");
            jQuery(".btContentHolder").find(".main-content").removeClass("fourth-img-sec");
            jQuery(".btContentHolder").find(".main-content").addClass("fifth-img-sec");
            jQuery(".progress-expense").find("span").css("width", "100%");
            jQuery(".progress-expense").find(".progress-step-icon").removeClass("active");
            jQuery(".progress-done").find(".progress-step-icon").addClass("active");
            jQuery("#five_field").hide(); // show the results page here
            jQuery("#seven_field").show();

            setTimeout(function () {
            chart_load(response.data.api);
            }, 2500);
            //console.log("api_data==>",response.data.api);
            /* jQuery(".general-table").html(response.data.html);*/
            jQuery(".income-table").html(response.data.html1);

            /* REMOVE LOCAL STORAGE DATA FOR FREE USERS */
            if (wsc_remove_storage_data != "0") {
            //localStorage.removeItem('all_step_data');
            //jQuery('#msform').find('input:text').val('');
            }
            /* REMOVE LOCAL STORAGE DATA FOR FREE USERS */

            //console.log(arr);
            var old_age = arr["step_1"]["old_are"];
            var life_age = arr["step_1"]["life_expect"];
            var live_age = arr["step_1"]["live"];
            var info_are = arr["step_1"]["info_are"];
            var estimate_expect = arr["step_1"]["estimate_expect"];
            var live_spouse = arr["step_1"]["live_spouse"];

            //account_value
            var account_value = arr["step_5"]["account_value"];
            var spouse_value = arr["step_5"]["spouse_value"];
            var new_account_value = calculateTotal(account_value);
            var new_spouse_value = "";
            if (spose_field_check) {
            new_spouse_value = calculateTotal(spouse_value);
            }
            if (isNaN(new_account_value) || new_account_value === null || new_account_value === undefined || new_account_value === "") {
            new_account_value = "";
            }
            if (isNaN(new_spouse_value) || new_spouse_value === null || new_spouse_value === undefined || new_spouse_value === "") {
            new_spouse_value = "";
            }
            var total_account_income = new_account_value + new_spouse_value == 0 ? "" : "$" + (new_account_value + new_spouse_value);

            //ct_account_value
            var ct_account_value = parseFloat(arr["step_5"]["ct_account_value"].replace("$", "").replace(/,/g, ""));
            var st_account_value = parseFloat(arr["step_5"]["st_account_value"].replace("$", "").replace(/,/g, ""));
            if (!spose_field_check || isNaN(st_account_value) || st_account_value === null || st_account_value === undefined || st_account_value === "") {
            st_account_value = 0;
            }
            var total_t_account = ct_account_value + st_account_value;
            var total_t_account_show = "$" + total_t_account;
            if (isNaN(total_t_account) || total_t_account === null || total_t_account === undefined || total_t_account === "") {
            var total_t_account_show = "";
            }

            //estate_value
            var estate_value = parseFloat(arr["step_5"]["estate_value"].replace("$", "").replace(/,/g, ""));
            var se_estate_value = parseFloat(arr["step_5"]["se_estate_value"].replace("$", "").replace(/,/g, ""));
            if (!spose_field_check || isNaN(se_estate_value) || se_estate_value === null || se_estate_value === undefined || se_estate_value === "") {
            se_estate_value = 0;
            }
            var total_estate_account = estate_value + se_estate_value;
            var total_estate_account_show = "$" + total_estate_account;
            if (isNaN(total_estate_account) || total_estate_account === null || total_estate_account === undefined || total_estate_account === "") {
            var total_estate_account_show = "";
            }

            //primary_value
            var primary_value = arr["step_6"]["primary_value"];

            //your_income
            var your_income = parseFloat(arr["step_3"]["your_income"].replace("$", "").replace(/,/g, ""));
            var spouse_income = parseFloat(arr["step_3"]["spouse_income"].replace("$", "").replace(/,/g, ""));
            if (!spose_field_check || isNaN(spouse_income) || spouse_income === null || spouse_income === undefined || spouse_income === "") {
            spouse_income = "";
            }
            var total_income = your_income + spouse_income;

            var total_income_show = "$" + total_income;

            if (isNaN(total_income) || total_income === null || total_income === undefined || total_income === "") {
            var total_income_show = "";
            }

            /* other income value get for you and spouse */
            var other_income = arr["step_3"]["other_income"];
            var other_spouse_income = arr["step_3"]["other_spouse_income"];
            var new_other_income = calculateTotal(other_income);
            var new_other_spouse_income = "";
            if (spose_field_check) {
            new_other_spouse_income = calculateTotal(other_spouse_income);
            }
            if (isNaN(new_other_income) || new_other_income === null || new_other_income === undefined || new_other_income === "") {
            new_other_income = "";
            }
            if (isNaN(new_other_spouse_income) || new_other_spouse_income === null || new_other_spouse_income === undefined || new_other_spouse_income === "") {
            new_other_spouse_income = "";
            }
            var total_other_income = new_other_income + new_other_spouse_income == 0 ? "" : "$" + (new_other_income + new_other_spouse_income);

            //pension_amount
            var pension_amount = parseFloat(arr["step_4"]["pension_amount"].replace("$", "").replace(/,/g, ""));
            var pension_sn_amount = parseFloat(arr["step_4"]["pension_sn_amount"].replace("$", "").replace(/,/g, ""));
            if (!spose_field_check || isNaN(pension_sn_amount) || pension_sn_amount === null || pension_sn_amount === undefined || pension_sn_amount === "") {
            pension_sn_amount = "";
            }
            var pension_t_income = pension_amount + pension_sn_amount;
            var total_pension_show = "$" + pension_t_income;
            if (isNaN(pension_t_income) || pension_t_income === null || pension_t_income === undefined || total_income === "") {
            var total_pension_show = "";
            }

            //security_amount
            var security_amount = parseFloat(arr["step_4"]["security_amount"].replace("$", "").replace(/,/g, ""));
            var security_sn_amount = parseFloat(arr["step_4"]["security_sn_amount"].replace("$", "").replace(/,/g, ""));
            if (!spose_field_check || isNaN(security_sn_amount) || security_sn_amount === null || security_sn_amount === undefined || security_sn_amount === "") {
            security_sn_amount = "";
            }
            var security_t_income = security_amount + security_sn_amount;
            var total_security_show = "$" + security_t_income;
            if (isNaN(security_t_income) || security_t_income === null || security_t_income === undefined || security_t_income === "") {
            var total_security_show = "";
            }

            //benifit_amount
            var benifit_amount = parseFloat(arr["step_4"]["benifit_amount"].replace("$", "").replace(/,/g, ""));
            var benifit_sn_amount = parseFloat(arr["step_4"]["benifit_sn_amount"].replace("$", "").replace(/,/g, ""));
            if (!spose_field_check || isNaN(benifit_sn_amount) || benifit_sn_amount === null || benifit_sn_amount === undefined || benifit_sn_amount === "") {
            benifit_sn_amount = "";
            }
            var benifit_t_income = benifit_amount + benifit_sn_amount;
            var total_benifit_show = "$" + benifit_t_income;
            if (isNaN(benifit_t_income) || benifit_t_income === null || benifit_t_income === undefined || benifit_t_income === "") {
            var total_benifit_show = "";
            }

            //Expenses
            var expense_field_check = jQuery("#prefer-value").prop("checked");
            var expense_spouse_field_check = jQuery("#spouse-prefer-value").prop("checked");

            var annual_expense = parseFloat(arr["step_7"]["annual_expense"].replace("$", "").replace(/,/g, ""));
            var annual_age = parseFloat(arr["step_7"]["annual_age"].replace("$", "").replace(/,/g, ""));
            var second_annual_age = parseFloat(arr["step_7"]["second_annual_age"].replace("$", "").replace(/,/g, ""));
            var third_annual_age = parseFloat(arr["step_7"]["third_annual_age"].replace("$", "").replace(/,/g, ""));

            var se_annual_expense = parseFloat(arr["step_7"]["se_annual_expense"].replace("$", "").replace(/,/g, ""));
            var spouse_annual_age = parseFloat(arr["step_7"]["spouse_annual_age"].replace("$", "").replace(/,/g, ""));
            var spouse_se_annual_age = parseFloat(arr["step_7"]["spouse_se_annual_age"].replace("$", "").replace(/,/g, ""));
            var spouse_th_annual_age = parseFloat(arr["step_7"]["spouse_th_annual_age"].replace("$", "").replace(/,/g, ""));

            var annual_t_income = "";
            if (!spose_field_check || isNaN(se_annual_expense) || se_annual_expense === null || se_annual_expense === undefined || se_annual_expense === "") {
            se_annual_expense = 0;
            }
            if (!spose_field_check || isNaN(spouse_annual_age) || spouse_annual_age === null || spouse_annual_age === undefined || spouse_annual_age === "") {
            spouse_annual_age = 0;
            }
            if (!spose_field_check || isNaN(spouse_se_annual_age) || spouse_se_annual_age === null || spouse_se_annual_age === undefined || spouse_se_annual_age === "") {
            spouse_se_annual_age = 0;
            }
            if (!spose_field_check || isNaN(spouse_th_annual_age) || spouse_th_annual_age === null || spouse_th_annual_age === undefined || spouse_th_annual_age === "") {
            spouse_th_annual_age = 0;
            }

            if (expense_field_check && !expense_spouse_field_check) {
            annual_t_income = se_annual_expense + annual_age + second_annual_age + third_annual_age;
            var total_annual_show = "$" + annual_t_income;
            if (isNaN(annual_t_income) || annual_t_income === null || annual_t_income === undefined || annual_t_income === "") {
                var total_annual_show = "";
            }
            } else if (!expense_field_check && expense_spouse_field_check) {
            annual_t_income = annual_expense + spouse_annual_age + spouse_se_annual_age + spouse_th_annual_age;
            var total_annual_show = "$" + annual_t_income;
            if (isNaN(annual_t_income) || annual_t_income === null || annual_t_income === undefined || annual_t_income === "") {
                var total_annual_show = "";
            }
            } else if (expense_field_check && expense_spouse_field_check) {
            var annual_t_income = 0;
            if (expense_field_check) {
                annual_t_income = annual_t_income + annual_age + second_annual_age + third_annual_age;
            }
            if (expense_spouse_field_check) {
                annual_t_income = annual_t_income + spouse_annual_age + spouse_se_annual_age + spouse_th_annual_age;
            }
            var total_annual_show = "$" + annual_t_income;
            if (isNaN(annual_t_income) || annual_t_income === null || annual_t_income === undefined || annual_t_income === "") {
                var total_annual_show = "";
            }
            } else if (!expense_field_check && !expense_spouse_field_check) {
            var annual_t_income = annual_expense + se_annual_expense;
            var total_annual_show = "$" + annual_t_income;
            if (isNaN(annual_t_income) || annual_t_income === null || annual_t_income === undefined || annual_t_income === "") {
                var total_annual_show = "";
            }
            }

            //Health Care
            var care_expense = parseFloat(arr["step_7"]["care_expense"].replace("$", "").replace(/,/g, ""));
            var care_age = parseFloat(arr["step_7"]["care_age"].replace("$", "").replace(/,/g, ""));
            var second_care_age = parseFloat(arr["step_7"]["second_care_age"].replace("$", "").replace(/,/g, ""));
            var third_care_age = parseFloat(arr["step_7"]["third_care_age"].replace("$", "").replace(/,/g, ""));

            var se_care_expense = parseFloat(arr["step_7"]["se_care_expense"].replace("$", "").replace(/,/g, ""));
            var spouse_care_age = parseFloat(arr["step_7"]["spouse_care_age"].replace("$", "").replace(/,/g, ""));
            var spouse_se_care_age = parseFloat(arr["step_7"]["spouse_se_care_age"].replace("$", "").replace(/,/g, ""));
            var spouse_th_care_age = parseFloat(arr["step_7"]["spouse_th_care_age"].replace("$", "").replace(/,/g, ""));

            var care_t_income = "";

            if (!spose_field_check || isNaN(se_care_expense) || se_care_expense === null || se_care_expense === undefined || se_care_expense === "") {
            se_care_expense = 0;
            }
            if (!spose_field_check || isNaN(spouse_care_age) || spouse_care_age === null || spouse_care_age === undefined || spouse_care_age === "") {
            spouse_care_age = 0;
            }
            if (!spose_field_check || isNaN(spouse_se_care_age) || spouse_se_care_age === null || spouse_se_care_age === undefined || spouse_se_care_age === "") {
            spouse_se_care_age = 0;
            }
            if (!spose_field_check || isNaN(spouse_th_care_age) || spouse_th_care_age === null || spouse_th_care_age === undefined || spouse_th_care_age === "") {
            spouse_th_care_age = 0;
            }

            if (expense_field_check && !expense_spouse_field_check) {
            care_t_income = se_care_expense + care_age + second_care_age + third_care_age;

            var total_care_show = "$" + care_t_income;

            if (isNaN(care_t_income) || care_t_income === null || care_t_income === undefined || care_t_income === "") {
                var total_care_show = "";
            }
            } else if (!expense_field_check && expense_spouse_field_check) {
            care_t_income = care_expense + spouse_care_age + spouse_se_care_age + spouse_th_care_age;

            var total_care_show = "$" + care_t_income;

            if (isNaN(care_t_income) || care_t_income === null || care_t_income === undefined || care_t_income === "") {
                var total_care_show = "";
            }
            } else if (expense_field_check && expense_spouse_field_check) {
            var care_t_income = 0;

            if (expense_field_check) {
                care_t_income = care_t_income + care_age + second_care_age + third_care_age;
            }
            if (expense_spouse_field_check) {
                care_t_income = care_t_income + spouse_care_age + spouse_se_care_age + spouse_th_care_age;
            }
            var total_care_show = "$" + care_t_income;
            if (isNaN(care_t_income) || care_t_income === null || care_t_income === undefined || care_t_income === "") {
                var total_care_show = "";
            }
            } else if (!expense_field_check && !expense_spouse_field_check) {
            var care_t_income = care_expense + se_care_expense;

            var total_care_show = "$" + care_t_income;

            if (isNaN(care_t_income) || care_t_income === null || care_t_income === undefined || care_t_income === "") {
                var total_care_show = "";
            }
            }

            //Charitable Donations
            var donate_plan_main = arr["step_8"]["donate_plan_main"];
            var donate_plan_spouse = arr["step_8"]["donate_plan_spouse"];
            var new_donate_income = calculateTotal(donate_plan_main);
            var new_donate_spouse_income = "";
            if (spose_field_check) {
            new_donate_spouse_income = calculateTotal(donate_plan_spouse);
            }
            if (isNaN(new_donate_income) || new_donate_income === null || new_donate_income === undefined || new_donate_income === "") {
            new_donate_income = "";
            }
            if (isNaN(new_donate_spouse_income) || new_donate_spouse_income === null || new_donate_spouse_income === undefined || new_donate_spouse_income === "") {
            new_donate_spouse_income = "";
            }

            var total_donate_income = new_donate_income + new_donate_spouse_income == 0 ? "" : "$" + (new_donate_income + new_donate_spouse_income);

            //One-off Expenses
            var expense_type_main_val = arr["step_8"]["expense_type_main_val"];
            var expense_type_spouse_val = arr["step_8"]["expense_type_spouse_val"];
            var new_expense_income = calculateTotal(expense_type_main_val);
            var new_expense_spouse_income = "";
            if (spose_field_check) {
            new_expense_spouse_income = calculateTotal(expense_type_spouse_val);
            }
            if (isNaN(new_expense_income) || new_expense_income === null || new_expense_income === undefined || new_expense_income === "") {
            new_expense_income = "";
            }
            if (isNaN(new_expense_spouse_income) || new_expense_spouse_income === null || new_expense_spouse_income === undefined || new_expense_spouse_income === "") {
            new_expense_spouse_income = "";
            }
            var total_expense_income = new_expense_income + new_expense_spouse_income == 0 ? "" : "$" + (new_expense_income + new_expense_spouse_income);

            //Desired Estate
            var desired_t_estate = arr["step_8"]["desired_estate_main"].replace("$", "");
            var total_desired_t_estate_show = "$" + desired_t_estate;

            // console.log(info_are);
            // console.log(estimate_expect);
            // console.log(live_spouse);
            //  console.log(spose_field_check);
            jQuery("div#old_age_display").html("<p>I am <span>" + old_age + " years old</span></p>");

            jQuery("div#life_expect_display").html("<p>Life expectancy is <span>" + life_age.replace("_", "") + " years</span></p>");

            jQuery("div#live_display").html("<p>I live in <span>" + live_age + "</span> </p>");

            if (spose_field_check) {
            if (info_are !== "" && info_are !== " " && info_are !== null && !isNaN(info_are) && info_are !== undefined) {
                jQuery("div#info_age_display")
                .html("<p>My spouse is <span>" + info_are + " years old</span></p>")
                .show();
            } else {
                jQuery("div#info_age_display").hide();
            }

            if (estimate_expect !== "" && estimate_expect !== " " && estimate_expect !== null && estimate_expect !== undefined) {
                jQuery("div#estimate_age_display")
                .html("<p>Life expectancy is <span>" + estimate_expect.replace("_", "") + " years</span></p>")
                .show();
            } else {
                jQuery("div#estimate_age_display").hide();
            }

            if (live_spouse !== "" && live_spouse !== null && live_spouse !== undefined) {
                jQuery("div#spouse_live_display")
                .html("<p>I live in <span>" + live_spouse + " </span></p>")
                .show();
            } else {
                jQuery("div#spouse_live_display").hide();
            }
            } else {
            jQuery("div#info_age_display").hide();
            jQuery("div#estimate_age_display").hide();
            jQuery("div#spouse_live_display").hide();
            }

            var htmlRegistered = total_account_income[0] ? "<p>Registered Investments: <span>" + formatNumberWithCommas(total_account_income) + "</span></p>" : "<p>Registered Investments: </p>";
            jQuery("div#account_display").html(htmlRegistered);

            var htmlNonRegistered = total_t_account_show[0]
            ? "<p>Non-Registered Investments: <span>" + formatNumberWithCommas(total_t_account_show) + "</span></p>"
            : "<p>Non-Registered Investments: </p>";
            jQuery("div#ct_account_display").html(htmlNonRegistered);

            var htmlLife = total_estate_account_show[0] ? "<p>Life Insurance: <span>" + formatNumberWithCommas(total_estate_account_show) + "</span></p>" : "<p>Life Insurance: </p>";
            jQuery("div#estate_display").html(htmlLife);

            var htmlPrimary = primary_value[0] ? "<p>Primary Residence: <span>" + formatNumberWithCommas(primary_value) + "</span></p>" : "<p>Primary Residence: </p>";
            jQuery("div#primary_display").html(htmlPrimary);

            var htmlincomedisplay = total_income_show[0] ? "<p>Employment Income: <span>" + formatNumberWithCommas(total_income_show) + "</span></p>" : "<p>Employment Income: </p>";
            jQuery("div#income_display").html(htmlincomedisplay);

            var htmlOtherIncome = total_other_income[0] ? "<p>Other Income: <span>" + formatNumberWithCommas(total_other_income) + "</span></p>" : "<p>Other Income: </p>";
            jQuery("div#other_display").html(htmlOtherIncome);

            var canadapension = total_pension_show[0] ? "<p>Canada Pension Plan:  <span>" + formatNumberWithCommas(total_pension_show) + "</span></p>" : "<p>Canada Pension Plan: </p>";
            jQuery("div#pension_display").html(canadapension);

            var htmlOldAge = total_security_show[0] ? "<p>Old Age Security: <span>" + formatNumberWithCommas(total_security_show) + "</span></p>" : "<p>Old Age Security: </p>";
            jQuery("div#security_display").html(htmlOldAge);

            var htmlDefined = total_benifit_show[0] ? "<p>Defined Benefit Pension: <span>" + formatNumberWithCommas(total_benifit_show) + "</span></p>" : "<p>Defined Benefit Pension: </p>";
            jQuery("div#benifit_display").html(htmlDefined);

            var htmlannualexpense = total_annual_show[0] ? "<p>Expenses: <span>" + formatNumberWithCommas(total_annual_show) + "</span></p>" : "<p>Expenses: </p>";
            jQuery("div#annual_display").html(htmlannualexpense);

            var htmlhealth = total_care_show[0] ? "<p>Health Care: <span>" + formatNumberWithCommas(total_care_show) + "</span></p>" : "<p>Health Care: </p>";
            jQuery("div#care_display").html(htmlhealth);

            var htmloneoff_display = total_expense_income[0] ? "<p>One-off Expenses: <span>" + formatNumberWithCommas(total_expense_income) + "</span></p>" : "<p>One-off Expenses: </p>";
            jQuery("div#oneoff_display").html(htmloneoff_display);

            var htmldonatedisplay = total_donate_income[0] ? "<p>Charitable Donations: <span>" + formatNumberWithCommas(total_donate_income) + "</span></p>" : "<p>Charitable Donations: </p>";
            jQuery("div#donate_display").html(htmldonatedisplay);

            var htmldesireddisplay = total_desired_t_estate_show[0] ? "<p>Desired Estate: <span>" + formatNumberWithCommas(total_desired_t_estate_show) + "</span></p>" : "<p>Desired Estate: </p>";
            jQuery("div#desired_display").html(htmldesireddisplay);
        },
        complete: {},
        });

    } else {
            spinner.classList.add("hidden");
            alert("There was an error generating the results. Please try again.")
            return false;
    }
});

  jQuery(".progress-income").on("click", function (e) {
    jQuery("#four_field").hide();
    jQuery("#five_field").hide();
    jQuery("#seven_field").hide();
    jQuery("#third_field").hide();
    jQuery("#first_field").hide();
    jQuery("#second_field").show();
    jQuery("#sf_first_section").show();
    jQuery("#sf_second_section").hide();
    jQuery(".btContentHolder").find(".main-content").removeClass("first-img-sec");
    jQuery(".btContentHolder").find(".main-content").addClass("second-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("third-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fourth-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-income .progress-step-icon").addClass("active");
    jQuery(".progress-step .progress-step-icon").removeClass("active");
    jQuery(".progress-asset .progress-step-icon").removeClass("active");
    jQuery(".progress-expense .progress-step-icon").removeClass("active");
    jQuery(".progress-income").find("span").css("width", "0%");
    jQuery(".progress-step").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery(".progress-step").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-asset").find(".progress-step-icon").removeClass("inactive");
    jQuery(".progress-expense").find(".progress-step-icon").removeClass("inactive");
    jQuery("#fifth_step").on("click", function (e) {
      jQuery(".progress-income").find(".progress-step-icon").removeClass("inactive");
      jQuery("#first_field").show();
      jQuery("#second_section").show();
      jQuery("#first_section").hide();
    });
  });

  jQuery(".progress-asset").on("click", function (e) {
    jQuery("#first_field").hide();
    jQuery("#second_field").hide();
    jQuery("#four_field").hide();
    jQuery("#five_field").hide();
    jQuery("#seven_field").hide();
    jQuery("#third_field").show();
    jQuery("#td_first_section").show();
    jQuery("#td_second_section").hide();
    jQuery(".btContentHolder").find(".main-content").removeClass("first-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("second-img-sec");
    jQuery(".btContentHolder").find(".main-content").addClass("third-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fourth-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-income .progress-step-icon").removeClass("active");
    jQuery(".progress-step .progress-step-icon").removeClass("active");
    jQuery(".progress-asset .progress-step-icon").addClass("active");
    jQuery(".progress-expense .progress-step-icon").removeClass("active");
    jQuery(".progress-income").find("span").css("width", "0%");
    jQuery(".progress-step").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery("#nine_step").on("click", function (e) {
      jQuery(".progress-income").find("span").css("width", "80%");
    });
    jQuery("#fifth_step").on("click", function (e) {
      jQuery("#first_field").show();
      jQuery("#second_section").show();
      jQuery("#first_section").hide();
    });
  });

  jQuery(".progress-expense").on("click", function (e) {
    jQuery("#first_field").hide();
    jQuery("#second_field").hide();
    jQuery("#third_field").hide();
    jQuery("#first_field").hide();
    jQuery("#five_field").hide();
    jQuery("#seven_field").hide();
    jQuery("#four_field").show();
    jQuery(".btContentHolder").find(".main-content").removeClass("first-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("second-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("third-img-sec");
    jQuery(".btContentHolder").find(".main-content").addClass("fourth-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-income .progress-step-icon").removeClass("active");
    jQuery(".progress-step .progress-step-icon").removeClass("active");
    jQuery(".progress-asset .progress-step-icon").removeClass("active");
    jQuery(".progress-expense .progress-step-icon").addClass("active");
    jQuery(".progress-income .progress-step-icon").removeClass("inactive");
    jQuery(".progress-income").find("span").css("width", "0%");
    jQuery(".progress-step").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
    jQuery("#thirteen_step").on("click", function (e) {
      jQuery("#third_field").show();
      jQuery("#td_second_section").show();
      jQuery("#td_first_section").hide();
      jQuery(".progress-asset").find("span").css("width", "60%");
    });
    jQuery("#eleven_step").on("click", function (e) {
      jQuery(".progress-asset").find("span").css("width", "40%");
    });
    jQuery("#nine_step").on("click", function (e) {
      jQuery(".progress-income").find("span").css("width", "80%");
    });
    jQuery("#fifth_step").on("click", function (e) {
      jQuery("#first_field").show();
      jQuery("#first_section").hide();
      jQuery("#second_section").show();
    });
  });

  jQuery(".progress-step").on("click", function (e) {
    jQuery("#second_section").hide();
    jQuery("#second_field").hide();
    jQuery("#third_field").hide();
    jQuery("#first_field").hide();
    jQuery("#five_field").hide();
    jQuery("#seven_field").hide();
    jQuery("#four_field").hide();
    jQuery("#first_field").show();
    jQuery("#first_section").show();
    jQuery(".btContentHolder").find(".main-content").addClass("first-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("second-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("third-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fourth-img-sec");
    jQuery(".btContentHolder").find(".main-content").removeClass("fifth-img-sec");
    jQuery(".progress-income .progress-step-icon").removeClass("active");
    jQuery(".progress-step .progress-step-icon").addClass("active");
    jQuery(".progress-asset .progress-step-icon").removeClass("active");
    jQuery(".progress-expense .progress-step-icon").removeClass("active");
    jQuery(".progress-income").find("span").css("width", "0%");
    jQuery(".progress-step").find("span").css("width", "0%");
    jQuery(".progress-asset").find("span").css("width", "0%");
    jQuery(".progress-expense").find("span").css("width", "0%");
  });

  //localstorage data get ajax
  jQuery("#fourteen_step").on("click", function () {
    // alert('darshit ajax');
    // var local_data = localStorage.getItem(user_step_data);
    // var local_stored_data = jQuery.parseJSON(local_data);
    // var wsc_remove_storage_data = wsc_cal_local_st_var.wsc_remove_storage_data;
    // //console.log('click');
    // jQuery.ajax({
    //     type: "POST",
    //     url: wsc_cal_local_st_var.wsc_storage_data_ajax_url,
    //     async: false,
    //     dataType: 'JSON',
    //     data: {
    //         'action': "local_storage_data",
    //         'local_stored_data': local_stored_data,
    //     },
    //     success: function (response) {
    //         setTimeout(function () {
    //             chart_load(response.data.api);
    //         }, 2500);
    //         //console.log("api_data==>",response.data.api);
    //         /* jQuery(".general-table").html(response.data.html);*/
    //         jQuery(".income-table").html(response.data.html1);
    //         /* REMOVE LOCAL STORAGE DATA FOR FREE USERS */
    //         if (wsc_remove_storage_data != '0') {
    //             // localStorage.removeItem('all_step_data');
    //             //jQuery('#msform').find('input:text').val('');
    //         }
    //         /* REMOVE LOCAL STORAGE DATA FOR FREE USERS */
    //     },
    //     complete: {
    //     },
    // });
  });
}); // End of ready document

jQuery(document).ready(function () {
  jQuery("#assumption-content").hide(); // Initially hide the content
  jQuery("#assumption-div").click(function () {
    jQuery("#assumption-content").toggle();
    return false;
  });

  jQuery(":input").inputmask();
  jQuery(".progress-step .progress-step-icon").addClass("active");
  jQuery(".btContentWrap.btClear").addClass("form-sec-hide");
  if (jQuery("#cb_value").is(":checked")) {
    jQuery(".spouse-hide-class").show();
  } else {
    jQuery(".spouse-hide-class").hide();
  }

  jQuery("#cb_value").change(function () {
    if (this.checked) {
      jQuery(".spouse-hide-class").show();
    } else {
      jQuery(".spouse-hide-class").hide();
    }
  });

  //report save pdf using ajax
  jQuery("#report-save-upload").click(function () {
    jQuery.ajax({
      type: "POST",
      url: wsc_save_custom_vars.wsc_save_ajax_url,
      async: false,
      dataType: "JSON",
      data: {
        action: "upload_pdf_file",
      },
    });
  });

  //report save csv using ajax
  jQuery("#report-save-upload").click(function () {
    var local_data = localStorage.getItem(user_step_data);
    var local_stored_data = jQuery.parseJSON(local_data);
    jQuery.ajax({
      type: "POST",
      url: wsc_save_custom_vars.wsc_save_ajax_url,
      async: false,
      dataType: "JSON",
      data: {
        action: "upload_csv_file",
        local_stored_data: local_stored_data,
      },
    });
  });

  jQuery(".next").not("#fourteen_step").click(function () {
    jQuery("html, body").animate({ scrollTop: 0 }, "slow");
    return false;
  });

  //pdf-download ajax
  jQuery("#pdf-button, #pdf-user").on("click", function () {
    //alert('darshit ajax');
    var local_data = localStorage.getItem(user_step_data);
    var local_stored_data = jQuery.parseJSON(local_data);
    //console.log(local_stored_data);
    jQuery.ajax({
      type: "POST",
      url: wsc_cal_local_st_var.wsc_storage_data_ajax_url,
      async: false,
      dataType: "JSON",

      data: {
        action: "pdf_downloads",
        local_stored_data: local_stored_data,
      },
      success: function (response) {
        //console.log("response ==>", response);
        var a = jQuery("<a />");
        var d = new Date(jQuery.now());
        var export_time = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + "-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds();
        a.attr("download", "tablereport-" + export_time + ".pdf");
        a.attr("href", response.file);
        jQuery("body").append(a);
        a[0].click();
        jQuery("body").remove(a);
      },
      complete: {},
    });
  });
});

jQuery(document).on("click", ".csv-buttons", function () {
  var local_data = localStorage.getItem(user_step_data);
  var local_stored_data = jQuery.parseJSON(local_data);
  var csv_report = "csv";

  jQuery.ajax({
    type: "POST",
    url: wsc_cal_local_st_var.wsc_storage_data_ajax_url,
    data: {
      action: "csv_downloads",
      local_stored_data: local_stored_data,
      csv_report: csv_report,
    },
    xhrFields: {
      responseType: "blob",
    },
    success: function (blob) {
      // Create download link and click it to start download
      var url = window.URL.createObjectURL(blob);
      var a = jQuery("<a>", {
        href: url,
        download: "data.csv",
      }).appendTo("body");
      a[0].click();
      a.remove();
      window.URL.revokeObjectURL(url);
    },
  });
});

function set_field_value(field_val = "") {
  // console.log(field_val);
  if (field_val != "") {
    jQuery.each(field_val, function (key, value) {
      if (value != "") {
        var key_obj = document.getElementById(key);
        if (key_obj != null) {
          if (key_obj.type == "text" || key_obj.type == "number" || key_obj.type == "select-one" || key_obj.type == "date") {
            if (Array.isArray(value) && value.length > 1) {
              value = value[0];
            }
            key_obj.value = value;
          } else if (key_obj.type == "checkbox" && key_obj.value == "1") {
            key_obj.value = value;
            jQuery("#" + key)
              .parent()
              .addClass("active");
          }
        }
      }
    });
  }
}

function formatInputValue(inputElement) {
  // Get input value without commas and dollar sign
  let value = inputElement.value.replace(/\$/g, "").replace(/,/g, "");

  const parsedValue = Number(value);

  if (isNaN(parsedValue)) {
    value = "";
  } else {
    value = "$" + parsedValue.toLocaleString("en");
  }

  inputElement.value = value;
}

//format result page value
function formatNumberWithCommas(number) {
  var numberString = number.toString();
  var parts = numberString.split(".");
  var wholeNumberPart = parts[0];
  var decimalPart = parts.length > 1 ? "." + parts[1] : "";

  var formattedNumber = wholeNumberPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return formattedNumber + decimalPart;
}

function validateRange(input) {
    let value = parseInt(input.value, 10);
    if (value > 110) {
        input.value = 110;
        alert('Age should not be greater than 110')
    } else if (value < 1) {
        input.value = 1;
    } else if (isNaN(value)) {
        input.value = '';
    }
}

function chart_load(api_data) {
  //console.log("api_data_year==>",api_data.essential_capital.year);
  //stackebar chart js

  Chart.defaults.global.defaultFontStyle = "Bold";
  var barChartData = {
    // labels: ["2021","2022","2023","2024","2025","2026","2027","2028","2029","2030","2031","2032","2033","2034","2035","2036","2037","2038","2039","2040","2041","2042","2043","2044"],
    labels: api_data.essential_capital.year,

    datasets: [
      {
        label: "Essential",
        xAxisID: "xAxis1",
        backgroundColor: "#1C2338",
        categoryPercentage: 1,
        stack: "Stack 0",
        barPercentage: 0.8,
        // data: [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,24002,49682,77160,137953.8300000000162981450557708740234375],
        data: api_data.essential_capital.essential,
      },
      {
        label: "Surplus",
        xAxisID: "xAxis1",
        backgroundColor: "#FF7F00",
        categoryPercentage: 1,
        stack: "Stack 0",
        barPercentage: 0.8,
        // data: [200008,214008,228988,245016,262166,280518,300154,321164,343646,367700,393438,420978,450446,481976,515714,551814,590440,631770,675994,723314,771404.863000000012107193470001220703125,822572.6049999999813735485076904296875,877012.37899999995715916156768798828125,996629.983000000007450580596923828125],
        data: api_data.essential_capital.surplus,
      },
      // {
      //     label: "Shortfall",
      //     xAxisID: 'xAxis1',
      //     backgroundColor: "#FF0000",
      //     categoryPercentage: 1,
      //     stack: "Stack 0",
      //     barPercentage: 0.8,
      // data: [200008,214008,228988,245016,262166,280518,300154,321164,343646,367700,393438,420978,450446,481976,515714,551814,590440,631770,675994,723314,771404.863000000012107193470001220703125,822572.6049999999813735485076904296875,877012.37899999995715916156768798828125,996629.983000000007450580596923828125],
      // data: api_data.essential_capital.shortfall,
      // },
    ],
  };

  var xxFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  var canvasTest = jQuery("#chart");
  var rectangleSet = false;
  if (chartTest) {
    chartTest.destroy();
  }
  chartTest = new Chart(canvasTest, {
    type: "bar",
    data: barChartData,
    options: {
      scales: {
        xAxes: [
          {
            id: "xAxis1",
            type: "category",
            offset: true,
            gridLines: {
              display: false,
              offsetGridLines: true,
            },
          },
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
              position: "bottom",
              callback: function (label, index, labels) {
                return xxFormat.format(label);
              },
              //steps: 20,
              // stepValue: 20,
              // max: 5000
            },
            display: true,
          },
        ],
      },
      tooltips: {
        mode: "x",
        intersect: false,
        callbacks: {
          label: function (tooltipItem, data) {
            var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
            return "$" + value.toLocaleString();
          },
        },
      },
      legend: {
        display: false,
        position: "bottom",

        labels: {
          boxWidth: 70,
          height: 30,
          padding: 10, // Add padding to create button-like appearance
          font: {
            weight: "bold",
          },
        },
      },
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        onComplete: function () {
          if (!rectangleSet) {
            var scale = window.devicePixelRatio;
            var sourceCanvas = chartTest.chart.canvas;
            var copyWidth = chartTest.scales["y-axis-0"].width - 10;
            var copyHeight = chartTest.scales["y-axis-0"].height + chartTest.scales["y-axis-0"].top + 10;

            var targetCtx = document.getElementById("axis-Test").getContext("2d");

            targetCtx.scale(scale, scale);
            targetCtx.canvas.width = copyWidth * scale;
            targetCtx.canvas.height = copyHeight * scale;

            targetCtx.canvas.style.width = `${copyWidth}px`;
            targetCtx.canvas.style.height = `${copyHeight}px`;
            targetCtx.drawImage(sourceCanvas, 0, 0, copyWidth * scale, copyHeight * scale, 0, 0, copyWidth * scale, copyHeight * scale);

            var sourceCtx = sourceCanvas.getContext("2d");
            sourceCtx.clearRect(0, 0, copyWidth * scale, copyHeight * scale);
            rectangleSet = true;
          }
        },
        onProgress: function () {
          if (rectangleSet === true) {
            var copyWidth = chartTest.scales["y-axis-0"].width;
            var copyHeight = chartTest.scales["y-axis-0"].height + chartTest.scales["y-axis-0"].top + 10;

            var sourceCtx = chartTest.chart.canvas.getContext("2d");
            sourceCtx.clearRect(0, 0, copyWidth, copyHeight);
          }
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: false,
            mode: "xy",
            speed: 10,
            threshold: 10,
          },
          zoom: {
            enabled: false,
            mode: "xy",
          },
        },
      },
    },
  });
}
