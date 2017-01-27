<?php
/**
 * The settings page HTML.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core/settings/views
 */

defined( 'ABSPATH' ) || die;
?>

<div class="wrap cd-settings">

	<h2 class="cd-title">
		<span class="dashicons dashicons-admin-settings cd-icon"></span>
		<span class="cd-title-text">Client Dash Settings</span>
	</h2>

	<?php $this->load_settings_tab_menu(); ?>

	<form method="post" action="options.php">

		<?php $this->load_settings_tab(); ?>

		<?php submit_button( __( 'Save Changes', 'clientdash' ) ); ?>

	</form>
</div>
