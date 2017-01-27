<?php
/**
 * Installs the plugin.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core
 */

defined( 'ABSPATH' ) || die;

/**
 * Class ClientDash_Install
 *
 * Installs the plugin.
 *
 * @since {{VERSION}}
 */
class ClientDash_Install {

	/**
	 * Loads the install functions.
	 *
	 * @since {{VERSION}}
	 */
	static function install() {

		add_option( 'clientdash_db_version', '1.0.0' );

//		self::setup_tables();
	}

	/**
	 * Sets up the tables.
	 *
	 * @since {{VERSION}}
	 * @access private
	 *
	 * @global wpdb $wpdb
	 */
	private static function setup_tables() {

		global $wpdb;

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE {$wpdb->prefix}plugin_states (
		  id mediumint(9) NOT NULL AUTO_INCREMENT,
		  name text NOT NULL,
		  active longtext NOT NULL,
		  PRIMARY KEY  (id)
		) $charset_collate;";

		require_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );
	}
}