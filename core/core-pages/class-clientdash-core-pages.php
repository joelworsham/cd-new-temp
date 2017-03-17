<?php
/**
 * Adds core CD pages.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core/core-pages
 */

defined( 'ABSPATH' ) || die;

/**
 * Class ClientDash_Core_Pages
 *
 * Adds core CD pages.
 *
 * @since {{VERSION}}
 */
class ClientDash_Core_Pages {

	/**
	 * The custom pages.
	 *
	 * @since {{VERSION}}
	 *
	 * @var array|null
	 */
	public $pages;

	/**
	 * ClientDash_Core_Pages constructor.
	 *
	 * @since {{VERSION}}
	 */
	function __construct() {

		if ( is_admin() ) {

			add_action( 'init', array( $this, 'load_pages' ) );
			add_action( 'admin_menu', array( $this, 'add_pages' ) );
		}
	}

	/**
	 * Loads the custom pages.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function load_pages() {

		$this->pages = self::get_pages();
	}

	/**
	 * Gets custom CD pages.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	static public function get_pages() {

		/**
		 * Client Dash core pages.
		 *
		 * @since {{VERSION}}
		 */
		$pages = apply_filters( 'cd_core_pages', array(
			array(
				'id'             => 'cd_account',
				'title'          => '',
				'original_title' => __( 'Account', 'clientdash' ),
				'icon'           => '',
				'original_icon'  => 'dashicons-id-alt',
				'parent'         => 'index.php',
				'deleted'        => false,
				'position'       => 100,
				'tabs'           => array(
					'about' => array(
						'label'    => __( 'About', 'client-dash' ),
						'callback' => array( __CLASS__, 'load_cd_page_account_tab_about' ),
					),
					'sites' => array(
						'label'    => __( 'Sites', 'client-dash' ),
						'callback' => array( __CLASS__, 'load_cd_page_account_tab_sites' ),
					),
				),
			),
			array(
				'id'             => 'cd_help',
				'title'          => '',
				'original_title' => __( 'Help', 'clientdash' ),
				'icon'           => '',
				'original_icon'  => 'dashicons-editor-help',
				'parent'         => 'index.php',
				'deleted'        => false,
				'position'       => 100,
				'tabs'           => array(
					'about' => array(
						'label'    => __( 'Domain', 'client-dash' ),
						'callback' => array( __CLASS__, 'load_cd_page_help_tab_domain' ),
					),
					'sites' => array(
						'label'    => __( 'Info', 'client-dash' ),
						'callback' => array( __CLASS__, 'load_cd_page_help_tab_info' ),
					),
				),
			),
			array(
				'id'             => 'cd_reports',
				'title'          => '',
				'original_title' => __( 'Reports', 'clientdash' ),
				'icon'           => '',
				'original_icon'  => 'dashicons-chart-area',
				'parent'         => 'index.php',
				'deleted'        => false,
				'position'       => 100,
				'tabs'           => array(
					'about' => array(
						'label'    => __( 'Site', 'client-dash' ),
						'callback' => array( __CLASS__, 'load_cd_page_reports_tab_site' ),
					),
				),
			),
			array(
				'id'             => 'cd_webmaster',
				'title'          => '',
				'original_title' => __( 'Webmaster', 'clientdash' ),
				'icon'           => '',
				'original_icon'  => 'dashicons-businessman',
				'parent'         => 'index.php',
				'deleted'        => false,
				'position'       => 100,
			),
		) );

		return $pages;
	}

	/**
	 * Adds the custom pages.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function add_pages() {

		if ( ! $this->pages || ! is_array( $this->pages ) ) {

			return;
		}

		// TODO Figure out how to handle cap

		// Add toplevel
		foreach ( $this->pages as $page ) {

			if ( $page['parent'] != 'toplevel' ) {

				continue;
			}

			add_menu_page(
				$page['title'] ? $page['title'] : $page['original_title'],
				$page['title'] ? $page['title'] : $page['original_title'],
				'read',
				$page['id'],
				array( $this, 'load_page' ),
				$page['icon'] ? $page['icon'] : $page['original_icon'],
				$page['position'] ? $page['position'] : 100
			);
		}

		// Add submenu
		foreach ( $this->pages as $page ) {

			if ( $page['parent'] == 'toplevel' ) {

				continue;
			}

			add_submenu_page(
				$page['parent'],
				$page['title'] ? $page['title'] : $page['original_title'],
				$page['title'] ? $page['title'] : $page['original_title'],
				'read',
				$page['id'],
				array( $this, 'load_page' )
			);
		}
	}

	/**
	 * Sets up the page with defaults and such.
	 *
	 * @since {{VERSION}}
	 *
	 * @param array $cd_page
	 *
	 * @return array
	 */
	static public function setup_cd_page_args( $cd_page ) {

		$cd_page['title'] = $cd_page['title'] ? $cd_page['title'] : $cd_page['original_title'];
		$cd_page['icon']  = $cd_page['icon'] ? $cd_page['icon'] : $cd_page['original_icon'];

		return $cd_page;
	}

	/**
	 * Loads a custom page.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function load_page() {

		global $plugin_page;

		$cd_page = cd_array_search_by_key( $this->pages, 'id', $plugin_page );

		/**
		 * The template to use for core CD pages.
		 *
		 * @since {{VERSION}}
		 */
		$page_template = apply_filters(
			'cd_core_page_template',
			CLIENTDASH_DIR . 'core/core-pages/views/page.php'
		);

		$cd_page = self::setup_cd_page_args( $cd_page );

		if ( ! file_exists( $page_template ) ) {

			return;
		}

		// Active tab
		if ( isset( $_GET['tab'] ) ) {

			$active_tab = $_GET['tab'];

		} else {

			reset( $cd_page['tabs'] );
			$active_tab = key( $cd_page['tabs'] );
		}

		include_once $page_template;
	}

	/**
	 * Loads the Account page tab About.
	 *
	 * @since {{VERSION}}
	 */
	static public function load_cd_page_account_tab_about() {

		global $wp_roles;

		$current_user = wp_get_current_user();
		$user_role    = $wp_roles->role_names[ $current_user->roles[0] ];

		include_once CLIENTDASH_DIR . 'core/core-pages/views/account/about.php';
	}

	/**
	 * Loads the Account page tab Sites.
	 *
	 * @since {{VERSION}}
	 */
	static public function load_cd_page_account_tab_sites() {

		$current_user = wp_get_current_user();

		$blogs = get_blogs_of_user( $current_user->ID );

		include_once CLIENTDASH_DIR . 'core/core-pages/views/account/sites.php';
	}

	/**
	 * Loads the Help page tab Domain.
	 *
	 * @since {{VERSION}}
	 */
	static public function load_cd_page_help_tab_domain() {

		$domain = str_replace( 'http://', '', get_site_url() );
		$ip     = gethostbyname( $domain );
		$dns    = dns_get_record( $domain );

		include_once CLIENTDASH_DIR . 'core/core-pages/views/help/domain.php';
	}

	/**
	 * Loads the Help page tab Info.
	 *
	 * @since {{VERSION}}
	 */
	static public function load_cd_page_help_tab_info() {

		global $wp_version;

		$current_theme     = wp_get_theme();
		$installed_plugins = get_plugins();
		$active_plugins    = get_option( 'active_plugins' );
		$theme_uri         = $current_theme->get( 'ThemeURI' );
		$author_uri        = $current_theme->get( 'AuthorURI' );

		foreach ( $active_plugins as $i => $active_plugin ) {

			$active_plugins[ $i ] = get_plugin_data( dirname( CLIENTDASH_DIR ) . "/$active_plugin" );
		}

		$child_theme = false;

		if ( is_child_theme() ) {

			$child_theme = wp_get_theme( $current_theme->get_template() );
		}

		include_once CLIENTDASH_DIR . 'core/core-pages/views/help/info.php';
	}

	/**
	 * Loads the Reports page tab Site.
	 *
	 * @since {{VERSION}}
	 */
	static public function load_cd_page_reports_tab_site() {

		$count_comments = wp_count_comments();
		$count_users    = count_users();
		$post_types     = get_post_types( array(
			'public' => true,
		), 'objects' );
		$upload_dir  = wp_upload_dir();
		$dir_info    = cd_get_dir_size( $upload_dir['basedir'] );
		$attachments = wp_count_posts( 'attachment' );

		include_once CLIENTDASH_DIR . 'core/core-pages/views/reports/site.php';
	}
}