<?php
/**
 * The settings page tab menu HTML.
 *
 * @since {{VERSION}}
 *
 * @package ClientDash
 * @subpackage ClientDash/core/settings/views
 *
 * @var array $tabs
 */

defined( 'ABSPATH' ) || die;
?>

<h2 class="nav-tab-wrapper">
	<?php foreach ( $tabs as $tab ) : ?>
		<a href="<?php echo esc_attr( $tab['link'] ); ?>"
		   class="nav-tab <?php echo $tab['active'] === true ? 'nav-tab-active' : ''; ?>">
			<?php echo $tab['text']; ?>
		</a>
	<?php endforeach; ?>
</h2>