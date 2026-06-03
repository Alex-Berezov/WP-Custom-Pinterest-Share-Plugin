<?php
/**
 * Plugin Name: WordPress Custom Pinterest Share Plugin
 * Description: Allows site administrators to selectively pin images from the frontend to Pinterest using a custom modal window.
 * Version: 1.0.2
 * Author: Alex Berezov
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
			'1.0.2' // Stable release version
		);

		wp_enqueue_script(
			'wpcps-public-js',
			plugin_dir_url( __FILE__ ) . 'assets/js/public.js',
			array(),
			'1.0.2', // Stable release version
			false // Load in header
		);
	}
}
add_action( 'wp_enqueue_scripts', 'wpcps_enqueue_public_assets' );

/**
 * Add data-noptimize attribute to the script tag to bypass Autoptimize and other compressors.
 */
function wpcps_add_noptimize_attribute( $tag, $handle, $src ) {
	if ( 'wpcps-public-js' === $handle ) {
		if ( false === strpos( $tag, 'data-noptimize' ) ) {
			$tag = str_replace( '<script ', '<script data-noptimize="1" ', $tag );
		}
	}
	return $tag;
}
add_filter( 'script_loader_tag', 'wpcps_add_noptimize_attribute', 10, 3 );
