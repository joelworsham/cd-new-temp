<?php
/**
 * Database functions.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core
 */

defined( 'ABSPATH' ) || die;

/**
 * Class ClientDash_DB
 *
 * Database functions.
 *
 * @since {{VERSION}}
 */
class ClientDash_DB {

	/**
	 * Gets a set of customizations.
	 *
	 * @since {{VERSION}}
	 *
	 * @param string $role Role of the customization.
	 *
	 * @return array|null|object|void
	 */
	public static function get_customizations( $role ) {

		global $wpdb;

		$results = $wpdb->get_row( "SELECT * FROM {$wpdb->prefix}cd_customizations WHERE role = '$role'", ARRAY_A );

		foreach ( $results as &$result ) {

			$result = maybe_unserialize( $result );
		}

		/**
		 * Filters the get_customizations results.
		 *
		 * @since {{VERSION}}
		 */
		$results = apply_filters(
			'cd_db_get_customizations_by_role',
			$results,
			$role
		);

		return $results;
	}

	/**
	 * Gets the role's custom menu, if set.
	 *
	 * @since {{VERSION}}
	 *
	 * @param string $role Role to get menu for.
	 *
	 * @return array|bool|mixed|void
	 */
	public static function get_role_menu( $role ) {

		if ( ! ( $results = self::get_customizations( $role ) ) ) {

			return false;
		}

		if ( ! isset( $results['menu'] ) ) {

			return array();
		}

		/**
		 * Filters the role's custom menu, if set.
		 *
		 * @since {{VERSION}}
		 */
		$menu = apply_filters( 'cd_role_menu', $results['menu'] );

		return $menu;
	}

	/**
	 * Gets the role's custom submenu, if set.
	 *
	 * @since {{VERSION}}
	 *
	 * @param string $role Role to get menu for.
	 *
	 * @return array|bool|mixed|void
	 */
	public static function get_role_submenu( $role ) {

		if ( ! ( $results = self::get_customizations( $role ) ) ) {

			return false;
		}

		if ( ! isset( $results['submenu'] ) ) {

			return array();
		}

		/**
		 * Filters the role's custom submenu, if set.
		 *
		 * @since {{VERSION}}
		 */
		$submenu = apply_filters( 'cd_role_submenu', $results['submenu'] );

		return $submenu;
	}

	/**
	 * Gets the role's custom widgets, if set.
	 *
	 * @since {{VERSION}}
	 *
	 * @param string $role Role to get widgets for.
	 *
	 * @return array|bool|mixed|void
	 */
	public static function get_role_widgets( $role ) {

		if ( ! ( $results = self::get_customizations( $role ) ) ) {

			return false;
		}

		if ( ! isset( $results['widgets'] ) ) {

			return array();
		}

		/**
		 * Filters the role's custom widgets, if set.
		 *
		 * @since {{VERSION}}
		 */
		$widgets = apply_filters( 'cd_role_widgets', $results['widgets'] );

		return $widgets;
	}

	/**
	 * Updates or adds a role customizations.
	 *
	 * @since {{VERSION}}
	 *
	 * @param string $role
	 * @param array $menu
	 * @param array $submenu
	 * @param array $widgets
	 *
	 * @return array|null|object|void
	 */
	public static function update_role_customizations( $role, $menu, $submenu, $widgets ) {

		global $wpdb;

		/**
		 * Filters the customizations to update/add.
		 *
		 * @since {{VERSION}}
		 */
		$customizations = apply_filters( 'cd_db_update_role_customizations', array(
			'menu'    => $menu,
			'submenu' => $submenu,
			'widgets' => $widgets,
		), $role );

		// Update if exists
		if ( self::get_customizations( $role ) ) {

			$result = $wpdb->update(
				"{$wpdb->prefix}cd_customizations",
				array(
					'menu'    => serialize( $customizations['menu'] ),
					'submenu' => serialize( $customizations['submenu'] ),
					'widgets' => serialize( $customizations['widgets'] ),
				),
				array(
					'role' => $role,
				),
				array(
					'%s',
					'%s',
					'%s',
				),
				array(
					'%s',
				)
			);

		} else {

			$result = $wpdb->insert(
				"{$wpdb->prefix}cd_customizations",
				array(
					'role'    => $role,
					'submenu' => serialize( $customizations['submenu'] ),
					'menu'    => serialize( $customizations['menu'] ),
					'widgets' => serialize( $customizations['widgets'] ),
				),
				array(
					'%s',
					'%s',
					'%s',
					'%s',
				)
			);
		}

		if ( $result === 1 ) {

			return $wpdb->insert_id;

		} else {

			return $result;
		}
	}
}

/**
 * Quick access to database class.
 *
 * @since {{VERSION}}
 */
function ClientDashDB() {

	return ClientDash()->db;
}