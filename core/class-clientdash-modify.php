<?php
/**
 * Modifies the admin from the customizations.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core
 */

defined( 'ABSPATH' ) || die;

/**
 * Class ClientDash_Modify
 *
 * Modifies the admin from the customizations.
 *
 * @since {{VERSION}}
 */
class ClientDash_Modify {

	/**
	 * The modified menu.
	 *
	 * @since {{VERSION}}
	 *
	 * @var array|null
	 */
	public $menu;

	/**
	 * The modified submenu.
	 *
	 * @since {{VERSION}}
	 *
	 * @var array|null
	 */
	public $submenu;

	/**
	 * The modified dashboard.
	 *
	 * @since {{VERSION}}
	 *
	 * @var array|null
	 */
	public $dashboard;

	/**
	 * The customized pages.
	 *
	 * @since {{VERSION}}
	 *
	 * @var array|null
	 */
	public $pages;

	/**
	 * ClientDash_Modify constructor.
	 *
	 * @since {{VERSION}}
	 */
	function __construct() {

		add_filter( 'custom_menu_order', array( $this, 'modify_menu' ), 99999 );
		add_action( 'wp_dashboard_setup', array( $this, 'modify_dashboard' ), 99999 );
		add_filter( 'cd_core_pages', array( $this, 'modify_core_pages' ), 99999 );
	}

	/**
	 * Grabs the customizations, if any.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	private function get_customizations() {

		static $done = false;

		if ( $done ) {

			return;
		}

		$done = true;

		if ( ! ( $user = wp_get_current_user() ) ) {

			return;
		}

		if ( ! isset( $user->roles[0] ) ) {

			return;
		}

		$role = $user->roles[0];

		// If loading in the previewer, use temp data
		if ( isset( $_GET['cd_customizing'] ) ) {

			$role = "preview_$role";
		}

		if ( ! ( $customizations = ClientDash_DB::get_customizations( $role ) ) ) {

			return;
		}

		$this->menu      = $customizations['menu'];
		$this->submenu   = $customizations['submenu'];
		$this->dashboard = $customizations['dashboard'];
		$this->pages     = $customizations['cdpages'];
	}

	/**
	 * Modifies the menu.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function modify_menu( $bool ) {

		global $menu, $submenu;

		$this->get_customizations();

		if ( ! $this->menu && ! $this->submenu ) {

			return;
		}

		$new_menu = array();

		foreach ( $this->menu as $menu_item ) {

			// Separators are handled diferrently
			if ( $menu_item['type'] == 'separator' ) {

				$new_menu[] = array(
					'',
					'read',
					$menu_item['id'],
					'',
					'wp-menu-separator',
				);

				continue;
			}

			// Custom links are handled diferrently
			if ( $menu_item['type'] == 'custom_link' ) {

				$new_menu[] = array(
					$menu_item['title'] ? $menu_item['title'] : $menu_item['original_title'],
					'read',
					$menu_item['link'] ? $menu_item['link'] : '/wp-admin/',
					$menu_item['title'] ? $menu_item['title'] : $menu_item['original_title'],
					"menu-top toplevel_page_$menu_item[id]",
					"toplevel_page_$menu_item[id]",
					$menu_item['icon'],
				);

				continue;
			}

			// Skip deleted items
			if ( $menu_item['deleted'] ) {

				continue;
			}

			$original_menu_item = cd_array_search_by_key( $menu, 2, $menu_item['id'] );

			$new_menu[] = array(
				$menu_item['title'] ? $menu_item['title'] : $menu_item['original_title'],
				$original_menu_item[1],
				$menu_item['id'],
				$original_menu_item[3],
				$original_menu_item[4],
				$original_menu_item[5],
				$menu_item['icon'] ? $menu_item['icon'] : $menu_item['original_icon'],
			);
		}

		$menu = $new_menu;

		foreach ( $this->submenu as $menu_ID => $submenu_items ) {

			$new_submenu = array();
			$menu_item   = cd_array_search_by_key( $this->menu, 'id', $menu_ID );

			foreach ( $submenu_items as $submenu_item ) {

				// Skip deleted items
				if ( $submenu_item['deleted'] ) {

					continue;
				}

				// Custom links are handled diferrently
				if ( $submenu_item['type'] == 'custom_link' ) {

					$new_submenu[] = array(
						$submenu_item['title'] ? $submenu_item['title'] : $submenu_item['original_title'],
						'read',
						$submenu_item['link'] ? $submenu_item['link'] : '/wp-admin/',
					);

					continue;
				}

				// Handle weird Customize URL
				// The Customize URL is dynamic, so it won't match what was saved. This ensures it matches.
				if ( strpos( $submenu_item['id'], 'customize.php' ) === 0 ) {

					$customize_url = add_query_arg( 'return', urlencode( wp_unslash( $_SERVER['REQUEST_URI'] ) ), 'customize.php' );

					if ( $submenu_item['original_title'] == __( 'Customize' ) ) {

						$submenu_item['id'] = esc_url( $customize_url );

					} elseif ( $submenu_item['original_title'] == __( 'Header' ) ) {

						$submenu_item['id'] = esc_url(
							add_query_arg( array( 'autofocus' => array( 'control' => 'header_image' ) ), $customize_url )
						);
					}
				}

				$original_submenu_item = cd_array_search_by_key( $submenu[ $menu_ID ], 2, $submenu_item['id'] );

				$new_submenu[] = array(
					$submenu_item['title'] ? $submenu_item['title'] : $submenu_item['original_title'],
					$original_submenu_item[1],
					$submenu_item['id'],
				);
			}

			// Custom links are added differently
			if ( $menu_item['type'] == 'custom_link' ) {

				$submenu[ $menu_item['link'] ? $menu_item['link'] : '/wp-admin/' ] = $new_submenu;
				continue;
			}

			$submenu[ $menu_ID ] = $new_submenu;
		}

		return $bool;
	}

	/**
	 * Modifies the dashboard.
	 *
	 * @since {{VERSION}}
	 * @access private
	 */
	function modify_dashboard() {

		global $wp_meta_boxes;

		$this->get_customizations();

		if ( ! $this->dashboard ) {

			return;
		}

		if ( isset( $wp_meta_boxes['dashboard'] ) ) {

			foreach ( $wp_meta_boxes['dashboard'] as $position => $priorities ) {

				foreach ( $priorities as $priority => $widgets ) {

					foreach ( $widgets as $i => $widget ) {

						// No modification
						if ( ( $custom_widget = cd_array_search_by_key( $this->dashboard, 'id', $widget['id'] ) ) === false ) {

							continue;
						}

						// Modify
						if ( isset( $custom_widget['deleted'] ) && $custom_widget['deleted'] ) {

							unset( $wp_meta_boxes['dashboard'][ $position ][ $priority ][ $i ]['title'] );
							continue;
						}

						if ( isset( $custom_widget['title'] ) && $custom_widget['title'] ) {

							$wp_meta_boxes['dashboard'][ $position ][ $priority ][ $i ]['title'] = $custom_widget['title'];
						}
					}
				}
			}
		}
	}

	/**
	 * Modifies core CD pages.
	 *
	 * @since {{VERSION}}
	 * @access private
	 *
	 * @param array $pages
	 *
	 * @return array
	 */
	function modify_core_pages( $pages ) {

		$this->get_customizations();

		if ( ! $this->pages ) {

			return;
		}

		foreach ( $pages as $i => $page ) {

			$custom_page = cd_array_search_by_key( $this->pages, 'id', $page['id'] );

			if ( ! $custom_page ) {

				continue;
			}

			if ( $custom_page['deleted'] ) {

				unset( $pages[ $i ] );
				continue;
			}

			$pages[ $i ] = wp_parse_args( $custom_page, $page );
		}

		// Re-index
		$pages = array_values( $pages );

		return $pages;
	}
}