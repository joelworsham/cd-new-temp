<?php
/**
 * Adds plugin setting page(s) and sets up the settings.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core/settings
 */

defined( 'ABSPATH' ) || die;

/**
 * Class ClientDash_Settings
 *
 * Adds plugin setting page(s) and sets up the settings.
 *
 * @since {{VERSION}}
 */
class ClientDash_Settings {

	/**
	 * The current settings tab, if any.
	 *
	 * @since {{VERSION}}
	 *
	 * @var null|string
	 */
	public $current_tab = null;

	/**
	 * ClientDash_Settings constructor.
	 *
	 * @since {{VERSION}}
	 */
	function __construct() {

		add_action( 'admin_init', array( $this, 'register_settings' ) );
		add_action( 'admin_init', array( $this, 'get_current_tab' ) );

		add_action( 'admin_menu', array( $this, 'add_submenu_page' ) );
	}

	/**
	 * Registers all of the Client Dash settings.
	 *
	 * @since 1.2.0
	 * @access private
	 */
	function register_settings() {

		// Widgets Tab
		register_setting( 'cd_options_widgets', 'cd_remove_which_widgets' );

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

		// Widgets Tab
		register_setting( 'cd_options_widgets', 'cd_widgets' );

		do_action( 'cd_register_settings' );
	}

	/**
	 * Gets the current settings tab, if any.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function get_current_tab() {

		if ( isset( $_REQUEST['tab'] ) && isset( $_REQUEST['page'] ) && $_REQUEST['page'] == 'cd_settings' ) {

			$this->current_tab = $_REQUEST['tab'];
		}
	}

	/**
	 * Adds the sub-menu item to the toolbar.
	 *
	 * @since 1.5.0
	 * @access private
	 */
	function add_submenu_page() {

		global $submenu;

		add_menu_page(
			__( 'Client Dash', 'clientdash' ),
			__( 'Client Dash', 'clientdash' ),
			'manage_options',
			'clientdash',
			array( $this, 'settings_page' ),
			'dashicons-admin-generic',
			100
		);

		add_submenu_page(
			'clientdash',
			__( 'Settings', 'clientdash' ),
			__( 'Settings', 'clientdash' ),
			'manage_options',
			'cd_settings',
			array( $this, 'settings_page' )
		);

		$submenu['clientdash'][10] = array(
			__( 'Customize Admin', 'clientdash' ),
			'manage_options', // TODO create custom cap
			'/?clientdash_customize=1'
		);
	}

	/**
	 * Load a settings tab.
	 *
	 * @since {{VERSION}}
	 * @access private
	 *
	 * @param string|null $tab The tab to load. Leave blank to load current tab automatically.
	 *
	 * @return string|false The template file loaded, if exists, or false otherwise.
	 */
	function load_settings_tab( $tab = null ) {

		if ( $tab === null ) {

			$tab = $this->current_tab;
		}

		/**
		 * The current settings tab template file.
		 *
		 * @since {{VERSION}}
		 */
		$template = apply_filters( 'cd_settings_tab_template', CLIENTDASH_DIR . "core/settings/views/settings-{$tab}.php" );

		if ( file_exists( $template ) ) {

			include $template;

			return $template;

		} else {

			return false;
		}
	}

	/**
	 * Loads the settings tab menu.
	 *
	 * @since {{VERSION}}
	 * @access private
	 *
	 * @param string|null $active_tab The tab to load. Leave blank to use current tab automatically.
	 */
	function load_settings_tab_menu( $active_tab = null ) {

		if ( $active_tab === null ) {

			$active_tab = $this->current_tab;
		}

		// TODO Show last tabs once

		/**
		 * The settings page tabs.
		 *
		 * @since {{VERSION}}
		 */
		$tabs = apply_filters( 'cd_settings_tabs', array(
			array(
				'text'   => __( 'Tools', 'clientdash' ),
				'link'   => admin_url( 'admin.php?page=cd_settings&tab=tools' ),
				'active' => ! $active_tab || $active_tab == 'tools',
			),
			array(
				'text'   => __( 'Addons', 'clientdash' ),
				'link'   => admin_url( 'admin.php?page=cd_settings&tab=addons' ),
				'active' => $active_tab == 'addons',
			),
		) );

		include_once CLIENTDASH_DIR . 'core/settings/views/settings-tab-menu.php';
	}

	/**
	 * Load page output.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function settings_page() {

		include_once CLIENTDASH_DIR . 'core/settings/views/settings-page.php';
	}
}