<?php if ( ! defined( 'ABSPATH' ) ) { die; } // If this file is called directly, abort.

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://www.worldwebtechnology.com/
 * @since      1.0.0
 *
 * @package    Wisely_Surplus_Calculator
 * @subpackage Wisely_Surplus_Calculator/admin
 * @author     World Web Technology <biz@worldwebtechnology.com>
 */
class Wisely_Surplus_Calculator_Admin {

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    	1.0.0
	 * @package    	Wisely_Surplus_Calculator
	 * @subpackage 	Wisely_Surplus_Calculator/admin
	 * @author     	World Web Technology <biz@worldwebtechnology.com>
	 */
	public function __construct() {

	}

	/**
	 * Display extra user profile fields.
	 *
	 * @since      1.0.0
	 * @package    Wisely_Surplus_Calculator
	 * @subpackage Wisely_Surplus_Calculator/public
	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 */
	public function wsc_extra_user_profile_fields( $user ) { ?>
	    <h3><?php _e("Extra profile information", "blank"); ?></h3>

	    <table class="form-table">
	        <tr>
	            <th><label for="address1"><?php _e("Address 1"); ?></label></th>
	            <td>
	                <input type="text" name="address1" id="address1" value="<?php echo esc_attr( get_user_meta($user->ID, 'wsc_address1', true ) ); ?>" class="regular-text" /><br />
	                <span class="description"><?php _e("Please enter your address."); ?></span>
	            </td>
	        </tr>
	        <tr>
	            <th><label for="address"><?php _e("Address 2"); ?></label></th>
	            <td>
	                <input type="text" name="address2" id="address2" value="<?php echo esc_attr( get_user_meta($user->ID, 'wsc_address2', true  ) ); ?>" class="regular-text" /><br />
	                <span class="description"><?php _e("Please enter your address."); ?></span>
	            </td>
	        </tr>
	        <tr>
	            <th><label for="city"><?php _e("City"); ?></label></th>
	            <td>
	                <input type="text" name="city" id="city" value="<?php echo esc_attr( get_user_meta( $user->ID, 'wsc_city', true  ) ); ?>" class="regular-text" /><br />
	                <span class="description"><?php _e("Please enter your city."); ?></span>
	            </td>
	        </tr>
	        <tr>
	            <th><label for="city"><?php _e("Province"); ?></label></th>
	            <td>
	                <input type="text" name="province" id="province" value="<?php echo esc_attr( get_user_meta( $user->ID, 'wsc_province', true  ) ); ?>" class="regular-text" /><br />
	                <span class="description"><?php _e("Please enter your province."); ?></span>
	            </td>
	        </tr>
	        <tr>
	            <th><label for="city"><?php _e("Country"); ?></label></th>
	            <td>
	                <input type="text" name="country" id="country" value="<?php echo esc_attr( get_user_meta( $user->ID, 'wsc_country', true  ) ); ?>" class="regular-text" /><br />
	                <span class="description"><?php _e("Please enter your country."); ?></span>
	            </td>
	        </tr>
	        <tr>
	            <th><label for="postalcode"><?php _e("Postal Code"); ?></label></th>
	            <td>
	                <input type="text" name="postalcode" id="postalcode" value="<?php echo esc_attr( get_user_meta( $user->ID, 'wsc_postal_code', true  ) ); ?>" class="regular-text" /><br />
	                <span class="description"><?php _e("Please enter your postal code."); ?></span>
	            </td>
	        </tr>
	    </table>
	<?php }
	
	/**
	 * Save extra user profile fields.
	 * 
	 * @since      1.0.0
	 * @package    Wisely_Surplus_Calculator
	 * @subpackage Wisely_Surplus_Calculator/public
	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 */
	public function wsc_save_extra_user_profile_fields( $user_id ) {
	    if ( empty( $_POST['_wpnonce'] ) || ! wp_verify_nonce( $_POST['_wpnonce'], 'update-user_' . $user_id ) ) {
	        return;
	    }
	    
	    if ( !current_user_can( 'edit_user', $user_id ) ) { 
	        return false; 
	    }
	    update_user_meta( $user_id, 'wsc_address1', $_POST['address1'] );
	    update_user_meta( $user_id, 'wsc_address2', $_POST['address2'] );
	    update_user_meta( $user_id, 'wsc_city', $_POST['city'] );
	    update_user_meta( $user_id, 'wsc_province', $_POST['province'] );
	    update_user_meta( $user_id, 'wsc_country', $_POST['country'] );
	    update_user_meta( $user_id, 'wsc_postal_code', $_POST['postalcode'] );
	}

	/**
	 * Add Actions/Hooks
	 *
	 * @since      1.0.0
	 * @package    Wisely_Surplus_Calculator
	 * @subpackage Wisely_Surplus_Calculator/admin
	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 */
	public function add_actions() {
		//Display extra user profile fields 
		// all extra user profile fields remove for no need extra info // comment by rahul
		//add_action( 'show_user_profile', array($this, 'wsc_extra_user_profile_fields') );
		//add_action( 'edit_user_profile', array($this, 'wsc_extra_user_profile_fields') );

		//Save extra user profile fields
		//add_action( 'personal_options_update', array($this, 'wsc_save_extra_user_profile_fields') );
		//add_action( 'edit_user_profile_update', array($this, 'wsc_save_extra_user_profile_fields') );
	}
	
} // End Of Class
