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

	return ClientDash_DB::get_customizations( $role );
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

	return ClientDash_DB::update_customizations( $role, $data );
}

/**
 * Deletes customizations.
 *
 * Wrapper for ClientDashDB()::delete_customizations()
 *
 * @since {{VERSION}}
 *
 * @param string $role Customizations role.
 */
function cd_delete_customizations( $role ) {

	return ClientDash_DB::delete_customizations( $role );
}

/**
 * Searches an array by a nested key and returns the match.
 *
 * @since {{VERSION}}
 *
 * @param array $array
 * @param string $key
 * @param string $value
 *
 * @return bool|mixed
 */
function cd_array_search_by_key( $array, $key, $value ) {

	foreach ( $array as $array_item ) {

		if ( ! isset( $array_item[ $key ] ) ) {

			continue;
		}

		if ( $array_item[ $key ] === $value ) {

			return $array_item;
		}
	}

	return false;
}

/**
 * Adds a core CD page.
 *
 * @since {{VERSION}}
 *
 * @param array $page
 */
function cd_add_core_page( $page ) {

	global $clientdash_pages;
}

/**
 * Returns the core CD pages.
 *
 * @since {{VERSION}}
 */
function cd_get_core_pages() {

	$pages = ClientDash_Core_Pages::get_pages();

	return $pages;
}

/**
 * Loads a template file from the theme if it exists, otherwise from the plugin.
 *
 * @since {{VERSION}}}}
 *
 * @param string $template Template file to load.
 *
 * @return string File to load
 */
function cd_get_template( $template ) {

	/**
	 * Filter the template to be located.
	 *
	 * @since {{VERSION}}}}
	 */
	$template = apply_filters( 'cd_get_template', $template );

	$template_file = locate_template( array( "/client-dash/{$template}" ) );

	if ( $template_file ) {

		return $template_file;

	} else {

		return CLIENTDASH_DIR . "templates/{$template}";
	}
}

/**
 * Loads a template.
 *
 * @since {{VERSION}}}}
 *
 * @param string $template Template file to load.
 * @param array $args Arguments to extract for the template.
 */
function cd_template( $template, $args = array() ) {

	/**
	 * Filter the args to use in the template.
	 *
	 * @since {{VERSION}}}}
	 */
	$args = apply_filters( 'cd_get_template_args', $args, $template );

	extract( $args );

	include cd_get_template( $template );
}

/**
 * Takes an ID and determines if it's a Client Dash core page.
 *
 * @since {{VERSION}}
 *
 * @param string $ID Menu/page ID.
 *
 * return bool
 */
function cd_is_core_page( $ID ) {

	return in_array( $ID, array(
		'cd_account',
		'cd_reports',
		'cd_help',
		'cd_webmaster',
	) );
}