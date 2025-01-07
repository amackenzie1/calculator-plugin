<?php if ( ! defined( 'ABSPATH' ) ) { die; } // If this file is called directly, abort.

/**
 * The core plugin class.The file that defines the core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * Also maintains the unique identifier of this plugin as well as the current
 * version of the plugin.
 *
 * A class definition that includes attributes and functions used across both the
 * public-facing side of the site and the admin area.
 * 
 * @link       https://www.worldwebtechnology.com/
 * @since      1.0.0
 * 
 * @package    Wisely_Surplus_Calculator
 * @subpackage Wisely_Surplus_Calculator/includes
 * @author     World Web Technology <biz@worldwebtechnology.com>
 */

class Wisely_Surplus_Calculator_Scripts {

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @package    Wisely_Surplus_Calculator
 	 * @subpackage Wisely_Surplus_Calculator/includes
 	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 */
	public function __construct() {

	}


	/**
	 * Add Actions/Hooks
	 *
	 * @since     1.0.0
	 * @package    Wisely_Surplus_Calculator
 	 * @subpackage Wisely_Surplus_Calculator/includes
 	 * @author     World Web Technology <biz@worldwebtechnology.com>
	 */
	public function add_actions() {

		if( isset($_REQUEST['testfortest']) ) {
			add_action( 'init', [$this, 'testfortest'] );
		}
	}

	function testfortest() {

		$arr = array(
					 __CLASS__, 
					 'this_is_a_function_name()' 
				);

		echo '<pre>'; print_r($arr); echo '</pre>'; exit();
	}
	

} // End Of Class