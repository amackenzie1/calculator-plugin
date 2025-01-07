<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://www.worldwebtechnology.com/
 * @since             1.0.0
 * @package           Wisely_Surplus_Calculator
 *
 * @wordpress-plugin
 * Plugin Name:       Wisely Surplus Calculator
 * Plugin URI:        https://www.worldwebtechnology.com/
 * Description:       A <strong>Retirement Calculator</strong> made to: Clarify your <strong>Future</strong>. Unlock your <strong>Potential</strong>. Maximize your <strong>Opportunities</strong>. Elevate your <strong>Happiness</strong>.
 * Version:           1.0.0
 * Author:            World Web Technology
 * Author URI:        https://www.worldwebtechnology.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wisely-surplus-calculator
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) || ! defined( 'ABSPATH' ) ) {
    die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
if( !defined( 'WISELY_SURPLUS_CALCULATOR_VERSION' ) ) {
    define( 'WISELY_SURPLUS_CALCULATOR_VERSION', '1.0.0' );
}

/**
 * Currently plugin URL.
 */
if( !defined( 'WISELY_SURPLUS_CALCULATOR_URL' ) ) {
    define( 'WISELY_SURPLUS_CALCULATOR_URL', plugin_dir_url( __FILE__ ) );
}

/**
 * Currently plugin directory.
 */
if( !defined( 'WISELY_SURPLUS_CALCULATOR_DIR' ) ) {
    define( 'WISELY_SURPLUS_CALCULATOR_DIR', dirname( __FILE__ ) );
}

/**
 * Currently plugin admin directory.
 */
if( !defined( 'WISELY_SURPLUS_CALCULATOR_ADMIN_DIR' ) ) {
    define( 'WISELY_SURPLUS_CALCULATOR_ADMIN_DIR', WISELY_SURPLUS_CALCULATOR_DIR . '/admin' );
}

/**
 * Currently plugin public directory.
 */
if( !defined( 'WISELY_SURPLUS_CALCULATOR_PUBLIC_DIR' ) ) {
    define( 'WISELY_SURPLUS_CALCULATOR_PUBLIC_DIR', WISELY_SURPLUS_CALCULATOR_DIR . '/public' );
}

/**
 * Currently plugin meta prefix.
 */
if( !defined( 'WISELY_SURPLUS_CALCULATOR_META_PREFIX' )) {
    define( 'WISELY_SURPLUS_CALCULATOR_META_PREFIX', '_qwpp_' );
}

/**
 * Currently plugin basename.
 */
if( !defined( 'WISELY_SURPLUS_CALCULATOR_PLUGIN_BASENAME' ) ) {
    define( 'WISELY_SURPLUS_CALCULATOR_PLUGIN_BASENAME', basename( WISELY_SURPLUS_CALCULATOR_DIR ) );
}


/**
 * Load Text Domain
 * 
 * This gets the plugin ready for translation.
 * 
 * @since      1.0.0
 * @package    Wisely_Surplus_Calculator
 * @author     World Web Technology <biz@worldwebtechnology.com>
 * 
 */
function wisely_surplus_calculator_load_textdomain() {
    
    // Set filter for plugin's languages directory
    $wsc_lang_dir   = dirname( plugin_basename( __FILE__ ) ) . '/languages/';
    $wsc_lang_dir   = apply_filters( 'wsc_languages_directory', $wsc_lang_dir );
    
    // Traditional WordPress plugin locale filter
    $locale = apply_filters( 'plugin_locale',  get_locale(), 'wisely-surplus-calculator' );
    $mofile = sprintf( '%1$s-%2$s.mo', 'wisely-surplus-calculator', $locale );
    
    // Setup paths to current locale file
    $mofile_local   = $wsc_lang_dir . $mofile;
    $mofile_global  = WP_LANG_DIR . '/' . WISELY_SURPLUS_CALCULATOR_PLUGIN_BASENAME . '/' . $mofile;
    
    if ( file_exists( $mofile_global ) ) { // Look in global /wp-content/languages/wisely-surplus-calculator folder
        load_textdomain( 'wisely-surplus-calculator', $mofile_global );
    } elseif ( file_exists( $mofile_local ) ) { // Look in local /wp-content/plugins/wisely-surplus-calculator/languages/ folder
        load_textdomain( 'wisely-surplus-calculator', $mofile_local );
    } else { // Load the default language files
        load_plugin_textdomain( 'wisely-surplus-calculator', false, $wsc_lang_dir );
    }
}


/**
 * Register Activation Hook
 * 
 * @since      1.0.0
 * @package    Wisely_Surplus_Calculator
 * @author     World Web Technology <biz@worldwebtechnology.com>
 * 
 * The code that runs during plugin activation.
 * This action is documented in includes/class-quiz-wp-plugin-activator.php
 */
function activate_wisely_surplus_calculator() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wisely-surplus-calculator-activator.php';
	Wisely_Surplus_Calculator_Activator::activate();
}
register_activation_hook( __FILE__, 'activate_wisely_surplus_calculator' );


/**
 * Register Deactivation Hook
 * 
 * @since      1.0.0
 * @package    Wisely_Surplus_Calculator
 * @author     World Web Technology <biz@worldwebtechnology.com>
 * 
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-quiz-wp-plugin-deactivator.php
 */
function deactivate_wisely_surplus_calculator() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wisely-surplus-calculator-deactivator.php';
	Wisely_Surplus_Calculator_Deactivator::deactivate();
}
register_deactivation_hook( __FILE__, 'deactivate_wisely_surplus_calculator' );


/**
 * Load Plugin
 * 
 * Handles to load plugin after
 * dependent plugin is loaded
 * successfully
 * 
 * @since      1.0.0
 * @package    Wisely_Surplus_Calculator
 * @author     World Web Technology <biz@worldwebtechnology.com>
 * 
 */
function wisely_surplus_calculator_plugin_loaded() {
 
    // load first plugin text domain
    wisely_surplus_calculator_load_textdomain();
 
}
//add action to load plugin
add_action( 'plugins_loaded', 'wisely_surplus_calculator_plugin_loaded' );


/**
 * Global Variable Declaration
 * 
 * @since      1.0.0
 * @package    Flockyou_Personalize_Product_Pictures
 * @author     World Web Technology <biz@worldwebtechnology.com>
 */
global $WSC_Model, $WSC_Script, $WSC_Public, $WSC_Admin, $WSC_Public_Shortcode;

// Include Function & Model class file
require_once ( WISELY_SURPLUS_CALCULATOR_DIR . '/includes/class-wisely-surplus-calculator-model.php' );
$WSC_Model = new Wisely_Surplus_Calculator_Model();

// Include script/JS/CSS/ class file
require_once ( WISELY_SURPLUS_CALCULATOR_DIR . '/includes/class-wisely-surplus-calculator-script.php' );
$WSC_Script = new Wisely_Surplus_Calculator_Scripts();
$WSC_Script->add_actions();

// Include public class file
require_once ( WISELY_SURPLUS_CALCULATOR_PUBLIC_DIR . '/class-wisely-surplus-calculator-public.php' );
$WSC_Public = new Wisely_Surplus_Calculator_Public();
$WSC_Public->add_actions();

// Include public shortcode class file
require_once ( WISELY_SURPLUS_CALCULATOR_PUBLIC_DIR . '/class-wisely-surplus-calculator-public-shortcode.php' );
$WSC_Public_Shortcode = new Wisely_Surplus_Calculator_Public_Shortcode();
$WSC_Public_Shortcode->add_actions();

// Include admin class file
require_once ( WISELY_SURPLUS_CALCULATOR_ADMIN_DIR . '/class-wisely-surplus-calculator-admin.php' );
$WSC_Admin = new Wisely_Surplus_Calculator_Admin();
$WSC_Admin->add_actions();

// Include PDF library
require_once ( WISELY_SURPLUS_CALCULATOR_DIR . '/public/dompdf/autoload.inc.php' );
// require_once ( WISELY_SURPLUS_CALCULATOR_DIR . '/fpdf/fpdf.php' );

add_filter( 'plugin_action_links_' . plugin_basename(__FILE__), 'wsc_add_action_links' );
function wsc_add_action_links( $actions ) {
    
    $link = 'Hello world';

    $custom_actions[] = '<a href="'. $link .'">' . __('Settings','wisely-surplus-calculator') . '</a>';
    $custom_actions[] = '<a href="https://www.worldwebtechnology.com/our-portfolio/" target="_blank">'. __('More by World Web Technology','wisely-surplus-calculator') . '</a>';
    
    return array_merge( $custom_actions, $actions );
}