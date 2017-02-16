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

		// If in the customizer, modify the role
		if ( isset( $_GET['cd_customizing'] ) ) {

			add_action( 'set_current_user', array( $this, 'modify_current_user' ), 99999 );
		}

		// Save role settings on first role load
		if ( isset( $_GET['cd_save_role'] ) ) {

			add_filter( 'custom_menu_order', array(
				$this,
				'save_menu_preview'
			), 99998 ); // Priority just before modifying
			add_filter( 'wp_dashboard_widgets', array(
				$this,
				'save_dashboard_preview'
			), 99998 ); // Priority just before modifying
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

		global $menu, $submenu;

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
			'roles'     => $roles,
			'adminurl'  => admin_url(),
			'dashicons' => json_decode( file_get_contents( CLIENTDASH_DIR . 'core/dashicons.json' ) ),
			'l10n'      => array(
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
				'separator'                       => __( 'Separator', 'clientdash' ),
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

	/**
	 * Retrieves and stores the current role.
	 *
	 * @since {{VERSION}}
	 * @access private
	 *
	 * @return bool|null|WP_Role
	 */
	private function get_role() {

		static $role = false;

		if ( $role === false ) {

			$role = get_role( $_GET['role'] );
		}

		if ( $role === null ) {

			return false;
		}

		return $role;
	}

	/**
	 * Modifies the current user to set the role.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function modify_current_user() {

		global $current_user;

		if ( ! ( $role = $this->get_role() ) ) {

			return;
		}

		$current_user->roles   = array( $role->name );
		$current_user->caps    = array( $role->name => true );
		$current_user->allcaps = $role->capabilities;
	}

	/**
	 * Initially saves a role's menu preview for the customizer.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function save_menu_preview( $bool ) {

		global $menu, $submenu;

		$role = $_GET['role'];

		$customizations = cd_get_customizations( $role );

		// Get original menu merged with customizations
		ksort( $menu );

		$save_menu       = array();
		$customized_menu = isset( $customizations['menu'] ) ? $customizations['menu'] : array();

		foreach ( $menu as $menu_item ) {

			$customized_menu_item = isset( $customized_menu[ $menu_item[2] ] ) ?
				$customized_menu[ $menu_item[2] ] : array();

			$save_menu[ $menu_item[2] ] = wp_parse_args( $customized_menu_item, array(
				'original_title' => $menu_item[0],
				'icon'           => $menu_item[6],
				'deleted'        => false,
				'separator'      => $menu_item[4] == 'wp-menu-separator',
			) );
		}

		// Get original submenu merged with customizations
		$save_submenu       = array();
		$customized_submenu = isset( $customizations['submenu'] ) ? $customizations['submenu'] : array();

		foreach ( $submenu as $menu_slug => $submenu_items ) {

			ksort( $submenu_items );

			$save_submenu[ $menu_slug ] = array();

			foreach ( $submenu_items as $submenu_item ) {

				$customized_submenu_item = isset( $customized_submenu[ $submenu_item[2] ] ) ?
					$customized_submenu[ $submenu_item[2] ] : array();

				$save_submenu[ $menu_slug ][ $submenu_item[2] ] = wp_parse_args( $customized_submenu_item, array(
					'original_title' => $submenu_item[0],
					'deleted'        => false,
				) );
			}
		}

		// Set current role menu
		cd_update_role_customizations( "preview_$role", array(
			'menu'    => $save_menu,
			'submenu' => $save_submenu,
		) );

		return $bool;
	}

	/**
	 * Initially saves a role's dashboard preview.
	 *
	 * @since {{VERSION}}
	 * @access private
	 *
	 * @param array $dashboard_widgets
	 *
	 * @return array
	 */
	function save_dashboard_preview( $dashboard_widgets ) {

		global $wp_meta_boxes;

		$role = $_GET['role'];

		$customizations = cd_get_customizations( $role );

		$save_dashboard       = array();
		$customized_dashboard = isset( $customizations['dashboard'] ) ? $customizations['dashboard'] : array();

		if ( isset( $wp_meta_boxes['dashboard'] ) ) {

			foreach ( $wp_meta_boxes['dashboard'] as $priorities ) {

				foreach ( $priorities as $widgets ) {

					foreach ( $widgets as $widget ) {

						$customized_widget = isset( $customized_dashboard[ $widget['id'] ] ) ?
							$customized_dashboard[ $widget['id'] ] : array();

						$save_dashboard[ $widget['id'] ] = wp_parse_args( $customized_widget, array(
							'original_title' => $widget['title'],
							'deleted'        => false,
						) );
					}
				}
			}
		}

		// Set current role dashboard
		cd_update_role_customizations( "preview_$role", array(
			'dashboard' => $save_dashboard,
		) );

		return $dashboard_widgets;
	}
}