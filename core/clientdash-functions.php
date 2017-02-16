<?php
/**
 * Helper functions.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core
 */

defined( 'ABSPATH' ) || die;

/**
 * Gets customizations.
 *
 * Wrapper for ClientDashDB()::get_customizations()
 *
 * @since {{VERSION}}
 *
 * @param string $role Customizations role.
 */
function cd_get_customizations( $role ) {

	return ClientDashDB()::get_customizations( $role );
}

/**
 * Gets the role's custom menu, if set.
 *
 * Wrapper for ClientDashDB()::get_role_menus()
 *
 * @since {{VERSION}}
 *
 * @param string $role Role to get menu for.
 *
 * @return array|bool|mixed|void
 */
function cd_get_role_menus( $role ) {

	return ClientDash_DB::get_role_menu( $role );
}

/**
 * Gets the role's custom dashboard, if set.
 *
 * Wrapper for ClientDashDB()::get_role_dashboard()
 *
 * @since {{VERSION}}
 *
 * @param string $role Role to get dashboard for.
 *
 * @return array|bool|mixed|void
 */
function cd_get_role_dashboard( $role ) {

	return ClientDash_DB::get_role_dashboard( $role );
}

/**
 * Updates or adds a role customizations.
 *
 * Wrapper for ClientDashDB()::update_role_customizations()
 *
 * @since {{VERSION}}
 *
 * @param string $role
 * @param array $data
 *
 * @return array|null|object|void
 */
function cd_update_role_customizations( $role, $data ) {

	return ClientDash_DB::update_role_customizations( $role, $data );
}