<?php
/**
 * Plugin Name: WordPress Custom Pinterest Share Plugin
 * Description: Allows site administrators to selectively pin images from the frontend to Pinterest using a custom modal window.
 * Version: 1.0.0
 * Author: Antigravity
 * Text Domain: wp-custom-pinterest-share
 * License: GPL2
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Enqueue public assets.
 */
function wpcps_enqueue_public_assets() {
	// Restrict loading to single posts/pages as per PRD
	if ( is_singular() ) {
		wp_enqueue_style(
			'wpcps-public-css',
			plugin_dir_url( __FILE__ ) . 'assets/css/public.css',
			array(),
			time() // Cache busting during development/testing
		);

		wp_enqueue_script(
			'wpcps-public-js',
			plugin_dir_url( __FILE__ ) . 'assets/js/public.js',
			array(),
			time(), // Cache busting during development/testing
			true // Load in footer
		);
	}
}
add_action( 'wp_enqueue_scripts', 'wpcps_enqueue_public_assets' );
