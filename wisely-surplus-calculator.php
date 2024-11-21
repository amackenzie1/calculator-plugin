<?php
/**
 * Plugin Name: My Minimal Plugin
 * Description: A minimal WordPress plugin to add basic functionality.
 * Version: 1.0
 * Author: Your Name
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Example: Add a shortcode that outputs "Hello, World!"
function my_minimal_plugin_shortcode() {
    return '<div>Hello, World! This is my minimal plugin.</div>';
}
add_shortcode( 'my-minimal-plugin', 'my_minimal_plugin_shortcode' );

// Example: Add a custom admin notice.
function my_minimal_plugin_admin_notice() {
    ?>
    <div class="notice notice-success is-dismissible">
        <p><?php _e( 'My Minimal Plugin is activated and working!', 'my-minimal-plugin' ); ?></p>
    </div>
    <?php
}
add_action( 'admin_notices', 'my_minimal_plugin_admin_notice' );

