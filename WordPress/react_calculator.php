<?php
/**
 * Plugin Name: React Calculator
 * Description: A frontend for the surplus calculator in React + Vite.
 * Version: 1.0
 * Author: Andrew Mackenzie
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Enqueue the bundled React app
function react_calculator_enqueue_scripts() {
    // React and ReactDOM from a CDN
    wp_enqueue_script(
        'react',
        'https://unpkg.com/react@18/umd/react.production.min.js',
        array(),
        '18.0.0',
        true
    );

    wp_enqueue_script(
        'react-dom',
        'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
        array( 'react' ),
        '18.0.0',
        true
    );

    // Your bundled React app
    wp_enqueue_script(
        'my-react-app',
        plugins_url( 'js/app.bundle.js', __FILE__ ),
        array( 'react', 'react-dom' ),
        '1.0',
        true
    );

    wp_enqueue_style(
    'my-react-app-styles',
    plugins_url( 'js/assets/index-Cd6UTSEb.css', __FILE__ ), // Update path if necessary
    array(),
    '1.0'
);

    // Pass WordPress data to the React app
    wp_localize_script( 'my-react-app', 'myReactPluginData', array(
        'rootElementId' => 'react-root',
    ) );
}
add_action( 'wp_enqueue_scripts', 'react_calculator_enqueue_scripts' );

// Add a shortcode to render the React root div
function react_calculator_shortcode() {
    return '<div id="react-root"></div>';
}
add_shortcode( 'react_calculator', 'react_calculator_shortcode' );

