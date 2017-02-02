<?php
/**
 * The Client Dash Admin Customizer.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core
 */

defined( 'ABSPATH' ) || die;

/**
 * Class ClientDash_Customize
 *
 * The Client Dash Admin Customizer.
 *
 * @since {{VERSION}}
 */
class ClientDash_Customize {

	/**
	 * ClientDash_Customize constructor.
	 *
	 * @since {{VERSION}}
	 */
	function __construct() {

		if ( self::is_customizing() ) {

			add_action( 'template_redirect', array( $this, 'load' ), 0 );

			add_filter( 'show_admin_bar', '__return_false' );

			add_action( 'cd_customize_header', array( $this, 'template_header' ) );
			add_action( 'cd_customize_body', array( $this, 'template_body' ) );
			add_action( 'cd_customize_footer', array( $this, 'template_footer' ) );
		}
	}

	/**
	 * Tells if Client Dash is in the customize view.
	 *
	 * @since {{VERSION}}
	 *
	 * @return bool True if customizing, false otherwise.
	 */
	public static function is_customizing() {

		return isset( $_REQUEST['clientdash_customize'] ) && $_REQUEST['clientdash_customize'] == '1';
	}

	/**
	 * Loads the customizer.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function load() {

		add_action( 'template_redirect', array( $this, 'unload_wordpress' ), 9999 );
		add_action( 'cd_customize_enqueue_scripts', array( $this, 'enqueue_assets' ) );

		nocache_headers();
	}

	/**
	 * Sets up the WP Screen object, for other plugins to gather information to identify customize load.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function setup_screen() {

		require_once ABSPATH . 'wp-admin/includes/class-wp-screen.php';
		require_once ABSPATH . 'wp-admin/includes/screen.php';
		set_current_screen( 'clientdash_customize' );
	}

	/**
	 * Prevents WordPress from loading the frontend so that we can load our customizer.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function unload_wordpress() {

		// Override Theme
		add_filter( 'template_include', array( $this, 'inject_template' ), 999 );

		// Remove ALL actions to strip 3rd party plugins and unwanted WP functions
		remove_all_actions( 'wp_head' );
		remove_all_actions( 'wp_print_styles' );
		remove_all_actions( 'wp_print_head_scripts' );

		// Add back WP native actions that we need
		add_action( 'wp_head', 'wp_enqueue_scripts', 1 );
		add_action( 'wp_head', 'wp_print_styles', 8 );
		add_action( 'wp_head', 'wp_print_head_scripts', 9 );

		// Strip all scripts and styles
		add_action( 'wp_enqueue_scripts', array( $this, 'strip_enqueues' ), 999999 );

		// Footer
		remove_all_actions( 'wp_footer' );

		add_action( 'wp_footer', 'wp_print_footer_scripts', 20 );
		add_action( 'wp_footer', 'wp_admin_bar_render', 1000 );

		// Add some more custom actions
		add_action( 'wp_footer', array( $this, 'localize_data' ), 1 );
	}

	/**
	 * Remove all enqueue actions as early as possible.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	public function strip_enqueues() {

		global $wp_scripts, $wp_styles;

		$wp_scripts->queue = array();
		$wp_styles->queue  = array();

		do_action( 'cd_customize_enqueue_scripts' );

//		add_action( 'wp_enqueue_scripts', array( $this, 'reset_enqueues' ), 999999 );
	}

	/**
	 * Reset the style and script registries in case anything is still registered
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	public function reset_enqueues() {

		global $wp_styles;
		global $wp_scripts;

		$wp_styles  = new WP_Styles();
		$wp_scripts = new WP_Scripts();

		do_action( 'wp_enqueue_scripts_clean' );
	}

	/**
	 * Enqueues the Customizer assets.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function enqueue_assets() {

//		wp_enqueue_style( 'common' );
//		wp_enqueue_style( 'forms' );

		wp_enqueue_style( 'dashicons' );
		wp_enqueue_style( 'clientdash-fontawesome' );
		wp_enqueue_style( 'clientdash-customize' );
		wp_enqueue_script( 'clientdash-customize' );
	}

	/**
	 * Localizes data for JS.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function localize_data() {

		if ( ! function_exists( 'get_editable_roles' ) ) {

			require_once ABSPATH . 'wp-admin/includes/user.php';
		}

		$_roles = get_editable_roles();
		$roles  = array();

		foreach ( $_roles as $role_ID => $role ) {

			$roles[] = array(
				'text'  => $role['name'],
				'value' => $role_ID,
			);
		}

		wp_localize_script( 'clientdash-customize', 'ClientdashCustomize_Data', array(
			'roles'        => $roles,
			'adminurl'     => admin_url(),
			'dashicons'    => json_decode( file_get_contents( CLIENTDASH_DIR . 'core/dashicons.json' ) ),
			'menu'         => array(
				'index.php'  => array(
					'title'          => '',
					'original_title' => 'Dashboard',
					'icon'           => 'dashicons dashicons-dashboard',
				),
				'edit.php'   => array(
					'title'          => '',
					'original_title' => 'Posts',
					'icon'           => 'dashicons dashicons-admin-post',
				),
				'upload.php' => array(
					'title'          => '',
					'original_title' => 'Media',
					'icon'           => 'dashicons dashicons-admin-media',
				),
			), // TODO menu data
			'submenu'      => array(
				'index.php' => array(
					'update-core.php' => array(
						'title'          => '',
						'original_title' => 'Updates',
					),
					'test.php'        => array(
						'title'          => '',
						'original_title' => 'Test',
					),
				),
			), // TODO submenu data
			'orig_menu'    => array(
				'upload.php'          => array(
					'title' => 'Media',
					'icon'  => 'dashicons dashicons-admin-media',
				),
				'edit-comments.php'   => array(
					'title' => 'Comments',
					'icon'  => 'dashicons dashicons-admin-comments',
				),
				'options-general.php' => array(
					'title' => 'Settings',
					'icon'  => 'dashicons dashicons-admin-settings',
				),
			), // TODO orig_menu data
			'orig_submenu' => array(
				'index.php' => array(
					'update-core.php' => array(
						'title' => 'Updates',
					),
					'test2.php'       => array(
						'title' => 'Test2',
					),
				),
			), // TODO orig_submenu data
			'widgets'      => array(
				'dashboard_right_now' => array(
					'title'          => '',
					'original_title' => 'At a Glance',
				),
			), // TODO widgets data
			'orig_widgets' => array(
				'dashboard_right_now' => array(
					'title' => 'At a Glance',
				),
				'dashboard_activity'  => array(
					'title' => 'Activity',
				),
			), // TODO orig_widgets data
			'l10n'         => array(
				'role_switcher_label'             => __( 'Modifying for:', 'clientdash' ),
				'panel_text_menu'                 => __( 'Menu', 'clientdash' ),
				'panel_text_dashboard'            => __( 'Dashboard', 'clientdash' ),
				'panel_actions_title_menu'        => __( 'Editing: Menu', 'clientdash' ),
				'panel_actions_title_submenu'     => __( 'Editing: Sub-Menu', 'clientdash' ),
				'panel_actions_title_menu_add'    => __( 'Adding: Menu Items', 'clientdash' ),
				'panel_actions_title_submenu_add' => __( 'Adding: Sub-Menu Items', 'clientdash' ),
				'panel_actions_title_dashboard'   => __( 'Editing: Dashboard', 'clientdash' ),
				'action_button_back'              => __( 'Back', 'clientdash' ),
				'action_button_add_items'         => __( 'Add Items', 'clientdash' ),
				'show_controls'                   => __( 'Show Controls', 'clientdash' ),
				'title'                           => __( 'Title', 'clientdash' ),
				'original_title'                  => __( 'Original title:', 'clientdash' ),
				'icon'                            => __( 'Icon', 'clientdash' ),
				'no_items_added'                  => __( 'No items added yet. Click the "Add Items" button to add your first item.', 'clientdash' ),
				'no_items_available'              => __( 'No items available.', 'clientdash' ),
			),
		) );
	}

	/**
	 * Loads up the templates.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function inject_template() {

		/**
		 * Loads the customize header.
		 *
		 * @since {{VERSION}}
		 *
		 * @hooked ClientDash_Customize->template_header() 10
		 */
		do_action( 'cd_customize_header' );

		/**
		 * Loads the customize body.
		 *
		 * @since {{VERSION}}
		 *
		 * @hooked ClientDash_Customize->template_body() 10
		 */
		do_action( 'cd_customize_body' );

		/**
		 * Loads the customize footer.
		 *
		 * @since {{VERSION}}
		 *
		 * @hooked ClientDash_Customize->template_footer() 10
		 */
		do_action( 'cd_customize_footer' );
	}

	/**
	 * Loads the header template.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function template_header() {

		include_once CLIENTDASH_DIR . 'core/customize/views/customize-header.php';
	}

	/**
	 * Loads the customize body.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function template_body() {

		include_once CLIENTDASH_DIR . 'core/customize/views/customize-body.php';
	}

	/**
	 * Loads the footer template.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function template_footer() {

		include_once CLIENTDASH_DIR . 'core/customize/views/customize-footer.php';
	}
}