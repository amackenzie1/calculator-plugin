<?php if ( ! defined( 'ABSPATH' ) ) { die; } // If this file is called directly, abort.

/**
 * The public-Shortcode-specific functionality of the plugin.
 *
 * @link       https://www.worldwebtechnology.com/
 * @since      1.0.0
 *
 * @package    Wisely_Surplus_Calculator
 * @subpackage Wisely_Surplus_Calculator/public
 * @author     World Web Technology <biz@worldwebtechnology.com>
 */
class Wisely_Surplus_Calculator_Public_Shortcode {


	/**
	 * Initialize the class and set its properties.
	 *
	 * @since      1.0.0
	 * @package    Wisely_Surplus_Calculator
	 * @subpackage Wisely_Surplus_Calculator/public
	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 */
	public function __construct() {
		
	}


	/**
	 * Callback function for wcp_edit_profile Shortcode
	 *
	 * @since      1.0.0
	 * @package    Wisely_Surplus_Calculator
	 * @subpackage Wisely_Surplus_Calculator/public
	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 *
	 */
	public function wisely_surplus_calculator_user_profile_cb( $atts ){
		
		ob_start();
		
		require_once ( WISELY_SURPLUS_CALCULATOR_PUBLIC_DIR . '/partials/shortcode/wisely_surplus_calculator_user_profile_html.php' );
	
		return ob_get_clean();
	}


	/**
	 * Callback function for Save Edit Profile data
	 *
	 * @since      1.0.0
	 * @package    Wisely_Surplus_Calculator
	 * @subpackage Wisely_Surplus_Calculator/public
	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 *
	 */	   
	public function wisely_surplus_calculator_process_edit_profile_cb(){

	  	$user_firstname = isset($_POST['wsc_firstname']) ? sanitize_text_field( $_POST['wsc_firstname'] ) : '';
	   	$user_lastname  = isset($_POST['wsc_lastname'])  ? sanitize_text_field( $_POST['wsc_lastname'])   : '';
	   	$user_address1  = isset($_POST['wsc_address1'])  ? sanitize_text_field( $_POST['wsc_address1'])   : '';
	   	$user_address2  = isset($_POST['wsc_address2'])  ? sanitize_text_field( $_POST['wsc_address2'])   : '';
	   	$user_city      = isset($_POST['wsc_city'])      ? sanitize_text_field( $_POST['wsc_city'])       : '';
	   	$user_province  = isset($_POST['wsc_province'])  ? sanitize_text_field( $_POST['wsc_province'])   : '';
	   	$user_country   = isset($_POST['wsc_country'])   ? sanitize_text_field( $_POST['wsc_country'])    : '';
	   	$user_postal_code  = isset($_POST['wsc_postal_code'])  ? sanitize_text_field( $_POST['wsc_postal_code']) : '';


		$user = wp_get_current_user();
		$user_id = ( isset( $user->ID ) ? (int) $user->ID : 0 );

		$update_info = array(
							'ID'         => $user_id,
							'first_name' => $user_firstname,
							'last_name'	 => $user_lastname,
						);

		$user_data = wp_update_user( $update_info );


		if ( is_wp_error( $user_data ) ) {
		
			$response = array('message' => __('<strong>Error!</strong>! Something wrong occured...','wisely-surplus-calculator') );
            wp_send_json_error($response);

		} else {
			
			update_user_meta($user_id, 'billing_address_1', $user_address1);
			update_user_meta($user_id, 'billing_address_2', $user_address2);
			update_user_meta($user_id, 'billing_city', $user_city);
			update_user_meta($user_id, 'billing_state', $user_province);
			update_user_meta($user_id, 'billing_country', $user_country);
			update_user_meta($user_id, 'billing_postcode', $user_postal_code);
			
			$response = array(
					'message' => __('<strong>Success!</strong>, Profile Succesfully Saved','wisely-surplus-calculator')
				); 
	        wp_send_json_success( $response );

		}
	    // die ajax call
	   	wp_die();
	}


	/**
	 * Add Actions/Hooks
	 *
	 * @since      1.0.0
	 * @package    Wisely_Surplus_Calculator
	 * @subpackage Wisely_Surplus_Calculator/public
	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 */
	public function add_actions() {

		
		// Shortcode for User Profile on the Page.
		add_shortcode('wcp_user_profile', [$this, 'wisely_surplus_calculator_user_profile_cb'] );

		//Ajax callback for edit User Profile 
	   	add_action('wp_ajax_save_user_profile',        [$this, 'wisely_surplus_calculator_process_edit_profile_cb'] );
		add_action('wp_ajax_nopriv_save_user_profile', [$this, 'wisely_surplus_calculator_process_edit_profile_cb'] );

	}

} // End Of Class