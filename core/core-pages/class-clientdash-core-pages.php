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

		// TODO Figure out how to handle cap and position

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
				$page['position']
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
	 * Loads a custom page.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function load_page() {

		global $plugin_page, $post;

		$admin_page = cd_array_search_by_key( $this->pages, 'id', $plugin_page );

		/**
		 * The template to use for core CD pages.
		 *
		 * @since {{VERSION}}
		 */
		$page_template = apply_filters( 'cd_core_page_template', CLIENTDASH_DIR . 'core/core-pages/views/page.php' );

		if ( ! file_exists( $page_template ) ) {

			return;
		}

		/**
		 * @var string $id
		 * @var string $title
		 * @var string $original_title
		 * @var string $icon
		 * @var string $parent
		 * @var int $position
		 */
		extract( $admin_page );

		include_once $page_template;
	}
}