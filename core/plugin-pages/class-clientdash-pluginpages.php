<?php
/**
 * Adds plugin page(s) to the wp admin.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core/settings
 */

defined( 'ABSPATH' ) || die;

/**
 * Class ClientDash_PluginPages
 *
 * Adds plugin page(s) to the wp admin
 *
 * @since {{VERSION}}
 */
class ClientDash_PluginPages {

	/**
	 * The current page tab, if any.
	 *
	 * @since {{VERSION}}
	 *
	 * @var null|string
	 */
	public $current_tab = null;

	/**
	 * ClientDash_PluginPages constructor.
	 *
	 * @since {{VERSION}}
	 */
	function __construct() {

		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_init', array( $this, 'get_current_tab' ) );

		add_action( 'admin_menu', array( $this, 'add_pages' ) );
	}

	/**
	 * Registers all of the Client Dash settings.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function register_settings() {

		// Icons Tab
		register_setting( 'cd_options_icons', 'cd_dashicon_account' );
		register_setting( 'cd_options_icons', 'cd_dashicon_reports' );
		register_setting( 'cd_options_icons', 'cd_dashicon_help' );
		register_setting( 'cd_options_icons', 'cd_dashicon_webmaster' );

		// Webmaster Tab
		register_setting( 'cd_options_webmaster', 'cd_webmaster_name', 'sanitize_text_field' );
		register_setting( 'cd_options_webmaster', 'cd_webmaster_enable' );
		register_setting( 'cd_options_webmaster', 'cd_webmaster_main_tab_name' );
		register_setting( 'cd_options_webmaster', 'cd_webmaster_main_tab_content' );
		register_setting( 'cd_options_webmaster', 'cd_webmaster_feed' );
		register_setting( 'cd_options_webmaster', 'cd_webmaster_feed_url', 'esc_url' );
		register_setting( 'cd_options_webmaster', 'cd_webmaster_feed_count' );

		// Display Tab
		register_setting( 'cd_options_display', 'cd_content_sections_roles' );
		register_setting( 'cd_options_display', 'cd_display_settings_updated' );
	}

	/**
	 * Gets the current page tab, if any.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function get_current_tab() {

		if ( isset( $_REQUEST['tab'] ) &&
		     isset( $_REQUEST['page'] ) &&
		     substr( $_REQUEST['page'], 0, 10 ) == 'clientdash'
		) {

			$this->current_tab = $_REQUEST['tab'];
		}
	}

	/**
	 * Adds the sub-menu item to the toolbar.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function add_pages() {

		global $submenu;

		add_menu_page(
			__( 'Client Dash', 'clientdash' ),
			__( 'Client Dash', 'clientdash' ),
			'manage_options',
			'clientdash',
			array( $this, 'load_page' ),
			'dashicons-admin-generic',
			100
		);

		add_submenu_page(
			'clientdash',
			__( 'Addons', 'clientdash' ),
			__( 'Addons', 'clientdash' ),
			'manage_options',
			'clientdash_addons',
			array( $this, 'load_page' )
		);

		add_submenu_page(
			'clientdash',
			__( 'Settings', 'clientdash' ),
			__( 'Settings', 'clientdash' ),
			'manage_options',
			'clientdash_settings',
			array( $this, 'load_page' )
		);

		$submenu['clientdash'][0] = array(
			__( 'Customize Admin', 'clientdash' ),
			'manage_options', // TODO create custom cap
			'/?clientdash_customize=1'
		);
	}

	/**
	 * Load page output.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function load_page() {

		global $plugin_page;

		$current_page = substr( $plugin_page, 11 );

		if ( ! $current_page ) {

			$current_page = 'main';
		}

		$current_file = CLIENTDASH_DIR . "core/plugin-pages/views/$current_page.php";

		if ( file_exists( $current_file ) ) {

			include_once $current_file;
		}
	}
}