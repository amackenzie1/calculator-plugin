<?php if (!defined('ABSPATH')) {
    die;
} // If this file is called directly, abort.

/**
 * The public-specific functionality of the plugin.
 *
 * @link       https://www.worldwebtechnology.com/
 * @since      1.0.0
 *
 * @package    Wisely_Surplus_Calculator
 * @subpackage Wisely_Surplus_Calculator/public
 * @author     World Web Technology <biz@worldwebtechnology.com>
 */
class Wisely_Surplus_Calculator_Public
{

    /**
     * Initialize the class and set its properties.
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function __construct()
    {
    }

    public static  function arr_key_value_func($key, $val)
    {

        return array($key => $val);
    }

    /**
     * Initialize the class and set its properties.
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function wsc_public_scripts()
    {

        wp_register_script('wisely-surplus-calculator-public-script', WISELY_SURPLUS_CALCULATOR_URL . 'public/js/wisely-surplus-calculator-public.js', array('jquery'), time(), true);

        wp_enqueue_script('wisely-surplus-calculator-public-script');

        wp_localize_script(
            'wisely-surplus-calculator-public-script',
            'wsc_cal_custom_vars',
            array(
                'wsc_cal_ajax_url' => admin_url('admin-ajax.php'),
            )
        );

        /* REMOVE LOCAL STORAGE DATA FOR FREE USERS */

        $remove_storage_data = '1';

        if (is_user_logged_in()) {
            $user_id = get_current_user_id();
            $subscriptions = wcs_get_users_subscriptions($user_id);
            if (!empty($subscriptions)) {
                foreach ($subscriptions as $subscription) {
                    if ($subscription->get_status() == 'active') {
                        // $subscription_total = (int) $subscription->total;					    
                        // if($subscription_total > 0){
                        $remove_storage_data = '0';
                        break;
                        //}
                    }
                }
            }
        }

        /* REMOVE LOCAL STORAGE DATA FOR FREE USERS */




        /* get user all step form data from db start */

        $user_all_step_calc_form_data = '';

        if (is_user_logged_in()) {
            $user_id = get_current_user_id();
            $subscriptions = wcs_get_users_subscriptions($user_id);
            if (!empty($subscriptions)) {
                foreach ($subscriptions as $subscription) {
                    if ($subscription->get_status() == 'active') {
                        $user_all_step_calc_form_data = get_user_meta($user_id, 'user_all_step_calc_form_data', true);
                        break;
                    }
                }
            }
        }


        /* get user all step form data from db end */

        wp_localize_script(
            'wisely-surplus-calculator-public-script',
            'wsc_cal_local_st_var',
            array(
                'wsc_storage_data_ajax_url' => admin_url('admin-ajax.php'), 'wsc_remove_storage_data' => $remove_storage_data,
                'wsc_user_all_step_calc_form_data' => $user_all_step_calc_form_data
            )
        );


        wp_localize_script(
            'wisely-surplus-calculator-public-script',
            'wsc_save_custom_vars',
            array(
                'wsc_save_ajax_url' => admin_url('admin-ajax.php'),
            )
        );

        wp_enqueue_style('wisely-surplus-calculator-public-css', WISELY_SURPLUS_CALCULATOR_URL . 'public/css/wisely-surplus-calculator-public.css');
        wp_enqueue_style('wisely-surplus-form-popup', WISELY_SURPLUS_CALCULATOR_URL . 'public/css/wisely-surplus-form-popup.css');
        wp_enqueue_style('wisely-surplus-custom', WISELY_SURPLUS_CALCULATOR_URL . 'public/css/wisely-surplus-custom.css');

        //Enqueue WSC Custom Scripts
        wp_register_script('wsc_custom_scripts', WISELY_SURPLUS_CALCULATOR_URL . 'public/js/wsc_custom_scripts.js', array('jquery'), null, false);
        wp_enqueue_script('wsc_custom_scripts');
        wp_localize_script(
            'wsc_custom_scripts',
            'wsc_custom_vars',
            array(
                'wsc_ajax_url' => admin_url('admin-ajax.php'),
            )
        );

        //Enqueue JQuery Validate
        wp_register_script('wsc_jquery_validate', WISELY_SURPLUS_CALCULATOR_URL . 'public/js/jquery.validate.min.js', array('jquery'), null, false);
        wp_enqueue_script('wsc_jquery_validate');

        //Validate Additional Script File for Plugin
        wp_register_script('wsc_validate_additional', WISELY_SURPLUS_CALCULATOR_URL . 'public/js/additional-methods.min.js', array('jquery'), WISELY_SURPLUS_CALCULATOR_VERSION . time(), false);
        wp_enqueue_script('wsc_validate_additional');

        wp_register_script('wsc_fontawesome', 'https://kit.fontawesome.com/2a9a402ad3.js');
        wp_enqueue_script('wsc_fontawesome');

        //chart-js add
        // wp_register_script('wsc_chartmin', WISELY_SURPLUS_CALCULATOR_URL . 'public/js/chart.js', array('jquery'), null, false);
        // wp_enqueue_script('wsc_chartmin');


        //date-input-mask js
        wp_register_script('wsc_inputmask_bundle', WISELY_SURPLUS_CALCULATOR_URL . 'public/js/inputmask-bundle.js', array('jquery'), null, false);
        wp_enqueue_script('wsc_inputmask_bundle');
        wp_register_script('wsc_mask', WISELY_SURPLUS_CALCULATOR_URL . 'public/js/mask.js', array('jquery'), null, false);
        wp_enqueue_script('wsc_mask');

        wp_enqueue_script('wsc_chartmin', 'https://cdn.jsdelivr.net/npm/chart.js@2.9.3', array('jquery'), null, false);
        wp_enqueue_script('hammerjs', 'https://cdn.jsdelivr.net/npm/hammerjs@2.0.8', array('jquery'), null, false);
        wp_enqueue_script('wsc_zoom', 'https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@0.7.7', array('jquery'), null, false);
    }

    /**
     * Initialize the class and set its properties.
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function wsc_step_form_shortcode()
    {
        require_once WISELY_SURPLUS_CALCULATOR_PUBLIC_DIR . '/partials/wsc_step_form.php';
    }

    /**
     * WSC Registration form shortcode
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function wsc_registration_shortcode_callback_function()
    {
        require_once WISELY_SURPLUS_CALCULATOR_PUBLIC_DIR . '/partials/wsc_registration_form.php';
    }


    /**
     * WSC create user callback function
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function wsc_register_user_callback_new()
    {
        global $woocommerce;

        // echo "<pre>"; print_r($_POST); echo "</pre>";
        // exit('darshit in php');

        if (!isset($_POST['wsc_reg_nonce']) || $_POST['wsc_reg_nonce'] != 'yes') {
            // Security check
            wp_send_json_error(
                array(
                    'message' => 'Ooops, something went wrong, please try again later.',
                )
            );
            exit();
        } else {

            if (isset($_POST['wsc_email']) && isset($_POST['wsc_email']) && email_exists($_POST['wsc_email'])) {

                echo json_encode(
                    array(
                        'success' => false,
                        'message' => 'Ooops, this email address is alreday exits please use another email address',
                    )
                );
                exit();
            } else {

                // All good, then save the data here
                $wsc_first_name = $_POST['wsc_first_name']; //done
                $wsc_last_name = $_POST['wsc_last_name']; //done
                $wsc_email = $_POST['wsc_email']; //done
                $wsc_pass = $_POST['wsc_pass']; //done
                $wsc_confirm_pass = $_POST['wsc_confirm_pass']; //done
                $wsc_plan_sec = $_POST['wsc_plan_sec']; //done
                //$wsc_auto = $_POST['wsc_auto'];

                $test_address = array(
                    // 'user_login' => $wsc_first_name . '_' . $wsc_last_name,
                    'user_login' => $wsc_email,
                    'user_nicename' => $wsc_first_name . ' ' . $wsc_last_name,
                    'user_email' => $wsc_email,
                    'first_name' => $wsc_first_name,
                    'last_name' => $wsc_last_name,
                    'display_name' => $wsc_first_name . ' ' . $wsc_last_name,
                    'nickname' => $wsc_first_name,
                    'user_pass' => $wsc_pass,
                );

                $user_id = wp_insert_user($test_address);

                //echo "<pre>"; print_r($_POST); exit();

                if (!is_wp_error($user_id)) {
                    if (!empty($wsc_plan_sec)) {
                        update_user_meta($user_id, 'wsc_plan_sec', $wsc_plan_sec);
                    }
                    wp_set_current_user($user_id);
                    wp_set_auth_cookie($user_id, true);

                    $woocommerce->cart->empty_cart(3231); // Changed 

                    echo json_encode(array('success' => true, 'message' => 'Your are register successfully.'));

                    $woocommerce->cart->add_to_cart($_POST['wsc_plan_sec'], '1');
                } else {
                    echo json_encode(array('success' => false, 'message' => 'Something went wrong....'));
                }
            }
            die();
        }
    }

    /**
     * WSC login user callback function
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function wsc_login_user_callback()
    {

        $userInfo = array();
        // Verify nonce
        if (!isset($_POST['wsc_login_nonce']) || !wp_verify_nonce($_POST['wsc_login_nonce'], 'wsc_login_user')) {
            wp_send_json_error(array('message' => 'Ooops, something went wrong, please try again later.'));
        }

        // Post values

        // Wp Signon credential
        $creds = array(
            'user_login'    => $_POST['wsc_login_name'],
            'user_password' => $_POST['wsc_login_pass'],
            'remember'      => true
        );

        $userSignIn = wp_signon($creds, true);

        if (is_wp_error($userSignIn)) {
            echo json_encode(array('success' => false, 'message' => $userSignIn->get_error_message()));
        } else {

            // wp_clear_auth_cookie();

            //do_action( 'wp_login', $userSignIn->ID );

            wp_set_current_user($userSignIn->ID);

            //wp_set_auth_cookie( $userSignIn->ID, true );

            echo json_encode(array('success' => true, 'message' => 'You are successfully login.'));
        }
        die();
    }

    /**
     * WSC forgot user callback function
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function wsc_forgot_user_callback()
    {

        $userInfo = array();
        // Verify nonce
        if (!isset($_POST['wsc_forgot_nonce']) || !wp_verify_nonce($_POST['wsc_forgot_nonce'], 'wsc_forgot_user')) {
            wp_send_json_error(array('message' => 'Ooops, something went wrong, please try again later.'));
        }

        // Post values
        $userInfo['user_login'] = $_POST['wsc_forgot_email']; //done
        $userEmail = get_user_by('email', $_POST['wsc_forgot_email']);

        if (!empty($_POST['wsc_forgot_email']) && email_exists($_POST['wsc_forgot_email'])) {

            $user = new WP_User(intval($userEmail->ID));
            $reset_key = get_password_reset_key($user);

            $blogname = wp_specialchars_decode(get_option('blogname'), ENT_QUOTES);
            $user_login = $userEmail->user_login;
            $title = sprintf(__('%s - Password Reset'), $blogname);

            $rp_link = '<a href="' . network_site_url("login-page?action=rp&key=" . $reset_key . "&login=" . rawurlencode($user_login), 'login') . '">Set password link</a>';

            ob_start();
            include WISELY_SURPLUS_CALCULATOR_PUBLIC_DIR . '/wisely-forgot-password-email-template.php';
            $message = ob_get_contents();
            ob_end_clean();

            /*$message = "Hi ".$userEmail->first_name.",<br>";
				            $message .= "An account has been created on ".get_bloginfo( 'name' )." for email address ".$email."<br>";
				            $message .= "Click here to set the password for your account: <br>";
				            $message .= $rp_link.'<br>';
			*/
            $subject = __("Reset Password - " . get_bloginfo('name'));
            $headers = array();

            add_filter('wp_mail_content_type', function ($content_type) {
                return 'text/html';
            });

            if (!wp_mail($_POST['wsc_forgot_email'], $subject, $message, $headers)) {
                echo json_encode(array('success' => false, 'message' => 'Something went wrong!'));
            } else {
                remove_filter('wp_mail_content_type', 'set_html_content_type');
                echo json_encode(array('success' => true, 'message' => 'Please check your email box for reset password.'));
            }
        } else {
            echo json_encode(array('success' => false, 'message' => 'Email doesn\'t exist. Please try again!'));
        }

        die();
    }

    /**
     * WSC reset user password callback function
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function wsc_reset_password_user_callback()
    {

        if (!isset($_POST['wsc_reset_password_nonce']) || !wp_verify_nonce($_POST['wsc_reset_password_nonce'], 'wsc_reset_password')) {
            wp_send_json_error(array('message' => 'Ooops, something went wrong, please try again later.'));
        }

        $userEmail = get_user_by('login', $_POST['user_login']);
        if (!empty($userEmail) && !empty($userEmail->ID) && isset($_POST['wsc_new_password']) && !empty($_POST['wsc_new_password'])) {
            /* $resetPsw = reset_password( $userEmail, $_POST['wsc_new_password']);*/
            $resetPsw = wp_update_user(array('ID' => $userEmail->ID, 'user_pass' => $_POST['wsc_new_password']));
            if (is_wp_error($resetPsw)) {
                echo json_encode(array('success' => false, 'message' => 'Something went wrong!'));
            } else {
                echo json_encode(array('success' => true, 'message' => 'You password has been updated successfully.'));
            }
        }
        die();
    }

    // list_states ajax for code by Rahul
    public function wsc_list_states_callback()
    {

        $country_code = (isset($_POST['country_code']) && !empty($_POST['country_code'])) ? $_POST['country_code'] : '';
        ob_start();
        echo $states_list = apply_filters('wsc_country_by_states_list', $country_code);

        $popup_content = ob_get_contents();
    }

    public function general_get_data($local_stored_data)
    {

        $donate_arr = $_POST['local_stored_data']['step_8']['donate_plan_no_main'];
        $donate_arr = implode("-", $donate_arr);
        $donate_arr = explode("-", $donate_arr);
        $donate_start_date = $donate_arr[0];
        $donate_end_date = $donate_arr[1];

        $donate_plain_arr = $_POST['local_stored_data']['step_8']['donate_plan_no_spouse'];
        $donate_plain_arr = implode("-", $donate_plain_arr);
        $donate_plain_arr = explode("-", $donate_plain_arr);
        $donate_plain_start = $donate_arr[0];
        $donate_plain_end = $donate_arr[1];

        $oneoff_expense_arr = $_POST['local_stored_data']['step_8']['oneoff_expense_main'];
        $oneoff_expense_arr = implode("-", $oneoff_expense_arr);
        $oneoff_expense_arr = explode("-", $oneoff_expense_arr);
        $oneoff_start = $oneoff_expense_arr[0];
        $oneoff_end = $oneoff_expense_arr[1];

        $oneoff_expense_s_arr = $_POST['local_stored_data']['step_8']['oneoff_expense_spouse'];
        $oneoff_expense_s_arr = implode("-", $oneoff_expense_s_arr);
        $oneoff_expense_s_arr = explode("-", $oneoff_expense_s_arr);
        $oneoff_start_s = $oneoff_expense_s_arr[0];
        $oneoff_end_s = $oneoff_expense_s_arr[1];


        $data  = array(
            'local_stored_data' => $_POST['local_stored_data'],
            'local_old_are' => $_POST['local_stored_data']['step_1']['old_are'],
            'local_info_are' => $_POST['local_stored_data']['step_1']['info_are'],
            'local_estimate_expect' => $_POST['local_stored_data']['step_1']['estimate_expect'],
            'local_live' => $_POST['local_stored_data']['step_1']['live'],
            'local_life_expect' => $_POST['local_stored_data']['step_1']['life_expect'],
            'local_live_spouse' => $_POST['local_stored_data']['step_1']['live'],
            'local_est_with_spouse' => $_POST['local_stored_data']['step_1']['est_with_spouse'],
            'local_inflation_rate' => $_POST['local_stored_data']['step_2']['inflation_rate'],
            'local_investor_main' => $_POST['local_stored_data']['step_2']['investor_main'],
            'local_income_rate' => $_POST['local_stored_data']['step_2']['income_rate'],
            'local_growth_rate' => $_POST['local_stored_data']['step_2']['growth_rate'],
            'local_specify_return' => $_POST['local_stored_data']['step_2']['specify_return'],
            'local_your_income' => $_POST['local_stored_data']['step_3']['your_income'],
            'local_spouse_income' => $_POST['local_stored_data']['step_3']['spouse_income'],
            'local_your_date' => $_POST['local_stored_data']['step_3']['your_date'],
            'local_start_date' => $_POST['local_stored_data']['step_3']['start_date'],
            'local_end_date' => $_POST['local_stored_data']['step_3']['end_date'],
            'local_spouse_date' => $_POST['local_stored_data']['step_3']['spouse_date'],
            'local_spouse_start_date' => $_POST['local_stored_data']['step_3']['spouse_start_date'],
            'local_spouse_end_date' => $_POST['local_stored_data']['step_3']['spouse_end_date'],
            'local_other_date' => $_POST['local_stored_data']['step_3']['other_date'],
            'local_other_income' => $_POST['local_stored_data']['step_3']['other_income'],
            'local_other_spouse_income' => $_POST['local_stored_data']['step_3']['other_spouse_income'],
            'local_other_spouse_date' => $_POST['local_stored_data']['step_3']['other_spouse_date'],
            //CPP localstorage data
            'local_ps_spouse_age' => $_POST['local_stored_data']['step_4']['pension_sn_age'],
            'local_pension_age' => $_POST['local_stored_data']['step_4']['pension_age'],
            'local_pension_amount' => $_POST['local_stored_data']['step_4']['pension_amount'],
            'local_pension_sn_amount' => $_POST['local_stored_data']['step_4']['pension_sn_amount'],

            //OAS localstorage data
            'local_sc_spouse_age' => $_POST['local_stored_data']['step_4']['sc_spouse_age'],
            'local_security_sn_age' => $_POST['local_stored_data']['step_4']['security_sn_age'],
            'local_security_age' => $_POST['local_stored_data']['step_4']['security_age'],
            'local_security_amount' => $_POST['local_stored_data']['step_4']['security_amount'],
            'local_security_sn_amount' => $_POST['local_stored_data']['step_4']['security_sn_amount'],

            //Defined Benefit Pension localstorage data
            'local_bp_spouse_age' => $_POST['local_stored_data']['step_4']['bp_spouse_age'],
            'local_benifit_amount' => $_POST['local_stored_data']['step_4']['benifit_amount'],
            'local_benifit_sn_amount' => $_POST['local_stored_data']['step_4']['benifit_sn_amount'],
            //'local_index_spouse_age' => $_POST['local_stored_data']['step_4']['index_spouse_age'],
            'local_indexed_to_inflatiton' => $_POST['local_stored_data']['step_4']['indexed_to_inflatiton'],
            'local_indexed_to_inflatiton_spouse' => $_POST['local_stored_data']['step_4']['indexed_to_inflatiton_spouse'],
            'local_start_rec_pay_cpp_qpp' => $_POST['local_stored_data']['step_4']['start_rec_pay_cpp_qpp'],
            'local_start_rec_pay_cpp_qpp_spouse' => $_POST['local_stored_data']['step_4']['start_rec_pay_cpp_qpp_spouse'],
            'local_start_OAS_pay' => $_POST['local_stored_data']['step_4']['start_OAS_pay'],
            'local_start_OAS_pay_spouse' => $_POST['local_stored_data']['step_4']['start_OAS_pay_spouse'],
            'local_start_def_ben_pens' => $_POST['local_stored_data']['step_4']['start_def_ben_pens'],
            'local_start_def_ben_pens_spouse' => $_POST['local_stored_data']['step_4']['start_def_ben_pens_spouse'],
            'local_benifit_age' => $_POST['local_stored_data']['step_4']['benifit_age'],
            'local_benifit_sn_age' => $_POST['local_stored_data']['step_4']['benifit_sn_age'],
            //Health Care Expense localstorage data
            'local_annual_expense' => $_POST['local_stored_data']['step_7']['annual_expense'],
            'local_care_expense' => $_POST['local_stored_data']['step_7']['care_expense'],
            'local_se_annual_expense' => $_POST['local_stored_data']['step_7']['se_annual_expense'],
            'local_se_care_expense' => $_POST['local_stored_data']['step_7']['se_care_expense'],
            'local_expe_each_stage_ret' => $_POST['local_stored_data']['step_7']['expe_each_stage_ret'],
            'local_expe_each_stage_ret_spouse' => $_POST['local_stored_data']['step_7']['expe_each_stage_ret_spouse'],

            //Core_Needs localstorage data
            'local_annual_expense' => $_POST['local_stored_data']['step_7']['annual_expense'],
            'local_care_expense' => $_POST['local_stored_data']['step_7']['care_expense'],
            'local_se_annual_expense' => $_POST['local_stored_data']['step_7']['se_annual_expense'],
            'local_se_care_expense' => $_POST['local_stored_data']['step_7']['se_care_expense'],
            'local_annual_age' => $_POST['local_stored_data']['step_7']['annual_age'],
            'local_care_age' => $_POST['local_stored_data']['step_7']['care_age'],
            'local_second_annual_age' => $_POST['local_stored_data']['step_7']['second_annual_age'],
            'local_second_care_age' => $_POST['local_stored_data']['step_7']['second_care_age'],
            'local_third_annual_age' => $_POST['local_stored_data']['step_7']['third_annual_age'],
            'local_third_care_age' => $_POST['local_stored_data']['step_7']['third_care_age'],

            'local_spouse_annual' => $_POST['local_stored_data']['step_7']['spouse_annual_age'],
            'local_spouse_care' => $_POST['local_stored_data']['step_7']['spouse_care_age'],

            'local_spouse_se_annual' => $_POST['local_stored_data']['step_7']['spouse_se_annual_age'],
            'local_spouse_se_care' => $_POST['local_stored_data']['step_7']['spouse_se_care_age'],
            'local_spouse_th_annual' => $_POST['local_stored_data']['step_7']['spouse_th_annual_age'],
            'local_spouse_th_care_age' => $_POST['local_stored_data']['step_7']['spouse_th_care_age'],

            //charitable donations localstorage data
            'local_donate_plan_no_main' => $_POST['local_stored_data']['step_8']['donate_plan_no_main'],
            'local_donate_plan_main' => $_POST['local_stored_data']['step_8']['donate_plan_main'],
            'local_donate_plan_no_spouse' => $_POST['local_stored_data']['step_8']['donate_plan_no_spouse'],
            'local_donate_plan_spouse' => $_POST['local_stored_data']['step_8']['donate_plan_spouse'],

            //Discretionary Spending localstorage data
            'local_expense_type_main_val' => $_POST['local_stored_data']['step_8']['expense_type_main_val'],
            'local_expense_type_spouse_val' => $_POST['local_stored_data']['step_8']['expense_type_spouse_val'],
            'local_oneoff_expense_main' => $_POST['local_stored_data']['step_8']['oneoff_expense_main'],
            'local_oneoff_expense_spouse' => $_POST['local_stored_data']['step_8']['oneoff_expense_spouse'],

            //Desired Estate localstorage data
            'local_desired_estate' => $_POST['local_stored_data']['step_8']['desired_estate_main'],

            //Life Insurance localstorage data
            'local_estate_value' => $_POST['local_stored_data']['step_5']['estate_value'],
            'local_se_estate_value' => $_POST['local_stored_data']['step_5']['se_estate_value'],

            //Primary Residence localstorage data
            'local_Primary_value' => $_POST['local_stored_data']['step_6']['primary_value'],
            'local_plan_return' => $_POST['local_stored_data']['step_6']['plan_return'],

            //assets localstorage data			
            'local_spouse_value' => $_POST['local_stored_data']['step_5']['spouse_value'],
            'local_account_value' => $_POST['local_stored_data']['step_5']['account_value'],
            'local_ct_account_value' => $_POST['local_stored_data']['step_5']['ct_account_value'],
            'local_st_account_value' => $_POST['local_stored_data']['step_5']['st_account_value'],
            'local_ct_book_value' => $_POST['local_stored_data']['step_5']['ct_book_value'],
            'local_st_book_value' => $_POST['local_stored_data']['step_5']['st_book_value'],
        );
        //client
        $asset_account_main_array = $_POST['local_stored_data']['step_5']['account_main'];
        $asset_account_value_array =  array_map("floatval", str_replace(array("$", ","), "", $_POST['local_stored_data']['step_5']['account_value']));


        $account_main_value_combine  = array_combine($asset_account_main_array, $asset_account_value_array);

        if (!array_key_exists("TFSA", $account_main_value_combine)) {
            $account_main_value_combine['TFSA'] = floatval(0);
        }
        if (!array_key_exists("RRSP", $account_main_value_combine)) {
            $account_main_value_combine['RRSP'] = floatval(0);
        }
        if (!array_key_exists("RRIF", $account_main_value_combine)) {
            $account_main_value_combine['RRIF'] = floatval(0);
        }
        if (!array_key_exists("LIRA", $account_main_value_combine)) {
            $account_main_value_combine['LIRA'] = floatval(0);
        }
        if (!array_key_exists("LIF", $account_main_value_combine)) {
            $account_main_value_combine['LIF'] = floatval(0);
        }


        $account_main_value_combine["NON_REGISTERED_ASSET"] = floatval(str_replace(array("$", ","), "", $data['local_ct_account_value']));
        $account_main_value_combine["NON_REGISTERED_BOOK_VALUE"] = floatval(str_replace(array("$", ","), "", $data['local_ct_book_value']));

        //spouse
        $asset_account_main_spouse_array = $_POST['local_stored_data']['step_5']['spouse_main'];
        $asset_account_value_spouse_array =  array_map("floatval", str_replace(array("$", ","), "", $_POST['local_stored_data']['step_5']['spouse_value']));

        $account_main_value_spouse_combine  = array_combine($asset_account_main_spouse_array, $asset_account_value_spouse_array);
        if (!array_key_exists("TFSA", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['TFSA'] = floatval(0);
        }
        if (!array_key_exists("RRSP", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['RRSP'] = floatval(0);
        }
        if (!array_key_exists("RRIF", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['RRIF'] = floatval(0);
        }
        if (!array_key_exists("LIRA", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['LIRA'] = floatval(0);
        }
        if (!array_key_exists("LIF", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['LIF'] = floatval(0);
        }

        $account_main_value_spouse_combine["NON_REGISTERED_ASSET"] = floatval(str_replace(array("$", ","), "", $data['local_st_account_value']));
        $account_main_value_spouse_combine["NON_REGISTERED_BOOK_VALUE"] = floatval(str_replace(array("$", ","), "", $data['local_st_book_value']));

        //$start_year = 2023;
        $start_year = (int) date('Y');
        $client_rem_years = (int) $data['local_life_expect'] - (int)$data['local_old_are'];
        $end_year = (int) $start_year + (int) $client_rem_years;
        $spouse_rem_years = (int) $data['local_estimate_expect'] - (int)$data['local_info_are'];
        $end_year_spouse = (int) $start_year + (int) $spouse_rem_years;


        /* pension startdate calculation start */

        $local_start_rec_pay_cpp_qpp = $data['local_start_rec_pay_cpp_qpp'];
        $local_start_rec_pay_cpp_qpp_spouse = $data['local_start_rec_pay_cpp_qpp_spouse'];
        if ($local_start_rec_pay_cpp_qpp == 'yes') {
            $start_year_pension = $start_year;
            $end_year_pension = $end_year;
        } else {

            $local_pension_age = $data['local_pension_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_pension = (int) $local_pension_age - (int) $local_old_are;
            $start_year_pension = $start_year + $remain_years_of_pension;
            $end_year_pension = $end_year;
        }

        if ($local_start_rec_pay_cpp_qpp_spouse == 'yes') {

            $start_year_pension_spouse = $start_year;
            $end_year_pension_spouse = $end_year_spouse;
        } else {

            $local_ps_spouse_age = $data['local_ps_spouse_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_pension_spouse = (int) $local_ps_spouse_age - (int) $local_info_are;
            $start_year_pension_spouse = $start_year + $remain_years_of_pension_spouse;
            $end_year_pension_spouse = $end_year_spouse;
        }

        /* pension startdate calculation end */
        /* OAS startdate calculation start */

        $local_start_OAS_pay = $data['local_start_OAS_pay'];
        $local_start_OAS_pay_spouse = $data['local_start_OAS_pay_spouse'];

        if ($local_start_OAS_pay == 'yes') {

            $start_year_OAS = $start_year;
            $end_year_OAS = $end_year;
        } else {

            $local_security_age = $data['local_security_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_OAS = (int) $local_security_age - (int) $local_old_are;
            $start_year_OAS = $start_year + $remain_years_of_OAS;
            $end_year_OAS = $end_year;
        }
        if ($local_start_OAS_pay_spouse == 'yes') {

            $start_year_OAS_spouse = $start_year;
            $end_year_OAS_spouse = $end_year_spouse;
        } else {

            $local_security_sn_age = $data['local_security_sn_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_OAS_spouse = (int) $local_security_sn_age - (int) $local_info_are;
            $start_year_OAS_spouse = $start_year + $remain_years_of_OAS_spouse;
            $end_year_OAS_spouse = $end_year_spouse;
        }

        /* OAS startdate calculation end */
        /* Defined Benefit Pension startdate calculation start */

        $local_start_def_ben_pens = $data['local_start_def_ben_pens'];
        $local_start_def_ben_pens_spouse = $data['local_start_def_ben_pens_spouse'];

        if ($local_start_def_ben_pens == 'yes') {

            $start_year_DBP = $start_year;
            $end_year_DBP = $end_year;
        } else {

            $local_benifit_age = $data['local_benifit_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_DBP = (int) $local_benifit_age - (int) $local_old_are;
            $start_year_DBP = $start_year + $remain_years_of_DBP;
            $end_year_DBP = $end_year;
        }

        if ($local_start_def_ben_pens_spouse == 'yes') {

            $start_year_DBP_spouse = $start_year;
            $end_year_DBP_spouse = $end_year_spouse;
        } else {

            $local_benifit_sn_age = $data['local_benifit_sn_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_DBP_spouse = (int) $local_benifit_sn_age - (int) $local_info_are;
            $start_year_DBP_spouse = $start_year + $remain_years_of_DBP_spouse;
            $end_year_DBP_spouse = $end_year_spouse;
        }
        /* Defined Benefit Pension startdate calculation end */


        $pension_arr = [
            [
                "person" => "client",
                "name" => "CPP",
                "start_year" => $start_year_pension,
                "end_year" => $end_year_pension,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_pension_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "client",
                "name" => "OAS",
                "start_year" => $start_year_OAS,
                "end_year" => $end_year_OAS,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_security_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "client",
                "name" => "OTHER_PENSION",
                "start_year" => $start_year_DBP,
                "end_year" => $end_year_DBP,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_benifit_amount'])),
                "index_rate" => ($data['local_indexed_to_inflatiton'] == 'yes') ? floatval($data['local_inflation_rate'] / 100) : 0.00,
            ],
        ];

        $pension_spouse_arr =  [
            [
                "person" => "spouse",
                "name" => "CPP",
                "start_year" => $start_year_pension_spouse,
                "end_year" => $end_year_pension_spouse,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_pension_sn_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "spouse",
                "name" => "OTHER_PENSION",
                "start_year" => $start_year_DBP_spouse,
                "end_year" => $end_year_DBP_spouse,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_benifit_sn_amount'])),
                "index_rate" => ($data['local_indexed_to_inflatiton_spouse'] == 'yes') ? floatval($data['local_inflation_rate'] / 100) : 0.00,
            ],
            [
                "person" => "spouse",
                "name" => "OAS",
                "start_year" => $start_year_OAS_spouse,
                "end_year" => $end_year_OAS_spouse,
                "amount" =>  floatval(str_replace(array("$", ","), "", $data['local_security_sn_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],

        ];

        if ($data['local_est_with_spouse'] == 'yes') {

            $pension_arr = array_merge($pension_arr, $pension_spouse_arr);
        }

        /* expense startyear calculation start */

        $local_expe_each_stage_ret = $data['local_expe_each_stage_ret'];
        $local_expe_each_stage_ret_spouse = $data['local_expe_each_stage_ret_spouse'];
        if ($local_expe_each_stage_ret == 'yes') {

            $core_needs_expe_start_year = $start_year;

            $remain_years_upto_75 = 75 - (int)$data['local_old_are'];

            $core_needs_expe_end_year = $start_year + $remain_years_upto_75;


            /* 76 to 85 */

            $core_needs_expe_start_year_76_85 = $core_needs_expe_end_year + 1;

            $remain_years_upto_85 = 85 - (int)$data['local_old_are'];

            $core_needs_expe_end_year_76_85 = $start_year + $remain_years_upto_85;


            /* 86 to life exp year */

            $core_needs_expe_start_year_86_life = $core_needs_expe_end_year_76_85 + 1;

            $remain_years_upto_life = (int) $data['local_life_expect'] - (int)$data['local_old_are'];

            $core_needs_expe_end_year_86_life = $start_year + $remain_years_upto_life;
        } else {

            $core_needs_expe_start_year = $start_year;
            $core_needs_expe_end_year = $end_year;
            $core_needs_expe_start_year_76_85 = 0;
            $core_needs_expe_end_year_76_85 = 0;
            $core_needs_expe_start_year_86_life = 0;
            $core_needs_expe_end_year_86_life = 0;
        }

        if ($local_expe_each_stage_ret_spouse == 'yes') {

            $core_needs_expe_start_year_spouse = $start_year;

            $remain_years_upto_75_spouse = 75 - (int)$data['local_info_are'];

            $core_needs_expe_end_year_spouse = $start_year + $remain_years_upto_75_spouse;


            /* 76 to 85 */

            $core_needs_expe_start_year_76_85_spouse = $core_needs_expe_end_year_spouse + 1;

            $remain_years_upto_85_spouse = 85 - (int)$data['local_info_are'];

            $core_needs_expe_end_year_76_85_spouse = $start_year + $remain_years_upto_85_spouse;



            /* 86 to life exp year */

            $core_needs_expe_start_year_86_life_spouse = $core_needs_expe_end_year_76_85_spouse + 1;

            $remain_years_upto_life_spouse = (int) $data['local_estimate_expect'] - (int)$data['local_info_are'];

            $core_needs_expe_end_year_86_life_spouse = $start_year + $remain_years_upto_life_spouse;
        } else {

            $core_needs_expe_start_year_spouse = $start_year;
            $core_needs_expe_end_year_spouse = $end_year_spouse;

            $core_needs_expe_start_year_76_85_spouse = 0;
            $core_needs_expe_end_year_76_85_spouse = 0;
            $core_needs_expe_start_year_86_life_spouse = 0;
            $core_needs_expe_end_year_86_life_spouse = 0;
        }

        /* expense startyear calculation end */

        if ($local_expe_each_stage_ret == 'yes') {

            $income_req_arr1 = [

                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85,
                    "end_year" => $core_needs_expe_end_year_76_85,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_second_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85,
                    "end_year" => $core_needs_expe_end_year_76_85,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_second_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life,
                    "end_year" => $core_needs_expe_end_year_86_life,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_third_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life,
                    "end_year" => $core_needs_expe_end_year_86_life,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_third_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]

            ];
        } else {

            $income_req_arr1 = [

                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_annual_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_care_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        }

        /* spouse expense start */

        if ($local_expe_each_stage_ret_spouse == 'yes') {

            $income_req_arr_spouse = [
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_care'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85_spouse,
                    "end_year" => $core_needs_expe_end_year_76_85_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_se_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85_spouse,
                    "end_year" => $core_needs_expe_end_year_76_85_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_se_care'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life_spouse,
                    "end_year" => $core_needs_expe_end_year_86_life_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_th_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life_spouse,
                    "end_year" => $core_needs_expe_end_year_86_life_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_th_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        } else {


            $income_req_arr_spouse = [
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_annual_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_care_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        }


        if ($data['local_est_with_spouse'] == 'yes') {

            $income_req_arr1 = array_merge($income_req_arr1, $income_req_arr_spouse);
        }


        /* spouse expense end */


        /* one off expense calculation start */

        // $one_off_exp_arr = array_combine($data['local_expense_type_main_val'],$data['local_oneoff_expense_main']);
        $one_off_exp_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_expense_type_main_val'], $data['local_oneoff_expense_main']);

        $one_off_exp_arr_struct = array();

        if (!empty($one_off_exp_arr)) {

            foreach ($one_off_exp_arr as $arr_ele) {

                foreach ($arr_ele as $one_off_exp => $one_off_year) {

                    $one_off_exp_arr_struct[] = [
                        "person" => "client",
                        "type" => "ONE_OFF_EXPENSES",
                        "start_year" => (int) $one_off_year,
                        "end_year" => (int) $one_off_year,
                        "amount" => floatval(str_replace(array("$", ","), "", $one_off_exp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }

        // one off spouse

        //$one_off_exp_arr_spouse = array_combine($data['local_expense_type_spouse_val'],$data['local_oneoff_expense_spouse']);

        $one_off_exp_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_expense_type_spouse_val'], $data['local_oneoff_expense_spouse']);


        $one_off_exp_arr_struct_spouse = array();

        if (!empty($one_off_exp_arr_spouse)) {

            foreach ($one_off_exp_arr_spouse as $arr_ele) {

                foreach ($arr_ele as $one_off_exp => $one_off_year) {

                    $one_off_exp_arr_struct_spouse[] = [
                        "person" => "spouse",
                        "type" => "ONE_OFF_EXPENSES",
                        "start_year" => (int) $one_off_year,
                        "end_year" => (int) $one_off_year,
                        "amount" => floatval(str_replace(array("$", ","), "", $one_off_exp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }

        $income_req_arr_final = array_merge($income_req_arr1, $one_off_exp_arr_struct);

        if ($data['local_est_with_spouse'] == 'yes') {

            $income_req_arr_final = array_merge($income_req_arr_final, $one_off_exp_arr_struct_spouse);
        }



        /* one off expense calculation end */


        /* charitable donation start */

        $donation_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_donate_plan_no_main'], $data['local_donate_plan_main']);


        $donation_arr_struct = array();

        if (!empty($donation_arr)) {

            foreach ($donation_arr as $donation_arr_ele) {

                foreach ($donation_arr_ele as $dona_year => $dona_amt) {

                    $don_arr_year = explode('-', $dona_year);
                    $don_arr_start_year = $don_arr_year[0];
                    $don_arr_end_year = $don_arr_year[1];

                    $donation_arr_struct[] = [

                        "person" => "client",
                        "start_year" => floatval($don_arr_start_year),
                        "end_year" => floatval($don_arr_end_year),
                        "amount" => floatval(str_replace(array("$", ","), "", $dona_amt)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }


        $donation_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_donate_plan_no_spouse'], $data['local_donate_plan_spouse']);

        $donation_arr_struct_spouse = array();

        if (!empty($donation_arr_spouse)) {

            foreach ($donation_arr_spouse as $donation_arr_spouse_ele) {

                foreach ($donation_arr_spouse_ele as $dona_year_sp => $dona_amt_sp) {

                    $don_arr_year_sp = explode('-', $dona_year_sp);
                    $don_arr_start_year_sp = $don_arr_year_sp[0];
                    $don_arr_end_year_sp = $don_arr_year_sp[1];


                    $donation_arr_struct_spouse[] = [
                        "person" => "spouse",
                        "start_year" => floatval($don_arr_start_year_sp),
                        "end_year" => floatval($don_arr_end_year_sp),
                        "amount" => floatval(str_replace(array("$", ","), "", $dona_amt_sp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }


        $donation_arr_final = $donation_arr_struct;

        if ($data['local_est_with_spouse'] == 'yes') {

            $donation_arr_final = array_merge($donation_arr_final, $donation_arr_struct_spouse);
        }

        /* charitable donation end */
        /* income array calculation start */

        $income_arr = [
            [
                "person" => "client",
                "start_year" => floatval($data['local_start_date']),
                "end_year" => floatval($data['local_end_date']),
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_your_income'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "spouse",
                "start_year" => floatval($data['local_spouse_start_date']),
                "end_year" => floatval($data['local_spouse_end_date']),
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_income'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
        ];


        $other_income_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_other_date'], $data['local_other_income']);


        if (!empty($other_income_arr)) {

            foreach ($other_income_arr as $other_income_arr_ele) {

                foreach ($other_income_arr_ele as $oth_inc_year => $oth_inc_amt) {

                    if (!empty($oth_inc_year) && !empty($oth_inc_amt)) {

                        if (str_contains($oth_inc_year, '-')) {

                            $oth_inc_year = explode('-', $oth_inc_year);
                            $other_inc_start_year = $oth_inc_year[0];
                            $other_inc_end_year = $oth_inc_year[1];
                        } else {

                            $other_inc_start_year = $oth_inc_year;
                            $other_inc_end_year = $oth_inc_year;
                        }


                        $other_income_arr_struct[] = [

                            "person" => "client",
                            "start_year" => floatval($other_inc_start_year),
                            "end_year" => floatval($other_inc_end_year),
                            "amount" => floatval(str_replace(array("$", ","), "", $oth_inc_amt)),
                            "index_rate" => floatval($data['local_inflation_rate'] / 100),
                        ];
                    }
                }
            }
        }



        if (!empty($other_income_arr_struct)) {
            $income_arr = array_merge($income_arr, $other_income_arr_struct);
        }

        //$other_income_arr_spouse = array_combine($data['local_other_spouse_date'],$data['local_other_spouse_income']);   

        $other_income_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_other_spouse_date'], $data['local_other_spouse_income']);


        $other_income_arr_struct_spouse = array();

        if (!empty($other_income_arr_spouse)) {

            foreach ($other_income_arr_spouse as $other_income_arr_spouse_ele) {

                foreach ($other_income_arr_spouse_ele as $oth_inc_year_sp => $oth_inc_amt_sp) {

                    if (!empty($oth_inc_year_sp) && !empty($oth_inc_amt_sp)) {

                        if (str_contains($oth_inc_year_sp, '-')) {

                            $oth_inc_year_sp = explode('-', $oth_inc_year_sp);
                            $other_inc_start_year_sp = $oth_inc_year_sp[0];
                            $other_inc_end_year_sp = $oth_inc_year_sp[1];
                        } else {

                            $other_inc_start_year_sp = $oth_inc_year_sp;
                            $other_inc_end_year_sp = $oth_inc_year_sp;
                        }


                        $other_income_arr_struct_spouse[] = [

                            "person" => "spouse",
                            "start_year" => floatval($other_inc_start_year_sp),
                            "end_year" => floatval($other_inc_end_year_sp),
                            "amount" => floatval(str_replace(array("$", ","), "", $oth_inc_amt_sp)),
                            "index_rate" => floatval($data['local_inflation_rate'] / 100),
                        ];
                    }
                }
            }
        }

        if (!empty($other_income_arr_struct_spouse) && $data['local_est_with_spouse'] == 'yes') {
            $income_arr = array_merge($income_arr, $other_income_arr_struct_spouse);
        }

        /* income array calculation  end */
        /* PLI array start  */

        $pli_arr = [
            [
                "person" => "client",
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_estate_value'])),
            ]

        ];

        $pli_arr_spouse = [

            [
                "person" => "spouse",
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_estate_value'])),
            ]

        ];

        if ($data['local_est_with_spouse'] == 'yes') {

            $pli_arr = array_merge($pli_arr, $pli_arr_spouse);
        }

        /* PLI array end */

        $jayParsedAry = [
            "parameters" => [
                "growth_rate" => floatval($data['local_growth_rate'] / 100),
                "income_rate" => floatval($data['local_income_rate'] / 100),
                "inflation" => floatval($data['local_inflation_rate'] / 100),
                "interest_rate" => floatval($data['local_specify_return']),
                "start_year" => $start_year,
                "client_age" => floatval($data['local_old_are']),
                "client_life_expectancy" => floatval($data['local_life_expect']),
                "spouse" => ($data['local_est_with_spouse'] == 'yes') ? true : false,
                "spouse_age" => ($data['local_est_with_spouse'] == 'yes') ? floatval($data['local_info_are']) : 0,
                "spouse_life_expectancy" => ($data['local_est_with_spouse'] == 'yes') ? floatval($data['local_estimate_expect']) : 0,
                "end_year" => $end_year,
                "end_balance" => floatval(str_replace(array("$", ","), "", $data['local_desired_estate'])),
                "sell_home" => floatval($data['local_plan_return']),
                "oas_clawback" => [
                    "base" => 72000,
                    "index" => 0.02,
                ],
                "personal_exemption" => [
                    "base" => 12896,
                    "index" => 0.02,
                ],
                "tax_rate" => [
                    "marginal" => [
                        [12070, 0],
                        [50000, 0.25],
                        [90000, 0.35],
                        [200000, 0.45],
                    ],
                    "top" => 0.54,
                ],
                "province" => "Ontario",
                "pensions" => $pension_arr,
                "incomes" => $income_arr,
                "pli" => $pli_arr,
                "income_requirements" => $income_req_arr_final,
                "charitable_donations" => $donation_arr_final,
            ],
            "start_book" => [
                "joint" => [
                    "CLEARING" => 0,
                    "HOME" => floatval(str_replace(array("$", ","), "", $data['local_Primary_value'])),
                    //"sell_home" => floatval($data['local_plan_return']),
                ],
                "client" => array_change_key_case($account_main_value_combine, CASE_UPPER),
                "spouse" => array_change_key_case($account_main_value_spouse_combine, CASE_UPPER),
                "transactions" => [],
            ],

        ];

        /* for client array */
        $check_array = self::wisely_POST_curl_api_call($jayParsedAry);
        return $check_array;
    }

    public function generate_pdf($local_stored_data)
    {

        // ini_set('display_errors', 1);
        // ini_set('display_startup_errors', 1);
        // error_reporting(E_ALL);

        $check_array = self::general_get_data($local_stored_data);
        // echo "pdf"; print_r($check_array);

        $total_y = count($check_array['essential_capital']->year);
        //client age array
        $x = $local_stored_data['step_1']['old_are'];

        $client_age = array();
        for ($y = 0; $y < $total_y; $y++) {
            $client_age[] = $x + $y;
        }

        //client income tax array
        $a = $local_stored_data['step_1']['life_expect'];
        $client_income = array();
        for ($b = 0; $b < $total_y; $b++) {
            $client_income[] = $a + $b;
        }

        //spouse age array 
        $e = $local_stored_data['step_1']['info_are'];
        $spouse_age = array();

        $total_y_spouse = (int) $local_stored_data['step_1']['estimate_expect'] - (int) $e;

        for ($f = 0; $f < $total_y_spouse; $f++) {
            $spouse_age[] = $e + $f;
        }

        //spouse income tax array
        $m = $local_stored_data['step_1']['estimate_expect'];
        $spouse_income = array();
        for ($n = 0; $n < $total_y; $n++) {
            $spouse_income[] = $m + $n;
        }

        $labelArray = array(
            "Client",
            "Your_income_tax_rate",
            "Spouse",
            "Spouse's_income_tax_rate",
        );

        $generalArray = array(

            "Client" => $client_age,
            "Your_income_tax_rate" => $client_income,
            "Spouse" => $spouse_age,
            "Spouse's_income_tax_rate" => $spouse_income,

        );


        /* $html_new ='<table>
		<tr>
		<th style="text-align: left; background-color: #fff; color: #fff; border: 1px solid #fff; padding: 10px 8px;">&nbsp;</th> ';

		foreach($labelArray as $key => $value){
			$side_general = str_replace('_', ' ', $value);
			$html_new .= '<th style="text-align: center;background-color: #DEE3EE;color: #000;border: 1px solid #fff;padding: 10px 8px;font-weight: 500;">'.$side_general.'</th> ';

		}

		foreach($check_array['essential_capital']->year as $key => $value)
		{

			$html_new .= '<tr><td style="border: 1px solid #fff; padding: 10px 8px; background: #2f3b4a; text-align: right; color: #fff; ">'.$value.'</td>';

			foreach($labelArray as $subkey => $value){

				if ($value == 'Your_income_tax_rate' || $value == "Spouse's_income_tax_rate" ) {

					$html_new .= '<td style="min-width: 250px; background: #f2f2f2; text-align: right;">'.$generalArray[$value][$key].'%</td>';	
				} else {

					$html_new .= '<td style="min-width: 250px; background: #f2f2f2; text-align: right;">'.$generalArray[$value][$key].'</td>';
				}
			}

			$html_new .= '</tr>';

		}
		$html_new .= '</table><br><br>'; */

        $jayParsedAry = $check_array['report']->data;
        $main_array = $jayParsedAry[0];
        $thead = array();
        $count = 0;
        $array_key = 0;
        foreach ($main_array as $k => $th) {
            if ($count == 4) {
                $count = 0;
                $array_key++;
            }
            $count++;
            $thead[$array_key][$k] = $th;
        }
        $tbody_array = $jayParsedAry;
        unset($tbody_array[0]);
        $tbody = array();
        foreach ($tbody_array as $k => $array_td) {
            $count = 0;
            $array_key = 0;
            foreach ($array_td as $ky => $td) {
                if ($count == 4) {
                    $count = 0;
                    $array_key++;
                }
                $tbody_key = $thead[$array_key][$ky];
                $count++;
                $tbody[$array_key][$tbody_key][] = $td;
            }
        }

        $year_column_index = $check_array['report']->columns;
        // echo '<pre>';
        // print_r($tbody);
        // exit;

        foreach ($tbody as $i => $v) {
            $html_new .= '<table>
		        <tr>
		            <th style="text-align: left; background-color: #fff; color: #fff; border: 1px solid #fff; padding: 10px 8px;">&nbsp;</th>';
            foreach ($tbody[$i] as $key => $value) {


                if ($key == 'net_funds_in') {
                    $key = 'Net_Cash_Flow';
                }

                $side_income = str_replace('_', ' ', $key);

                if ($side_income == 'EARNED INCOME') {
                    $side_income = 'Income';
                } else if ($side_income == 'SPOUSE EARNED INCOME') {
                    $side_income = 'Spouse Income';
                } else if ($side_income == 'OTHER PENSION') {
                    $side_income = 'Defined Benefit Pension';
                } else if ($side_income == 'TAX') {
                    $side_income = 'Income Tax';
                } else if ($side_income == 'SPOUSE TAX') {
                    $side_income = 'Spouse Income Tax';
                } else if ($side_income == 'SALE OF NON REGISTERED ASSET') {
                    $side_income = 'Sale of Non-Registered Investments';
                } else if ($side_income == 'SPOUSE SALE OF NON REGISTERED ASSET') {
                    $side_income = 'Spouse Sale of Non-Registered Investments';
                } else if ($side_income == 'NON REGISTERED ASSET') {
                    $side_income = 'Non-Registered Investments';
                } else if ($side_income == 'SPOUSE NON REGISTERED ASSET') {
                    $side_income = 'Spouse Non-Registered Investments';
                } else if ($side_income == 'NON REGISTERED BOOK VALUE') {
                    $side_income = 'Cost of Non-Registered Investments';
                } else if ($side_income == 'SPOUSE NON REGISTERED BOOK VALUE') {
                    $side_income = 'Spouse Cost of Non-Registered Investments';
                } else if ($side_income == 'ONE OFF EXPENSES') {
                    $side_income = 'One-off Expenses';
                } else if ($side_income == 'SPOUSE ONE OFF EXPENSES') {
                    $side_income = 'Spouse One-off Expenses';
                } else if ($side_income == 'NON REGISTERED DIVIDEND') {
                    $side_income = 'DIVIDEND INCOME';
                } else if ($side_income == 'SPOUSE NON REGISTERED DIVIDEND') {
                    $side_income = 'SPOUSE DIVIDEND INCOME';
                } else if ($side_income == 'Total Assets') {
                    $side_income = 'TOTAL NET ASSETS';
                }

                $side_income = ucwords(strtolower($side_income));



                $html_new .= '<th style="text-align: center;background-color: #DEE3EE;color: #000;border: 1px solid #fff;padding: 10px 8px;font-weight: 100;">' . $side_income . '</th>';
            }

            $age_count = 0;

            foreach ($tbody[$i][array_key_first($tbody[$i])] as $index => $value) {
                $current_index = $index;
                $html_new .= '<tr>';

                if ($index == 0) {
                    continue;
                }

                if (array_key_exists($age_count, $spouse_age)) {

                    $ages_cols = $client_age[$age_count] . '/' . $spouse_age[$age_count];
                } else {

                    $ages_cols = $client_age[$age_count];
                }


                $html_new .= '<td style="border: 1px solid #fff; padding: 10px 8px; background: #15ADC4; text-align: right; color: #fff; ">' . $year_column_index[$index] . '<br><span>(' . $ages_cols . ')</span></td>';
                foreach ($tbody[$i] as $key => $value) {
                    $html_new .= '<td style="min-width: 180px; background: #f2f2f2;">' . $tbody[$i][$key][$index - 1] . '</td>';
                }
                $html_new .= '</tr>';

                $age_count++;
            }

            $html_new .= '</table>';
        }
        return $html_new;
    }

    //step-form-page downloads pdf code
    public function pdf_downloads()
    {

        // do a download PDF code here
        // ini_set('display_errors', 1);
        // ini_set('display_startup_errors', 1);
        // error_reporting(E_ALL);

        $html_new = self::generate_pdf($_POST['local_stored_data']);

        $pdf_file =  WISELY_SURPLUS_CALCULATOR_DIR . '/public/pdf-report.pdf';
        $pdf_file_url =  WISELY_SURPLUS_CALCULATOR_URL . '/public/pdf-report.pdf';

        $html = $html_new;
        $dompfd = new  Dompdf\Dompdf();
        $dompfd->loadHtml($html);
        $dompfd->setPaper('A4', 'landscape');
        $dompfd->render();

        $output = $dompfd->output();
        file_put_contents($pdf_file, $output);

        $data = array('success' => true, 'file' => $pdf_file_url);
        wp_send_json($data);
    }

    //step-form pdf upload folder code
    public function upload_pdf_file()
    {

        $html_new = self::generate_pdf($_POST['local_stored_data']);

        $user_id = get_current_user_id();

        $file_name = $user_id . '-pdf-report-' . date('d-m-Y-h-i-s');

        $pdf_dir = WISELY_SURPLUS_CALCULATOR_DIR . '/public/pdf-save-folder/';

        if (!is_dir($pdf_dir)) { // Check if dir is exist
            mkdir($pdf_dir); // if not then crete it
        }
        $user = wp_get_current_user();
        $firstname = $user->first_name;
        $lastname  = $user->last_name;

        // Prepare the DOMPDF class
        $dompfd = new  Dompdf\Dompdf();
        $html = $html_new;
        $dompfd->loadHtml($html);
        $dompfd->setPaper('A4', 'landscape');
        $dompfd->render();
        // $dompfd->stream($file_name); // Only use for download

        $output = $dompfd->output(); // Render/generate PDF output

        file_put_contents($pdf_dir . $file_name, $output); // Upload the PDF file to the server
        $pdf_file_url =  WISELY_SURPLUS_CALCULATOR_URL . '/public/pdf-report.pdf';
        $data = array('success' => true, 'file' => $pdf_file_url);
        wp_send_json($data);
        // return $file_name; // No more use of it 

    }


    public function csv_downloads()
    {

        if (isset($_POST['csv_report'])) {
            // $check_array = self::wisely_POST_curl_api_call($jayParsedAry);
            $check_array = self::general_get_data($_POST['local_stored_data']);

            header('Content-Type: text/csv');
            header('Content-Disposition: attachment; filename="data.csv"');
            $file = fopen('php://output', 'w');
            $columns = $check_array['report']->columns;
            $columns = array_values(array_diff($columns, array('year')));
            $header = array_merge(
                array(
                    "Sr No",
                    ""
                ),
                $columns
            );
            $total_y = count($columns);
            $x = $_POST['local_stored_data']['step_1']['old_are'];
            $client_age = array();
            for ($y = 0; $y < $total_y; $y++) {
                $client_age[] = $x + $y;
            }

            $a = $_POST['local_stored_data']['step_1']['life_expect'];
            $client_income = array();
            for ($b = 0; $b < $total_y; $b++) {
                $client_income[] = $a + $b;
            }
            //spouse age array 
            $e = $_POST['local_stored_data']['step_1']['info_are'];
            $spouse_age = array();

            $total_y_spouse = (int) $_POST['local_stored_data']['step_1']['estimate_expect'] - (int) $e;

            for ($f = 0; $f < $total_y_spouse; $f++) {
                $spouse_age[] = $e + $f;
            }


            //spouse income tax array
            $m = $_POST['local_stored_data']['step_1']['estimate_expect'];
            $spouse_income = array();
            for ($n = 0; $n < $total_y; $n++) {
                $spouse_income[] = $m + $n;
            }
            $labelArray = array(
                "Client Age",
                //"Your_income_tax_rate", 
                "Spouse Age",
                //"Spouse's_income_tax_rate", 	
            );
            $generalArray = array(
                "Client Age" => $client_age,
                //"Your_income_tax_rate" => $client_income, 
                "Spouse Age" => $spouse_age,
                //"Spouse's_income_tax_rate" => $spouse_income, 
            );
            // echo '<pre>'; print_r($generalArray); exit;
            $data = array(
                array(
                    "title"   => "General Information",
                    'columns' => array(),
                ),
                array(
                    "title"   => "Income",
                    'columns' => array(),
                ),
            );

            foreach ($labelArray as $label) {
                $subarray = array($label);
                $values = isset($generalArray[$label]) ? $generalArray[$label] : array();
                foreach ($values as $value) {
                    $subarray[] = $value;
                }
                $data[0]['columns'][] = $subarray;
            }
            $original_array = $check_array['report']->data;
            $second_table = array();
            foreach ($original_array[0] as $index => $value) {
                $new_row = array($value);
                for ($i = 1; $i < count($original_array); $i++) {
                    array_push($new_row, $original_array[$i][$index]);
                }
                $data[1]['columns'][] = $new_row;
                // array_push($second_table, $new_row);
            }

            fputcsv($file, $header);

            if (!empty($data)) {
                $sr_no = 1;

                foreach ($data as $key => $value) {
                    $exportcsv = array($sr_no++);
                    if (!empty($value)) {
                        $exportcsv[] = $value['title'];
                        fputcsv($file, $exportcsv);
                        if (!empty($value['columns'])) {
                            foreach ($value['columns'] as $sub_val_array) {
                                $exportcsv2 = array($sr_no++);
                                if (!empty($sub_val_array)) {
                                    foreach ($sub_val_array as $sub_val) {
                                        $exportcsv2[] = $sub_val;
                                    }
                                }
                                fputcsv($file, $exportcsv2);
                            }
                        }
                    }
                }
            }
            fclose($file);
            exit;
        }
    }

    //step-form csv upload folder code
    public function upload_csv_file()
    {
        $csv_dir = WISELY_SURPLUS_CALCULATOR_DIR . '/public/csv-save-folder/';

        if (!is_dir($csv_dir)) { // Check if dir is exist
            mkdir($csv_dir); // if not then crete it
        }

        //$user = wp_get_current_user();
        //$firstname = $user->first_name;
        //$lastname  = $user->last_name;

        $check_array = self::general_get_data($_POST['local_stored_data']);

        $filename = 'data-csv-' . time() . '.csv';
        header("Content-Description: File Transfer");
        header("Content-Disposition: attachment; filename=$filename");
        header("Content-Type: application/csv;");
        $file = fopen('php://output', 'w');

        $columns = $check_array['report']->columns;
        $columns = array_values(array_diff($columns, array('year')));

        $header = array_merge(
            array(
                "Sr No",
                ""
            ),
            $columns
        );

        $total_y = count($columns);
        $x = $_POST['local_stored_data']['step_1']['old_are'];
        $client_age = array();
        for ($y = 0; $y < $total_y; $y++) {
            $client_age[] = $x + $y;
        }

        $a = $_POST['local_stored_data']['step_1']['life_expect'];
        $client_income = array();
        for ($b = 0; $b < $total_y; $b++) {
            $client_income[] = $a + $b;
        }
        //spouse age array 
        $e = $_POST['local_stored_data']['step_1']['info_are'];
        $spouse_age = array();

        $total_y_spouse = (int) $_POST['local_stored_data']['step_1']['estimate_expect'] - (int) $e;

        for ($f = 0; $f < $total_y_spouse; $f++) {
            $spouse_age[] = $e + $f;
        }

        //spouse income tax array
        $m = $_POST['local_stored_data']['step_1']['estimate_expect'];
        $spouse_income = array();
        for ($n = 0; $n < $total_y; $n++) {
            $spouse_income[] = $m + $n;
        }
        $labelArray = array(
            "Client",
            "Your_income_tax_rate",
            "Spouse",
            "Spouse's_income_tax_rate",
        );
        $generalArray = array(
            "Client" => $client_age,
            "Your_income_tax_rate" => $client_income,
            "Spouse" => $spouse_age,
            "Spouse's_income_tax_rate" => $spouse_income,
        );

        $data = array(
            array(
                "title"   => "General Information",
                'columns' => array(),
            ),
            array(
                "title"   => "Income",
                'columns' => array(),
            ),
        );

        foreach ($labelArray as $label) {
            $subarray = array($label);
            $values = isset($generalArray[$label]) ? $generalArray[$label] : array();
            foreach ($values as $value) {
                $subarray[] = $value;
            }
            $data[0]['columns'][] = $subarray;
        }

        $original_array = $check_array['report']->data;
        $second_table = array();
        foreach ($original_array[0] as $index => $value) {
            $new_row = array($value);
            for ($i = 1; $i < count($original_array); $i++) {
                array_push($new_row, $original_array[$i][$index]);
            }
            $data[1]['columns'][] = $new_row;
        }

        $csv_content = '';
        $sr_no = 1;
        foreach ($data as $key => $value) {
            $exportcsv = array($sr_no++);
            if (!empty($value)) {
                $exportcsv[] = $value['title'];
                $csv_content .= implode(',', $exportcsv) . PHP_EOL;
                if (!empty($value['columns'])) {
                    foreach ($value['columns'] as $sub_val_array) {
                        $exportcsv2 = array($sr_no++);
                        if (!empty($sub_val_array)) {
                            foreach ($sub_val_array as $sub_val) {
                                $exportcsv2[] = $sub_val;
                            }
                        }
                        $csv_content .= implode(',', $exportcsv2) . PHP_EOL;
                    }
                }
            }
        }
        // Write the header row
        $headerRow = implode(',', $header) . PHP_EOL;
        $csv_content = $headerRow . $csv_content;


        file_put_contents($csv_dir . $filename, $csv_content); // Save the CSV file

    }


    // recaptcha_check_answer for code by Rahul
    public function wsc_recaptcha_check_answer_fun($secretkey, $wsc_grecaptcha = null)
    {

        $response = array();

        $curlx = curl_init();

        curl_setopt($curlx, CURLOPT_URL, "https://www.google.com/recaptcha/api/siteverify");
        curl_setopt($curlx, CURLOPT_HEADER, 0);
        curl_setopt($curlx, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($curlx, CURLOPT_POST, 1);

        $post_data =
            [
                'secret' => $secretkey,
                'response' => $wsc_grecaptcha,
            ];
        curl_setopt($curlx, CURLOPT_POSTFIELDS, $post_data);
        $resp = json_decode(curl_exec($curlx));
        curl_close($curlx);
        if ($resp->success) {
            $response['success'] = true;
        } else {
            $response['success'] = false;
            $response['error'] = 'invalid reCAPTCHA';
        }
        return $response;
    }

    // country_list for code by Rahul
    public function wsc_country_list_fun($country_old = '')
    {
        global $woocommerce;
        $countries_obj = new WC_Countries();
        $countries = $countries_obj->__get('countries');
        $html = "";
        $html .= "<option value=''>Select Country </option>";
        if (isset($countries) && !empty($countries)) {
            foreach ($countries as $key => $country_val) {
                $html .= "<option value=" . $key . " " . selected($key, $country_old) . " >" . $country_val . "</option>";
            }
        }
        return $html;
    }

    // country_by_states_list for code by Rahul
    public function wsc_country_by_states_list_fun($country_code = '', $states_code = '')
    {

        global $woocommerce;
        $countries_obj = new WC_Countries();
        $wc_states_list = $countries_obj->get_states($country_code);
        $html = "";
        $html .= "<option value=''>Select States </option>";
        if (isset($wc_states_list) && !empty($wc_states_list)) {
            foreach ($wc_states_list as $key => $states_val) {
                $html .= "<option value=" . $key . " " . selected($key, $states_code) . " >" . $states_val . "</option>";
            }
        }
        return $html;
    }

    public function wc_zero_product_filter($needs_payment, $cart)
    {
        // Set true
        $needs_payment = true;
        return $needs_payment;
    }


    /**
     * Static Function API
     * Global Function For POST API Call
     *
     * @package    	Wisely_Surplus_Calculator
     * @author     	World Web Technology
     * @version    	1.0.0
     * @param    	$api_url|string
     * @param    	$post_data|array
     * @return 		$response_arr|array
     */
    public function wisely_POST_curl_api_call($post_data = array())
    {

        $api_url = 'https://5biiioz4fxmkbl4t7vgbmfyysi0yeydd.lambda-url.us-east-1.on.aws/';

        if ($api_url != '' && !empty($post_data)) {

            // POST Data Stringify
            $post_data_string = json_encode($post_data);

            // CURL HTTP Header
            $headers = array(
                'accept: application/json',
                'Content-Type: application/json',
                'Content-Length: ' . strlen($post_data_string),
            );

            // START CURL Execution
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $api_url);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data_string);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            $response = curl_exec($ch);

            if (curl_errno($ch)) {
                $error_msg = curl_error($ch);
                // echo "<pre> error_msg"; print_r($error_msg); echo "<pre>";
            }

            $status_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            //echo $response . PHP_EOL;
            $response_arr = (array)json_decode($response);
            $response_arr['status_code'] = $status_code;
            // END CURL Execution

            return $response_arr;
        } else {

            return array(
                'api_url' => '$api_url is missing or empty',
                'post_data' => '$post_data is missing or empty',
                'status_code' => 500
            );
        }
    }


    //api data get code 
    public function local_storage_data()
    {

        /* save user local form data in DB start */

        if (is_user_logged_in()) {
            $userid = get_current_user_id();
            $subscriptions = wcs_get_users_subscriptions($userid);
            if (!empty($subscriptions)) {
                foreach ($subscriptions as $subscription) {
                    if ($subscription->get_status() == 'active') {
                        update_user_meta($userid, 'user_all_step_calc_form_data', $_POST['local_stored_data']);
                        break;
                    }
                }
            }
        }

        /* save user local form data in DB end */


        $donate_arr = $_POST['local_stored_data']['step_8']['donate_plan_no_main'];
        $donate_arr = implode("-", $donate_arr);
        $donate_arr = explode("-", $donate_arr);
        $donate_start_date = $donate_arr[0];
        $donate_end_date = $donate_arr[1];

        $donate_plain_arr = $_POST['local_stored_data']['step_8']['donate_plan_no_spouse'];
        $donate_plain_arr = implode("-", $donate_plain_arr);
        $donate_plain_arr = explode("-", $donate_plain_arr);
        $donate_plain_start = $donate_arr[0];
        $donate_plain_end = $donate_arr[1];

        $oneoff_expense_arr = $_POST['local_stored_data']['step_8']['oneoff_expense_main'];
        $oneoff_expense_arr = implode("-", $oneoff_expense_arr);
        $oneoff_expense_arr = explode("-", $oneoff_expense_arr);
        $oneoff_start = $oneoff_expense_arr[0];
        $oneoff_end = $oneoff_expense_arr[1];

        $oneoff_expense_s_arr = $_POST['local_stored_data']['step_8']['oneoff_expense_spouse'];
        $oneoff_expense_s_arr = implode("-", $oneoff_expense_s_arr);
        $oneoff_expense_s_arr = explode("-", $oneoff_expense_s_arr);
        $oneoff_start_s = $oneoff_expense_s_arr[0];
        $oneoff_end_s = $oneoff_expense_s_arr[1];


        $data  = array(
            'local_stored_data' => $_POST['local_stored_data'],
            'local_old_are' => $_POST['local_stored_data']['step_1']['old_are'],
            'local_info_are' => $_POST['local_stored_data']['step_1']['info_are'],
            'local_estimate_expect' => $_POST['local_stored_data']['step_1']['estimate_expect'],
            'local_live' => $_POST['local_stored_data']['step_1']['live'],
            'local_life_expect' => $_POST['local_stored_data']['step_1']['life_expect'],
            'local_live_spouse' => $_POST['local_stored_data']['step_1']['live'],
            'local_est_with_spouse' => $_POST['local_stored_data']['step_1']['est_with_spouse'],
            'local_inflation_rate' => $_POST['local_stored_data']['step_2']['inflation_rate'],
            'local_investor_main' => $_POST['local_stored_data']['step_2']['investor_main'],
            'local_income_rate' => $_POST['local_stored_data']['step_2']['income_rate'],
            'local_growth_rate' => $_POST['local_stored_data']['step_2']['growth_rate'],
            'local_specify_return' => $_POST['local_stored_data']['step_2']['specify_return'],
            'local_your_income' => $_POST['local_stored_data']['step_3']['your_income'],
            'local_spouse_income' => $_POST['local_stored_data']['step_3']['spouse_income'],
            'local_your_date' => $_POST['local_stored_data']['step_3']['your_date'],
            'local_start_date' => $_POST['local_stored_data']['step_3']['start_date'],
            'local_end_date' => $_POST['local_stored_data']['step_3']['end_date'],
            'local_spouse_date' => $_POST['local_stored_data']['step_3']['spouse_date'],
            'local_spouse_start_date' => $_POST['local_stored_data']['step_3']['spouse_start_date'],
            'local_spouse_end_date' => $_POST['local_stored_data']['step_3']['spouse_end_date'],
            'local_other_date' => $_POST['local_stored_data']['step_3']['other_date'],
            'local_other_income' => $_POST['local_stored_data']['step_3']['other_income'],
            'local_other_spouse_income' => $_POST['local_stored_data']['step_3']['other_spouse_income'],
            'local_other_spouse_date' => $_POST['local_stored_data']['step_3']['other_spouse_date'],
            //CPP localstorage data
            'local_ps_spouse_age' => $_POST['local_stored_data']['step_4']['pension_sn_age'],
            'local_pension_age' => $_POST['local_stored_data']['step_4']['pension_age'],
            'local_pension_amount' => $_POST['local_stored_data']['step_4']['pension_amount'],
            'local_pension_sn_amount' => $_POST['local_stored_data']['step_4']['pension_sn_amount'],

            //OAS localstorage data
            'local_sc_spouse_age' => $_POST['local_stored_data']['step_4']['sc_spouse_age'],
            'local_security_sn_age' => $_POST['local_stored_data']['step_4']['security_sn_age'],
            'local_security_age' => $_POST['local_stored_data']['step_4']['security_age'],
            'local_security_amount' => $_POST['local_stored_data']['step_4']['security_amount'],
            'local_security_sn_amount' => $_POST['local_stored_data']['step_4']['security_sn_amount'],

            //Defined Benefit Pension localstorage data
            'local_bp_spouse_age' => $_POST['local_stored_data']['step_4']['bp_spouse_age'],
            'local_benifit_amount' => $_POST['local_stored_data']['step_4']['benifit_amount'],
            'local_benifit_sn_amount' => $_POST['local_stored_data']['step_4']['benifit_sn_amount'],
            //'local_index_spouse_age' => $_POST['local_stored_data']['step_4']['index_spouse_age'],
            'local_indexed_to_inflatiton' => $_POST['local_stored_data']['step_4']['indexed_to_inflatiton'],
            'local_indexed_to_inflatiton_spouse' => $_POST['local_stored_data']['step_4']['indexed_to_inflatiton_spouse'],
            'local_start_rec_pay_cpp_qpp' => $_POST['local_stored_data']['step_4']['start_rec_pay_cpp_qpp'],
            'local_start_rec_pay_cpp_qpp_spouse' => $_POST['local_stored_data']['step_4']['start_rec_pay_cpp_qpp_spouse'],
            'local_start_OAS_pay' => $_POST['local_stored_data']['step_4']['start_OAS_pay'],
            'local_start_OAS_pay_spouse' => $_POST['local_stored_data']['step_4']['start_OAS_pay_spouse'],
            'local_start_def_ben_pens' => $_POST['local_stored_data']['step_4']['start_def_ben_pens'],
            'local_start_def_ben_pens_spouse' => $_POST['local_stored_data']['step_4']['start_def_ben_pens_spouse'],
            'local_benifit_age' => $_POST['local_stored_data']['step_4']['benifit_age'],
            'local_benifit_sn_age' => $_POST['local_stored_data']['step_4']['benifit_sn_age'],
            //Health Care Expense localstorage data
            'local_annual_expense' => $_POST['local_stored_data']['step_7']['annual_expense'],
            'local_care_expense' => $_POST['local_stored_data']['step_7']['care_expense'],
            'local_se_annual_expense' => $_POST['local_stored_data']['step_7']['se_annual_expense'],
            'local_se_care_expense' => $_POST['local_stored_data']['step_7']['se_care_expense'],
            'local_expe_each_stage_ret' => $_POST['local_stored_data']['step_7']['expe_each_stage_ret'],
            'local_expe_each_stage_ret_spouse' => $_POST['local_stored_data']['step_7']['expe_each_stage_ret_spouse'],

            //Core_Needs localstorage data
            'local_annual_expense' => $_POST['local_stored_data']['step_7']['annual_expense'],
            'local_care_expense' => $_POST['local_stored_data']['step_7']['care_expense'],
            'local_se_annual_expense' => $_POST['local_stored_data']['step_7']['se_annual_expense'],
            'local_se_care_expense' => $_POST['local_stored_data']['step_7']['se_care_expense'],
            'local_annual_age' => $_POST['local_stored_data']['step_7']['annual_age'],
            'local_care_age' => $_POST['local_stored_data']['step_7']['care_age'],
            'local_second_annual_age' => $_POST['local_stored_data']['step_7']['second_annual_age'],
            'local_second_care_age' => $_POST['local_stored_data']['step_7']['second_care_age'],
            'local_third_annual_age' => $_POST['local_stored_data']['step_7']['third_annual_age'],
            'local_third_care_age' => $_POST['local_stored_data']['step_7']['third_care_age'],

            'local_spouse_annual' => $_POST['local_stored_data']['step_7']['spouse_annual_age'],
            'local_spouse_care' => $_POST['local_stored_data']['step_7']['spouse_care_age'],

            'local_spouse_se_annual' => $_POST['local_stored_data']['step_7']['spouse_se_annual_age'],
            'local_spouse_se_care' => $_POST['local_stored_data']['step_7']['spouse_se_care_age'],
            'local_spouse_th_annual' => $_POST['local_stored_data']['step_7']['spouse_th_annual_age'],
            'local_spouse_th_care_age' => $_POST['local_stored_data']['step_7']['spouse_th_care_age'],

            //charitable donations localstorage data
            'local_donate_plan_no_main' => $_POST['local_stored_data']['step_8']['donate_plan_no_main'],
            'local_donate_plan_main' => $_POST['local_stored_data']['step_8']['donate_plan_main'],
            'local_donate_plan_no_spouse' => $_POST['local_stored_data']['step_8']['donate_plan_no_spouse'],
            'local_donate_plan_spouse' => $_POST['local_stored_data']['step_8']['donate_plan_spouse'],

            //Discretionary Spending localstorage data
            'local_expense_type_main_val' => $_POST['local_stored_data']['step_8']['expense_type_main_val'],
            'local_expense_type_spouse_val' => $_POST['local_stored_data']['step_8']['expense_type_spouse_val'],
            'local_oneoff_expense_main' => $_POST['local_stored_data']['step_8']['oneoff_expense_main'],
            'local_oneoff_expense_spouse' => $_POST['local_stored_data']['step_8']['oneoff_expense_spouse'],

            //Desired Estate localstorage data
            'local_desired_estate' => $_POST['local_stored_data']['step_8']['desired_estate_main'],

            //Life Insurance localstorage data
            'local_estate_value' => $_POST['local_stored_data']['step_5']['estate_value'],
            'local_se_estate_value' => $_POST['local_stored_data']['step_5']['se_estate_value'],

            //Primary Residence localstorage data
            'local_Primary_value' => $_POST['local_stored_data']['step_6']['primary_value'],
            'local_plan_return' => $_POST['local_stored_data']['step_6']['plan_return'],

            //assets localstorage data			
            'local_spouse_value' => $_POST['local_stored_data']['step_5']['spouse_value'],
            'local_account_value' => $_POST['local_stored_data']['step_5']['account_value'],
            'local_ct_account_value' => $_POST['local_stored_data']['step_5']['ct_account_value'],
            'local_st_account_value' => $_POST['local_stored_data']['step_5']['st_account_value'],
            'local_ct_book_value' => $_POST['local_stored_data']['step_5']['ct_book_value'],
            'local_st_book_value' => $_POST['local_stored_data']['step_5']['st_book_value'],
        );
        //client
        $asset_account_main_array = $_POST['local_stored_data']['step_5']['account_main'];
        $asset_account_value_array =  array_map("floatval", str_replace(array("$", ","), "", $_POST['local_stored_data']['step_5']['account_value']));


        $account_main_value_combine  = array_combine($asset_account_main_array, $asset_account_value_array);

        if (!array_key_exists("TFSA", $account_main_value_combine)) {
            $account_main_value_combine['TFSA'] = floatval(0);
        }
        if (!array_key_exists("RRSP", $account_main_value_combine)) {
            $account_main_value_combine['RRSP'] = floatval(0);
        }
        if (!array_key_exists("RRIF", $account_main_value_combine)) {
            $account_main_value_combine['RRIF'] = floatval(0);
        }
        if (!array_key_exists("LIRA", $account_main_value_combine)) {
            $account_main_value_combine['LIRA'] = floatval(0);
        }
        if (!array_key_exists("LIF", $account_main_value_combine)) {
            $account_main_value_combine['LIF'] = floatval(0);
        }


        $account_main_value_combine["NON_REGISTERED_ASSET"] = floatval(str_replace(array("$", ","), "", $data['local_ct_account_value']));
        $account_main_value_combine["NON_REGISTERED_BOOK_VALUE"] = floatval(str_replace(array("$", ","), "", $data['local_ct_book_value']));

        //spouse
        $asset_account_main_spouse_array = $_POST['local_stored_data']['step_5']['spouse_main'];
        $asset_account_value_spouse_array =  array_map("floatval", str_replace(array("$", ","), "", $_POST['local_stored_data']['step_5']['spouse_value']));

        $account_main_value_spouse_combine  = array_combine($asset_account_main_spouse_array, $asset_account_value_spouse_array);
        if (!array_key_exists("TFSA", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['TFSA'] = floatval(0);
        }
        if (!array_key_exists("RRSP", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['RRSP'] = floatval(0);
        }
        if (!array_key_exists("RRIF", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['RRIF'] = floatval(0);
        }
        if (!array_key_exists("LIRA", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['LIRA'] = floatval(0);
        }
        if (!array_key_exists("LIF", $account_main_value_spouse_combine)) {
            $account_main_value_spouse_combine['LIF'] = floatval(0);
        }

        $account_main_value_spouse_combine["NON_REGISTERED_ASSET"] = floatval(str_replace(array("$", ","), "", $data['local_st_account_value']));
        $account_main_value_spouse_combine["NON_REGISTERED_BOOK_VALUE"] = floatval(str_replace(array("$", ","), "", $data['local_st_book_value']));

        //$start_year = 2023;	
        $start_year = (int) date('Y');
        $client_rem_years = (int) $data['local_life_expect'] - (int)$data['local_old_are'];
        $end_year = (int) $start_year + (int) $client_rem_years;
        $spouse_rem_years = (int) $data['local_estimate_expect'] - (int)$data['local_info_are'];
        $end_year_spouse = (int) $start_year + (int) $spouse_rem_years;


        /* pension startdate calculation start */

        $local_start_rec_pay_cpp_qpp = $data['local_start_rec_pay_cpp_qpp'];
        $local_start_rec_pay_cpp_qpp_spouse = $data['local_start_rec_pay_cpp_qpp_spouse'];
        if ($local_start_rec_pay_cpp_qpp == 'yes') {
            $start_year_pension = $start_year;
            $end_year_pension = $end_year;
        } else {

            $local_pension_age = $data['local_pension_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_pension = (int) $local_pension_age - (int) $local_old_are;
            $start_year_pension = $start_year + $remain_years_of_pension;
            $end_year_pension = $end_year;
        }

        if ($local_start_rec_pay_cpp_qpp_spouse == 'yes') {

            $start_year_pension_spouse = $start_year;
            $end_year_pension_spouse = $end_year_spouse;
        } else {

            $local_ps_spouse_age = $data['local_ps_spouse_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_pension_spouse = (int) $local_ps_spouse_age - (int) $local_info_are;
            $start_year_pension_spouse = $start_year + $remain_years_of_pension_spouse;
            $end_year_pension_spouse = $end_year_spouse;
        }

        /* pension startdate calculation end */
        /* OAS startdate calculation start */

        $local_start_OAS_pay = $data['local_start_OAS_pay'];
        $local_start_OAS_pay_spouse = $data['local_start_OAS_pay_spouse'];

        if ($local_start_OAS_pay == 'yes') {

            $start_year_OAS = $start_year;
            $end_year_OAS = $end_year;
        } else {

            $local_security_age = $data['local_security_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_OAS = (int) $local_security_age - (int) $local_old_are;
            $start_year_OAS = $start_year + $remain_years_of_OAS;
            $end_year_OAS = $end_year;
        }
        if ($local_start_OAS_pay_spouse == 'yes') {

            $start_year_OAS_spouse = $start_year;
            $end_year_OAS_spouse = $end_year_spouse;
        } else {

            $local_security_sn_age = $data['local_security_sn_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_OAS_spouse = (int) $local_security_sn_age - (int) $local_info_are;
            $start_year_OAS_spouse = $start_year + $remain_years_of_OAS_spouse;
            $end_year_OAS_spouse = $end_year_spouse;
        }

        /* OAS startdate calculation end */
        /* Defined Benefit Pension startdate calculation start */

        $local_start_def_ben_pens = $data['local_start_def_ben_pens'];
        $local_start_def_ben_pens_spouse = $data['local_start_def_ben_pens_spouse'];

        if ($local_start_def_ben_pens == 'yes') {

            $start_year_DBP = $start_year;
            $end_year_DBP = $end_year;
        } else {

            $local_benifit_age = $data['local_benifit_age'];
            $local_old_are = $data['local_old_are'];
            $remain_years_of_DBP = (int) $local_benifit_age - (int) $local_old_are;
            $start_year_DBP = $start_year + $remain_years_of_DBP;
            $end_year_DBP = $end_year;
        }

        if ($local_start_def_ben_pens_spouse == 'yes') {

            $start_year_DBP_spouse = $start_year;
            $end_year_DBP_spouse = $end_year_spouse;
        } else {

            $local_benifit_sn_age = $data['local_benifit_sn_age'];
            $local_info_are = $data['local_info_are'];
            $remain_years_of_DBP_spouse = (int) $local_benifit_sn_age - (int) $local_info_are;
            $start_year_DBP_spouse = $start_year + $remain_years_of_DBP_spouse;
            $end_year_DBP_spouse = $end_year_spouse;
        }
        /* Defined Benefit Pension startdate calculation end */


        $pension_arr = [
            [
                "person" => "client",
                "name" => "CPP",
                "start_year" => $start_year_pension,
                "end_year" => $end_year_pension,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_pension_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "client",
                "name" => "OAS",
                "start_year" => $start_year_OAS,
                "end_year" => $end_year_OAS,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_security_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "client",
                "name" => "OTHER_PENSION",
                "start_year" => $start_year_DBP,
                "end_year" => $end_year_DBP,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_benifit_amount'])),
                "index_rate" => ($data['local_indexed_to_inflatiton'] == 'yes') ? floatval($data['local_inflation_rate'] / 100) : 0.00,
            ],
        ];

        $pension_spouse_arr =  [
            [
                "person" => "spouse",
                "name" => "CPP",
                "start_year" => $start_year_pension_spouse,
                "end_year" => $end_year_pension_spouse,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_pension_sn_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "spouse",
                "name" => "OTHER_PENSION",
                "start_year" => $start_year_DBP_spouse,
                "end_year" => $end_year_DBP_spouse,
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_benifit_sn_amount'])),
                "index_rate" => ($data['local_indexed_to_inflatiton_spouse'] == 'yes') ? floatval($data['local_inflation_rate'] / 100) : 0.00,
            ],
            [
                "person" => "spouse",
                "name" => "OAS",
                "start_year" => $start_year_OAS_spouse,
                "end_year" => $end_year_OAS_spouse,
                "amount" =>  floatval(str_replace(array("$", ","), "", $data['local_security_sn_amount'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],

        ];

        if ($data['local_est_with_spouse'] == 'yes') {

            $pension_arr = array_merge($pension_arr, $pension_spouse_arr);
        }

        /* expense startyear calculation start */

        $local_expe_each_stage_ret = $data['local_expe_each_stage_ret'];
        $local_expe_each_stage_ret_spouse = $data['local_expe_each_stage_ret_spouse'];
        if ($local_expe_each_stage_ret == 'yes') {

            $core_needs_expe_start_year = $start_year;

            $remain_years_upto_75 = 75 - (int)$data['local_old_are'];

            $core_needs_expe_end_year = $start_year + $remain_years_upto_75;


            /* 76 to 85 */

            $core_needs_expe_start_year_76_85 = $core_needs_expe_end_year + 1;

            $remain_years_upto_85 = 85 - (int)$data['local_old_are'];

            $core_needs_expe_end_year_76_85 = $start_year + $remain_years_upto_85;


            /* 86 to life exp year */

            $core_needs_expe_start_year_86_life = $core_needs_expe_end_year_76_85 + 1;

            $remain_years_upto_life = (int) $data['local_life_expect'] - (int)$data['local_old_are'];

            $core_needs_expe_end_year_86_life = $start_year + $remain_years_upto_life;
        } else {

            $core_needs_expe_start_year = $start_year;
            $core_needs_expe_end_year = $end_year;
            $core_needs_expe_start_year_76_85 = 0;
            $core_needs_expe_end_year_76_85 = 0;
            $core_needs_expe_start_year_86_life = 0;
            $core_needs_expe_end_year_86_life = 0;
        }

        if ($local_expe_each_stage_ret_spouse == 'yes') {

            $core_needs_expe_start_year_spouse = $start_year;

            $remain_years_upto_75_spouse = 75 - (int)$data['local_info_are'];

            $core_needs_expe_end_year_spouse = $start_year + $remain_years_upto_75_spouse;


            /* 76 to 85 */

            $core_needs_expe_start_year_76_85_spouse = $core_needs_expe_end_year_spouse + 1;

            $remain_years_upto_85_spouse = 85 - (int)$data['local_info_are'];

            $core_needs_expe_end_year_76_85_spouse = $start_year + $remain_years_upto_85_spouse;



            /* 86 to life exp year */

            $core_needs_expe_start_year_86_life_spouse = $core_needs_expe_end_year_76_85_spouse + 1;

            $remain_years_upto_life_spouse = (int) $data['local_estimate_expect'] - (int)$data['local_info_are'];

            $core_needs_expe_end_year_86_life_spouse = $start_year + $remain_years_upto_life_spouse;
        } else {

            $core_needs_expe_start_year_spouse = $start_year;
            $core_needs_expe_end_year_spouse = $end_year_spouse;

            $core_needs_expe_start_year_76_85_spouse = 0;
            $core_needs_expe_end_year_76_85_spouse = 0;
            $core_needs_expe_start_year_86_life_spouse = 0;
            $core_needs_expe_end_year_86_life_spouse = 0;
        }

        /* expense startyear calculation end */

        if ($local_expe_each_stage_ret == 'yes') {

            $income_req_arr1 = [

                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85,
                    "end_year" => $core_needs_expe_end_year_76_85,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_second_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85,
                    "end_year" => $core_needs_expe_end_year_76_85,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_second_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life,
                    "end_year" => $core_needs_expe_end_year_86_life,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_third_annual_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life,
                    "end_year" => $core_needs_expe_end_year_86_life,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_third_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]

            ];
        } else {

            $income_req_arr1 = [

                [
                    "person" => "client",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_annual_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "client",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year,
                    "end_year" => $core_needs_expe_end_year,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_care_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        }

        /* spouse expense start */

        if ($local_expe_each_stage_ret_spouse == 'yes') {

            $income_req_arr_spouse = [
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_care'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85_spouse,
                    "end_year" => $core_needs_expe_end_year_76_85_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_se_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_76_85_spouse,
                    "end_year" => $core_needs_expe_end_year_76_85_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_se_care'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life_spouse,
                    "end_year" => $core_needs_expe_end_year_86_life_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_th_annual'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_86_life_spouse,
                    "end_year" => $core_needs_expe_end_year_86_life_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_th_care_age'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        } else {


            $income_req_arr_spouse = [
                [
                    "person" => "spouse",
                    "type" => "ANNUAL_RETIREMENT_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_annual_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ],
                [
                    "person" => "spouse",
                    "type" => "HEALTH_CARE_EXPENSES",
                    "start_year" => $core_needs_expe_start_year_spouse,
                    "end_year" => $core_needs_expe_end_year_spouse,
                    "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_care_expense'])),
                    "index_rate" => floatval($data['local_inflation_rate'] / 100),
                ]
            ];
        }


        if ($data['local_est_with_spouse'] == 'yes') {

            $income_req_arr1 = array_merge($income_req_arr1, $income_req_arr_spouse);
        }


        /* spouse expense end */


        /* one off expense calculation start */

        // $one_off_exp_arr = array_combine($data['local_expense_type_main_val'],$data['local_oneoff_expense_main']);
        $one_off_exp_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_expense_type_main_val'], $data['local_oneoff_expense_main']);

        $one_off_exp_arr_struct = array();

        if (!empty($one_off_exp_arr)) {

            foreach ($one_off_exp_arr as $arr_ele) {

                foreach ($arr_ele as $one_off_exp => $one_off_year) {

                    $one_off_exp_arr_struct[] = [
                        "person" => "client",
                        "type" => "ONE_OFF_EXPENSES",
                        "start_year" => (int) $one_off_year,
                        "end_year" => (int) $one_off_year,
                        "amount" => floatval(str_replace(array("$", ","), "", $one_off_exp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }

        // one off spouse

        //$one_off_exp_arr_spouse = array_combine($data['local_expense_type_spouse_val'],$data['local_oneoff_expense_spouse']);

        $one_off_exp_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_expense_type_spouse_val'], $data['local_oneoff_expense_spouse']);


        $one_off_exp_arr_struct_spouse = array();

        if (!empty($one_off_exp_arr_spouse)) {

            foreach ($one_off_exp_arr_spouse as $arr_ele) {

                foreach ($arr_ele as $one_off_exp => $one_off_year) {

                    $one_off_exp_arr_struct_spouse[] = [
                        "person" => "spouse",
                        "type" => "ONE_OFF_EXPENSES",
                        "start_year" => (int) $one_off_year,
                        "end_year" => (int) $one_off_year,
                        "amount" => floatval(str_replace(array("$", ","), "", $one_off_exp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }

        $income_req_arr_final = array_merge($income_req_arr1, $one_off_exp_arr_struct);

        if ($data['local_est_with_spouse'] == 'yes') {

            $income_req_arr_final = array_merge($income_req_arr_final, $one_off_exp_arr_struct_spouse);
        }



        /* one off expense calculation end */


        /* charitable donation start */

        $donation_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_donate_plan_no_main'], $data['local_donate_plan_main']);


        $donation_arr_struct = array();

        if (!empty($donation_arr)) {

            foreach ($donation_arr as $donation_arr_ele) {

                foreach ($donation_arr_ele as $dona_year => $dona_amt) {

                    $don_arr_year = explode('-', $dona_year);
                    $don_arr_start_year = $don_arr_year[0];
                    $don_arr_end_year = $don_arr_year[1];

                    $donation_arr_struct[] = [

                        "person" => "client",
                        "start_year" => floatval($don_arr_start_year),
                        "end_year" => floatval($don_arr_end_year),
                        "amount" => floatval(str_replace(array("$", ","), "", $dona_amt)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }


        $donation_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_donate_plan_no_spouse'], $data['local_donate_plan_spouse']);

        $donation_arr_struct_spouse = array();

        if (!empty($donation_arr_spouse)) {

            foreach ($donation_arr_spouse as $donation_arr_spouse_ele) {

                foreach ($donation_arr_spouse_ele as $dona_year_sp => $dona_amt_sp) {

                    $don_arr_year_sp = explode('-', $dona_year_sp);
                    $don_arr_start_year_sp = $don_arr_year_sp[0];
                    $don_arr_end_year_sp = $don_arr_year_sp[1];


                    $donation_arr_struct_spouse[] = [
                        "person" => "spouse",
                        "start_year" => floatval($don_arr_start_year_sp),
                        "end_year" => floatval($don_arr_end_year_sp),
                        "amount" => floatval(str_replace(array("$", ","), "", $dona_amt_sp)),
                        "index_rate" => floatval($data['local_inflation_rate'] / 100),
                    ];
                }
            }
        }


        $donation_arr_final = $donation_arr_struct;

        if ($data['local_est_with_spouse'] == 'yes') {

            $donation_arr_final = array_merge($donation_arr_final, $donation_arr_struct_spouse);
        }

        /* charitable donation end */
        /* income array calculation start */

        $income_arr = [
            [
                "person" => "client",
                "start_year" => floatval($data['local_start_date']),
                "end_year" => floatval($data['local_end_date']),
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_your_income'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
            [
                "person" => "spouse",
                "start_year" => floatval($data['local_spouse_start_date']),
                "end_year" => floatval($data['local_spouse_end_date']),
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_spouse_income'])),
                "index_rate" => floatval($data['local_inflation_rate'] / 100),
            ],
        ];


        $other_income_arr = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_other_date'], $data['local_other_income']);


        if (!empty($other_income_arr)) {

            foreach ($other_income_arr as $other_income_arr_ele) {

                foreach ($other_income_arr_ele as $oth_inc_year => $oth_inc_amt) {

                    if (!empty($oth_inc_year) && !empty($oth_inc_amt)) {

                        if (str_contains($oth_inc_year, '-')) {

                            $oth_inc_year = explode('-', $oth_inc_year);
                            $other_inc_start_year = $oth_inc_year[0];
                            $other_inc_end_year = $oth_inc_year[1];
                        } else {

                            $other_inc_start_year = $oth_inc_year;
                            $other_inc_end_year = $oth_inc_year;
                        }


                        $other_income_arr_struct[] = [

                            "person" => "client",
                            "start_year" => floatval($other_inc_start_year),
                            "end_year" => floatval($other_inc_end_year),
                            "amount" => floatval(str_replace(array("$", ","), "", $oth_inc_amt)),
                            "index_rate" => floatval($data['local_inflation_rate'] / 100),
                        ];
                    }
                }
            }
        }



        if (!empty($other_income_arr_struct)) {
            $income_arr = array_merge($income_arr, $other_income_arr_struct);
        }

        //$other_income_arr_spouse = array_combine($data['local_other_spouse_date'],$data['local_other_spouse_income']);   

        $other_income_arr_spouse = array_map(array('Wisely_Surplus_Calculator_Public', 'arr_key_value_func'), $data['local_other_spouse_date'], $data['local_other_spouse_income']);


        $other_income_arr_struct_spouse = array();

        if (!empty($other_income_arr_spouse)) {

            foreach ($other_income_arr_spouse as $other_income_arr_spouse_ele) {

                foreach ($other_income_arr_spouse_ele as $oth_inc_year_sp => $oth_inc_amt_sp) {

                    if (!empty($oth_inc_year_sp) && !empty($oth_inc_amt_sp)) {

                        if (str_contains($oth_inc_year_sp, '-')) {

                            $oth_inc_year_sp = explode('-', $oth_inc_year_sp);
                            $other_inc_start_year_sp = $oth_inc_year_sp[0];
                            $other_inc_end_year_sp = $oth_inc_year_sp[1];
                        } else {

                            $other_inc_start_year_sp = $oth_inc_year_sp;
                            $other_inc_end_year_sp = $oth_inc_year_sp;
                        }


                        $other_income_arr_struct_spouse[] = [

                            "person" => "spouse",
                            "start_year" => floatval($other_inc_start_year_sp),
                            "end_year" => floatval($other_inc_end_year_sp),
                            "amount" => floatval(str_replace(array("$", ","), "", $oth_inc_amt_sp)),
                            "index_rate" => floatval($data['local_inflation_rate'] / 100),
                        ];
                    }
                }
            }
        }

        if (!empty($other_income_arr_struct_spouse) && $data['local_est_with_spouse'] == 'yes') {
            $income_arr = array_merge($income_arr, $other_income_arr_struct_spouse);
        }

        /* income array calculation  end */
        /* PLI array start  */

        $pli_arr = [
            [
                "person" => "client",
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_estate_value'])),
            ]

        ];

        $pli_arr_spouse = [

            [
                "person" => "spouse",
                "amount" => floatval(str_replace(array("$", ","), "", $data['local_se_estate_value'])),
            ]

        ];

        if ($data['local_est_with_spouse'] == 'yes') {

            $pli_arr = array_merge($pli_arr, $pli_arr_spouse);
        }

        /* PLI array end */

        $jayParsedAry = [
            "parameters" => [
                "growth_rate" => floatval($data['local_growth_rate'] / 100),
                "income_rate" => floatval($data['local_income_rate'] / 100),
                "inflation" => floatval($data['local_inflation_rate'] / 100),
                "interest_rate" => floatval($data['local_specify_return']),
                "start_year" => $start_year,
                "client_age" => floatval($data['local_old_are']),
                "client_life_expectancy" => floatval($data['local_life_expect']),
                "spouse" => ($data['local_est_with_spouse'] == 'yes') ? true : false,
                "spouse_age" => ($data['local_est_with_spouse'] == 'yes') ? floatval($data['local_info_are']) : 0,
                "spouse_life_expectancy" => ($data['local_est_with_spouse'] == 'yes') ? floatval($data['local_estimate_expect']) : 0,
                "end_year" => $end_year,
                "end_balance" => floatval(str_replace(array("$", ","), "", $data['local_desired_estate'])),
                "sell_home" => floatval($data['local_plan_return']),
                "oas_clawback" => [
                    "base" => 72000,
                    "index" => 0.02,
                ],
                "personal_exemption" => [
                    "base" => 12896,
                    "index" => 0.02,
                ],
                "tax_rate" => [
                    "marginal" => [
                        [12070, 0],
                        [50000, 0.25],
                        [90000, 0.35],
                        [200000, 0.45],
                    ],
                    "top" => 0.54,
                ],
                "province" => "Ontario",
                "pensions" => $pension_arr,
                "incomes" => $income_arr,
                "pli" => $pli_arr,
                "income_requirements" => $income_req_arr_final,
                "charitable_donations" => $donation_arr_final,
            ],
            "start_book" => [
                "joint" => [
                    "CLEARING" => 0,
                    "HOME" => floatval(str_replace(array("$", ","), "", $data['local_Primary_value'])),
                    //"sell_home" => floatval($data['local_plan_return']),
                ],
                "client" => array_change_key_case($account_main_value_combine, CASE_UPPER),
                "spouse" => array_change_key_case($account_main_value_spouse_combine, CASE_UPPER),
                "transactions" => [],
            ],

        ];
        //echo "hello"; echo "<pre>"; print_r($data); exit();
        //echo "hi"; echo "<pre>"; print_r($jayParsedAry); exit('END');
        /* for client array */
        $check_array = self::wisely_POST_curl_api_call($jayParsedAry);
        if (
            isset($check_array) && $check_array['status_code'] == 200
        ) {

            // echo "<pre>";
            // print_r($jayParsedAry);
            // echo "=============";
            // echo "</pre>";
            //echo json_encode($jayParsedAry);
            //exit;
            // echo "<pre>";
            // print_r($check_array);
            // echo "</pre>";
            // exit;

            setlocale(LC_MONETARY, "en_US");

            $total_y = count($check_array['essential_capital']->year);
            //client age array
            $x = $data['local_old_are'];
            $client_age = array();
            for ($y = 0; $y < $total_y; $y++) {
                $client_age[] = $x + $y;
            }

            //client income tax array
            $a = $data['local_life_expect'];
            $client_income = array();
            for ($b = 0; $b < $total_y; $b++) {
                $client_income[] = $a + $b;
            }

            //spouse age array 
            $e = $data['local_info_are'];
            $spouse_age = array();

            $total_y_spouse = (int) $data['local_estimate_expect'] - (int) $e;

            for ($f = 0; $f < $total_y_spouse; $f++) {
                $spouse_age[] = $e + $f;
            }

            //spouse income tax array
            $m = $data['local_estimate_expect'];
            $spouse_income = array();
            for ($n = 0; $n < $total_y; $n++) {
                $spouse_income[] = $m + $n;
            }


            $labelArray = array(
                "Client",
                "Your_income_tax_rate",
                "Spouse",
                "Spouse's_income_tax_rate",
            );

            $generalArray = array(

                "Client" => $client_age,
                "Your_income_tax_rate" => $client_income,
                "Spouse" => $spouse_age,
                "Spouse's_income_tax_rate" => $spouse_income,

            );

            $html = '<table>
		           <tr>
		           <th class="tl tl2" style="background-color: white; min-width: 250px;"></th>';

            foreach ($check_array['essential_capital']->year as $key => $value) {

                $html .= '<th class="product" style="background:#384555; border-top-left-radius: 5px; border-left:0px; min-width: 180px;">' . $value . '</th>';
            }
            foreach ($labelArray as $key => $value) {

                $side_general = str_replace('_', ' ', $value);
                $html .= '<tr><td style="min-width: 250px; background: #e7ecf7; text-align: right;">' . $side_general . '</td>';

                foreach ($generalArray[$value] as $key => $values) {
                    if ($value == 'Your_income_tax_rate' || $value == "Spouse's_income_tax_rate") {

                        $html .= '<td style="min-width: 250px; background: #f2f2f2; text-align: right;">' . $values . '%</td>';
                    } else {

                        $html .= '<td style="min-width: 250px; background: #f2f2f2; text-align: right;">' . $values . '</td>';
                    }
                }

                $html .= '</tr>';
            }

            $html .= '</tr>
		           </table>';

            $html1 = '<table>
		           <tr>
		           <th class="tl tl2" style="position:sticky;background-color: #15ADC4; min-width: 250px;top:0;left:0;">Year<br/>You/Spouse(Ages)</th>';
            $row_count = count($check_array['report']->columns) - 1;
            unset($check_array['report']->columns[0]);


            $age_count = 0;
            foreach ($check_array['report']->columns as $key => $value) {


                if (array_key_exists($age_count, $spouse_age)) {

                    $ages_cols = $client_age[$age_count] . '/' . $spouse_age[$age_count];
                } else {

                    $ages_cols = $client_age[$age_count];
                }


                $html1 .= '<th class="product" style="position:sticky;background:#15ADC4; border-top-left-radius: 5px; border-left:0px; min-width: 180px;top:0;left:0;">' . $value . '<br><span>(' . $ages_cols . ')</span></th>';

                $age_count++;
            }

            $j = 0;

            foreach ($check_array['report']->data[0] as $key => $value) {

                if ($value == 'net_funds_in') {
                    $value = 'Net_Cash_Flow';
                }



                $side_income = str_replace('_', ' ', $value);

                if ($side_income == 'EARNED INCOME') {
                    $side_income = 'Income';
                } else if ($side_income == 'SPOUSE EARNED INCOME') {
                    $side_income = 'Spouse Income';
                } else if ($side_income == 'OTHER PENSION') {
                    $side_income = 'Defined Benefit Pension';
                } else if ($side_income == 'TAX') {
                    $side_income = 'Income Tax';
                } else if ($side_income == 'SPOUSE TAX') {
                    $side_income = 'Spouse Income Tax';
                } else if ($side_income == 'SALE OF NON REGISTERED ASSET') {
                    $side_income = 'Sale of Non-Registered Investments';
                } else if ($side_income == 'SPOUSE SALE OF NON REGISTERED ASSET') {
                    $side_income = 'Spouse Sale of Non-Registered Investments';
                } else if ($side_income == 'NON REGISTERED ASSET') {
                    $side_income = 'Non-Registered Investments';
                } else if ($side_income == 'SPOUSE NON REGISTERED ASSET') {
                    $side_income = 'Spouse Non-Registered Investments';
                } else if ($side_income == 'NON REGISTERED BOOK VALUE') {
                    $side_income = 'Cost of Non-Registered Investments';
                } else if ($side_income == 'SPOUSE NON REGISTERED BOOK VALUE') {
                    $side_income = 'Spouse Cost of Non-Registered Investments';
                } else if ($side_income == 'ONE OFF EXPENSES') {
                    $side_income = 'One-off Expenses';
                } else if ($side_income == 'SPOUSE ONE OFF EXPENSES') {
                    $side_income = 'Spouse One-off Expenses';
                } else if ($side_income == 'NON REGISTERED DIVIDEND') {
                    $side_income = 'DIVIDEND INCOME';
                } else if ($side_income == 'SPOUSE NON REGISTERED DIVIDEND') {
                    $side_income = 'SPOUSE DIVIDEND INCOME';
                } else if ($side_income == 'Total Assets') {
                    $side_income = 'TOTAL NET ASSETS';
                }

                $side_income = ucwords(strtolower($side_income));


                if ($side_income == 'Oas') {
                    $side_income = 'OAS';
                }
                if ($side_income == 'Oas Clawback') {
                    $side_income = 'OAS Clawback';
                } else if ($side_income == 'Spouse Oas') {
                    $side_income = 'Spouse OAS';
                } else if ($side_income == 'Spouse Oas Clawback') {
                    $side_income = 'Spouse OAS Clawback';
                } else if ($side_income == 'Cpp') {
                    $side_income = 'CPP';
                } else if ($side_income == 'Spouse Cpp') {
                    $side_income = 'Spouse CPP';
                } else if ($side_income == 'Spouse Other Pension') {
                    $side_income = 'Spouse Defined Benefit Pension';
                } else if ($side_income == 'Lira') {
                    $side_income = 'LIRA';
                } else if ($side_income == 'Spouse Lira') {
                    $side_income = 'Spouse LIRA';
                } else if ($side_income == 'Lif') {
                    $side_income = 'LIF';
                } else if ($side_income == 'Spouse Lif') {
                    $side_income = 'Spouse LIF';
                } else if ($side_income == 'Tfsa') {
                    $side_income = 'TFSA';
                } else if ($side_income == 'Spouse Tfsa') {
                    $side_income = 'Spouse TFSA';
                } else if ($side_income == 'Rrif') {
                    $side_income = 'RRIF';
                } else if ($side_income == 'Spouse Rrif') {
                    $side_income = 'Spouse RRIF';
                } else if ($side_income == 'Rrsp') {
                    $side_income = 'RRSP';
                } else if ($side_income == 'Spouse Rrsp') {
                    $side_income = 'Spouse RRSP';
                } else if ($side_income == 'Rrif Withdrawal') {
                    $side_income = 'RRIF Withdrawal';
                } else if ($side_income == 'Spouse Rrif Withdrawal') {
                    $side_income = 'Spouse RRIF Withdrawal';
                } else if ($side_income == 'Rrsp Withdrawal') {
                    $side_income = 'RRSP Withdrawal';
                } else if ($side_income == 'Spouse Rrsp Withdrawal') {
                    $side_income = 'Spouse RRSP Withdrawal';
                } else if ($side_income == 'Lira Withdrawal') {
                    $side_income = 'LIRA Withdrawal';
                } else if ($side_income == 'Spouse Lira Withdrawal') {
                    $side_income = 'Spouse LIRA Withdrawal';
                } else if ($side_income == 'Lif Withdrawal') {
                    $side_income = 'LIF Withdrawal';
                } else if ($side_income == 'Spouse Lif Withdrawal') {
                    $side_income = 'Spouse LIF Withdrawal';
                } else if ($side_income == 'Rrif Withdrawal') {
                    $side_income = 'RRIF Withdrawal';
                } else if ($side_income == 'Tfsa Withdrawal') {
                    $side_income = 'TFSA Withdrawal';
                } else if ($side_income == 'Spouse Tfsa Withdrawal') {
                    $side_income = 'Spouse TFSA Withdrawal';
                } else if ($side_income == 'Annual Retirement Expenses') {
                    $side_income = 'Retirement Expenses';
                } else if ($side_income == 'Spouse Annual Retirement Expenses') {
                    $side_income = 'Spouse Retirement Expenses';
                } else if ($side_income == 'Permanent Life Insurance') {
                    $side_income = 'Life Insurance';
                } else if ($side_income == 'Total Assets') {
                    $side_income = 'Total Net Assets';
                }




                $html1 .= '<tr class="' . $value . '"><td style="min-width: 250px; background: #e7ecf7; text-align: right;">' . $side_income . '</td>';

                $data  = $check_array['report']->data;
                unset($data[0]);
                $data = array_values($data);
                foreach ($data as $d_key => $d_value) {

                    $data_curr_format = money_format("%.0n", $d_value[$j]);

                    $html1 .= '<td style="min-width: 180px; background: #f2f2f2;">' . $data_curr_format . '</td>';
                }
                if ($j == $row_count) {
                    $html1 .= '</tr>';
                    $j = 1;
                } else {
                    $j++;
                }
            }

            $html1 .= '</tr>';

            $html1 .= '<tr>';

            $html1 .= '<td class="ES-row" style="background:#1c2338;color:#fff;min-width: 250px;text-align:right;">Essential Capital </td>';



            // $check_array = self::modify_check_array($check_array);

            foreach ($check_array['essential_capital']->essential as $ess_cap_key => $ess_cap_value) {

                $ess_cap_value = money_format("%.0n", $ess_cap_value);

                $html1 .= '<td class="ES-row" style="background:#1c2338;color:#fff;min-width: 180px;">' . $ess_cap_value . '</td>';
            }

            $html1 .= '</tr>';


            $html1 .= '<tr>';

            $html1 .= '<td class="SP-row" style="background:#ff7f00;color:#fff;min-width: 250px;text-align:right;">Surplus Capital </td>';

            foreach ($check_array['essential_capital']->surplus as $ess_cap_key => $ess_cap_value) {

                $ess_cap_value = money_format("%.0n", $ess_cap_value);

                $html1 .= '<td class="SP-row" style="background:#ff7f00;color:#fff;min-width: 180px;">' . $ess_cap_value . '</td>';
            }

            $html1 .= '</tr>';


            // $html1 .= '<tr>';

            // $html1 .= '<td class="SF-row" style="background:#f00;color:#fff;min-width: 250px;text-align:right;">Shortfall </td>';

            // foreach ($check_array['essential_capital']->shortfall as $ess_cap_key => $ess_cap_value) {

            //     $ess_cap_value = money_format("%.0n", $ess_cap_value);

            //     $html1 .= '<td class="SF-row" style="background:#f00;color:#fff;min-width: 180px;">' . $ess_cap_value . '</td>';
            // }

            // foreach ($check_array['essential_capital']->year as $ess_cap_key => $ess_cap_value) {

            //     $html1 .= '<td class="SF-row" style="background:#f00;color:#fff;min-width: 180px;">$ - </td>';
            // }

            // $html1 .= '</tr>';

            $html1 .= '</table>';
        }
        //print_r($check_array); exit();                          
        if (isset($check_array) && $check_array['status_code'] == 200) {
            $data_array = array(
                'msg' => 'data sent',
                'api' => $check_array,
                'html' => $html,
                'html1' => $html1,
            );
            wp_send_json_success($data_array);
        } else {
            $data_array = array(
                'msg' => 'error while API call',
            );
            wp_send_json_error($data_array);
        }
        wp_die();
    }

    /**
     * WSC step-form modify check array function
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function modify_check_array($arg_array)
    {
        $arg_array['essential_capital']->shortfall = array_fill(0, count($arg_array['essential_capital']->year), 0);

        foreach ($arg_array['essential_capital']->essential as $key => $value) {
            if ($value < 0) {
                $arg_array['essential_capital']->shortfall[$key] = $value;
                $arg_array['essential_capital']->essential[$key] = 0;
            }
        }
        // echo "<pre>";
        // print_r($arg_array);
        // echo "</pre>";
        return $arg_array;
    }
    /**
     * WSC step-form callback function
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function wsc_step_form_callback()
    {

        if (!isset($_POST['calculate_nonce']) || $_POST['calculate_nonce'] != 'yes') {
            // Security check
            wp_send_json_error(
                array(
                    'message' => 'Ooops, something went wrong, please try again later.',
                )
            );
            exit();
        } else {

            self::step_form_data();
        }
    }

    public function custom_class($classes)
    {
        if (is_page('form')) {
            $classes[] = 'step-form-header';
        }
        return $classes;
    }


    /**
     * Add Actions/Hooks
     *
     * @since      1.0.0
     * @package    Wisely_Surplus_Calculator
     * @subpackage Wisely_Surplus_Calculator/public
     * @author     World Web Technology <biz@worldwebtechnology.com>
     */
    public function add_actions()
    {

        //add_action( 'init', [$this, 'testfortestisbest'] );

        //step-form callback
        // add_action('wp_ajax_wsc_step_form_callback', array($this, 'wsc_step_form_callback'));
        // add_action('wp_ajax_nopriv_wsc_step_form_callback', array($this, 'wsc_step_form_callback'));

        add_action('wp_ajax_local_storage_data', array($this, 'local_storage_data'));
        add_action('wp_ajax_nopriv_local_storage_data', array($this, 'local_storage_data'));

        // Wisely Surplus Calculator step-form-page
        add_action('wp_ajax_upload_csv_file', [$this, 'upload_csv_file']);
        add_action('wp_ajax_nopriv_upload_csv_file', [$this, 'upload_csv_file']);

        add_action('wp_ajax_upload_pdf_file', [$this, 'upload_pdf_file']);
        add_action('wp_ajax_nopriv_upload_pdf_file', [$this, 'upload_pdf_file']);

        add_action('wp_ajax_pdf_downloads', [$this, 'pdf_downloads']);
        add_action('wp_ajax_csv_downloads', [$this, 'csv_downloads']);
        //add_action( 'init', array($this, 'pdf_downloads') );
        // add_action( 'init', array($this, 'csv_downloads') );

        add_shortcode("wsc_step_forms", array($this, 'wsc_step_form_shortcode'));

        // Wisely Surplus Calculator Registration, Login and Forgot Password Shortcode
        add_shortcode("wsc_registration_shortcode", array($this, 'wsc_registration_shortcode_callback_function'));

        add_action('wp_enqueue_scripts', array($this, 'wsc_public_scripts'));

        //WSC register user ajax
        add_action('wp_ajax_nopriv_wsc_register_user', array($this, 'wsc_register_user_callback_new'));
        add_filter('woocommerce_cart_needs_payment', array($this, 'wc_zero_product_filter'), 10, 2);
        //WSC register user ajax

        add_action('wp_ajax_nopriv_wsc_login_user', array($this, 'wsc_login_user_callback'));

        add_action('wp_ajax_nopriv_wsc_forgot_user', array($this, 'wsc_forgot_user_callback'));

        add_action('wp_ajax_nopriv_wsc_reset_password_user', array($this, 'wsc_reset_password_user_callback'));


        //WSC list state ajax
        add_action('wp_ajax_wsc_list_states', array($this, 'wsc_list_states_callback'));
        add_action('wp_ajax_nopriv_wsc_list_states', array($this, 'wsc_list_states_callback'));

        add_filter('wsc_recaptcha_check_answer', array($this, 'wsc_recaptcha_check_answer_fun'), 10, 2);
        add_filter('wsc_country_list', array($this, 'wsc_country_list_fun'), 10, 1);
        add_filter('wsc_country_by_states_list', array($this, 'wsc_country_by_states_list_fun'), 10, 2);

        add_action('wp_footer', array($this, 'wwt_add_body_class'));

        add_action('body_class', array($this, 'custom_class'));
    }

    public function wwt_add_body_class()
    {
        $current_url = $_SERVER['REQUEST_URI'];

        if (strpos($current_url, 'form') !== false) {
?>
            <script type="text/javascript">
                // jQuery(document).ready( function(){
                // 	jQuery('body').addClass('step-form-header');
                // });
            </script>
<?php
        }

        ob_start();
        do_shortcode('[wsc_registration_shortcode]');
        //do_shortcode('[woocommerce_checkout]');
        $popup_content = ob_get_contents();
        ob_end_clean();

        echo '<div id="wsc_login_register_model" class="modal">
		<div class="modal-content">
		<span class="close">&times;</span>
		' . $popup_content . '
		</div>
		</div>';
    }
} // End Of Class
