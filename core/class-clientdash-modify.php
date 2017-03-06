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
	 * ClientDash_Modify constructor.
	 *
	 * @since {{VERSION}}
	 */
	function __construct() {

		add_filter( 'custom_menu_order', array( $this, 'modify_menu' ), 99999 );
		add_action( 'wp_dashboard_setup', array( $this, 'modify_dashboard' ), 99999 );
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

		$original_menu_map = array_flip( wp_list_pluck( $menu, 2 ) );
		$new_menu          = array();

		foreach ( $this->menu as $ID => $menu_item ) {

			// Separators are handled diferrently
			if ( $menu_item['type'] == 'separator' ) {

				$new_menu[] = array(
					'',
					'read',
					$ID,
					'',
					'wp-menu-separator',
				);

				continue;
			}

			// Separators are handled diferrently
			if ( $menu_item['type'] == 'custom_link' ) {

				$new_menu[] = array(
					$menu_item['title'] ? $menu_item['title'] : $menu_item['original_title'],
					'read',
					$menu_item['link'],
					$menu_item['title'] ? $menu_item['title'] : $menu_item['original_title'],
					"menu-top toplevel_page_$ID",
					"toplevel_page_$ID",
					$menu_item['icon'],
				);

				continue;
			}

			// Skip deleted items
			if ( $menu_item['deleted'] ) {

				continue;
			}

			$original_menu_item = $menu[ $original_menu_map[ $ID ] ];

			$new_menu[] = array(
				$menu_item['title'] ? $menu_item['title'] : $menu_item['original_title'],
				$original_menu_item[1],
				$ID,
				$original_menu_item[3],
				$original_menu_item[4],
				$original_menu_item[5],
				$menu_item['icon'],
			);
		}

		$menu = $new_menu;

		foreach ( $this->submenu as $menu_ID => $submenu_items ) {

			$original_submenu_map = array_flip( wp_list_pluck( $submenu[ $menu_ID ], 2 ) );
			$new_submenu          = array();

			foreach ( $submenu_items as $ID => $submenu_item ) {

				// Skip deleted items
				if ( $submenu_item['deleted'] ) {

					continue;
				}

				// Handle weird Customize URL
				// The Customize URL is dynamic, so it won't match what was saved. This ensures it matches.
				if ( strpos( $ID, 'customize.php' ) === 0 ) {

					$customize_url = add_query_arg( 'return', urlencode( wp_unslash( $_SERVER['REQUEST_URI'] ) ), 'customize.php' );

					if ( $submenu_item['original_title'] == __( 'Customize' ) ) {

						$ID = esc_url( $customize_url );

					} elseif ( $submenu_item['original_title'] == __( 'Header' ) ) {

						$ID = esc_url(
							add_query_arg( array( 'autofocus' => array( 'control' => 'header_image' ) ), $customize_url )
						);
					}
				}

				$original_submenu_item = $submenu[ $menu_ID ][ $original_submenu_map[ $ID ] ];

				$new_submenu[] = array(
					$submenu_item['title'] ? $submenu_item['title'] : $submenu_item['original_title'],
					$original_submenu_item[1],
					$ID,
				);
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
						if ( ! isset( $this->dashboard[ $widget['id'] ] ) ) {

							continue;
						}

						$custom_widget = $this->dashboard[ $widget['id'] ];

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
}