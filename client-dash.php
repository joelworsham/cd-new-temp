<?php
/**
 * Plugin Name: Client Dash
 * Description: Creating a more intuitive admin interface for clients.
 * Version: 1.7.0
 * Author: Real Big Plugins
 * Author URI: https://realbigplugins.com
 *
 * @package ClientDash
 */






// TODO Auto expand newly added, editable items (menu, submenu, AND dashboard)

// -> Change JS customizations to be arrays instead of object with ID's as keys... better order predicibility. Just
//    create a function to quickly get an array item by nested ID.


// TODO Make sure that custom links are maintaining original, unique ID's, even after re-indexing!
// TODO Allow custom links to be added to submenus of custom links.






defined( 'ABSPATH' ) || die;

if ( ! class_exists( 'ClientDash' ) ) {

	define( 'CLIENTDASH_VERSION', '1.0.0' );
	define( 'CLIENTDASH_DIR', plugin_dir_path( __FILE__ ) );
	define( 'CLIENTDASH_URI', plugins_url( '', __FILE__ ) );

	/**
	 * Class ClientDash
	 *
	 * The main plugin class.
	 *
	 * @since {{VERSION}}
	 */
	final class ClientDash {

		/**
		 * Database functions.
		 *
		 * @since {{VERSION}}
		 *
		 * @var ClientDash_DB
		 */
		public $db;

		/**
		 * api functions.
		 *
		 * @since {{VERSION}}
		 *
		 * @var ClientDash_API
		 */
		public $api;

		/**
		 * Handles the plugin pages.
		 *
		 * @since {{VERSION}}
		 *
		 * @var ClientDash_PluginPages
		 */
		public $pluginpages;

		/**
		 * Loads the Client Dash Customizer.
		 *
		 * @since {{VERSION}}
		 *
		 * @var ClientDash_Customize
		 */
		public $customize;

		/**
		 * Modifies the admin from customizations.
		 *
		 * @since {{VERSION}}
		 *
		 * @var ClientDash_Modify
		 */
		public $modify;

		protected function __wakeup() {
		}

		protected function __clone() {
		}

		/**
		 * Call this method to get singleton
		 *
		 * @since {{VERSION}}
		 *
		 * @return ClientDash()
		 */
		public static function instance() {

			static $instance = null;

			if ( $instance === null ) {

				$instance = new ClientDash();
			}

			return $instance;
		}

		/**
		 * ClientDash constructor.
		 *
		 * @since {{VERSION}}
		 */
		function __construct() {

			$this->require_necessities();

			add_action( 'init', array( $this, 'register_assets' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_assets' ) );
		}

		/**
		 * Requires and loads required files.
		 *
		 * @since {{VERSION}}
		 * @access private
		 */
		private function require_necessities() {

			require_once CLIENTDASH_DIR . 'core/clientdash-functions.php';
			require_once CLIENTDASH_DIR . 'core/class-clientdash-db.php';
			require_once CLIENTDASH_DIR . 'core/api/class-clientdash-api.php';
			require_once CLIENTDASH_DIR . 'core/customize/class-clientdash-customize.php';

			$this->db        = new ClientDash_DB();
			$this->api       = new ClientDash_API();
			$this->customize = new ClientDash_Customize();

			if ( is_admin() ) {

				require_once CLIENTDASH_DIR . 'core/plugin-pages/class-clientdash-pluginpages.php';
				require_once CLIENTDASH_DIR . 'core/class-clientdash-modify.php';

				$this->pluginpages = new ClientDash_PluginPages();
				$this->modify   = new ClientDash_Modify();
			}
		}

		/**
		 * Registers plugin assets.
		 *
		 * @since {{VERSION}}
		 * @access private
		 */
		function register_assets() {

			wp_register_style(
				'clientdash',
				CLIENTDASH_URI . '/assets/dist/css/clientdash.min.css',
				array(),
				defined( 'WP_DEBUG' ) && WP_DEBUG ? time() : CLIENTDASH_VERSION
			);

			wp_register_style(
				'clientdash-fontawesome',
				'https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css',
				array(),
				'4.7.0'
			);

			// Customize assets
			wp_register_style(
				'clientdash-customize',
				CLIENTDASH_URI . '/assets/dist/css/clientdash.customize.min.css',
				array(),
				defined( 'WP_DEBUG' ) && WP_DEBUG ? time() : CLIENTDASH_VERSION
			);

			wp_register_style(
				'clientdash-customize-inpreview',
				CLIENTDASH_URI . '/assets/dist/css/clientdash.customize.inpreview.min.css',
				array(),
				defined( 'WP_DEBUG' ) && WP_DEBUG ? time() : CLIENTDASH_VERSION
			);

			wp_register_script(
				'clientdash-customize',
				CLIENTDASH_URI . '/assets/dist/js/clientdash.customize.min.js',
				array(),
				defined( 'WP_DEBUG' ) && WP_DEBUG ? time() : CLIENTDASH_VERSION,
				true
			);

			wp_register_script(
				'clientdash-customize-inpreview',
				CLIENTDASH_URI . '/assets/dist/js/clientdash-inpreview.min.js',
				array(),
				defined( 'WP_DEBUG' ) && WP_DEBUG ? time() : CLIENTDASH_VERSION
			);

			wp_localize_script( 'clientdash', 'ClientDash_Data', array(
				'nonce' => wp_create_nonce( 'clientdash_nonce' ),
			) );

			wp_localize_script( 'clientdash-customize-inpreview', 'ClientDashCustomizeInPreview_Data', array(
				'domain'    => get_bloginfo( 'url' ),
				'l10n' => array(
					'preview_only' => __( 'Preview Only', 'clientdash' ),
				),
			));
		}

		/**
		 * Enqueues plugin assets.
		 *
		 * @since {{VERSION}}
		 * @access private
		 */
		function enqueue_assets() {

			global $wp_styles;

			wp_enqueue_script( 'clientdash' );
			wp_enqueue_style( 'clientdash' );
		}
	}

	// Load the bootstrapper
	require_once CLIENTDASH_DIR . 'client-dash-bootstrapper.php';
	new ClientDash_BootStrapper();

	// Installation
	require_once CLIENTDASH_DIR . 'core/class-clientdash-install.php';
	register_activation_hook( __FILE__, array( 'ClientDash_Install', 'install' ) );

	/**
	 * Gets/loads the main plugin class.
	 *
	 * @since {{VERSION}}
	 *
	 * @return ClientDash
	 */
	function ClientDash() {

		return ClientDash::instance();
	}
}