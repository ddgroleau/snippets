<?php

// BEGIN iThemes Security - Do not modify or remove this line
// iThemes Security Config Details: 2
define( 'DISALLOW_FILE_EDIT', true ); // Disable File Editor - Security > Settings > WordPress Tweaks > File Editor
// END iThemes Security - Do not modify or remove this line

//Begin Really Simple SSL session cookie settings
@ini_set('session.cookie_httponly', true);
@ini_set('session.cookie_secure', true);
@ini_set('session.use_only_cookies', true);
//END Really Simple SSL


/**
 * The base configuration for WordPress
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 * This file contains the following configurations:
	* * MySQL settings
	* * Secret keys
	* * Database table prefix
	* * ABSPATH

 * @link https://wordpress.org/support/article/editing-wp-config-php/
 * @package WordPress

 */
function db_mask() {

	$host = $_SERVER['HTTP_HOST'];
  
	$environments = json_decode(file_get_contents(__DIR__."/db_mask.json"));
  
	foreach($environments as $environment => $values) {
	  preg_match('/'.preg_quote($values->pattern).'/', $host, $matches);
	  if (!empty($matches)) {
		return $environments->{$environment};
	  }
	}
  }

  /** The name of the database for WordPress */
  define('DB_NAME',            db_mask()->db_name);
  /** MySQL database username */
  define('DB_USER',            db_mask()->db_user);
  /** MySQL database password */
  define('DB_PASSWORD',        db_mask()->db_pass);
  /** MySQL hostname */
  define('DB_HOST',            db_mask()->db_host);
  /** Wordpress Site URL */
  define('WP_SITEURL',         db_mask()->domain);
  /** Wordpress Home URL */
  define('WP_HOME',            db_mask()->wp_home);
  /** Database charset to use in creating database tables. */
  define( 'DB_CHARSET', 'utf8mb4' );
  /** The database collate type. Don't change this if in doubt. */
  define( 'DB_COLLATE', '' );

/**#@+

 * Authentication unique keys and salts.
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 * @since 2.6.0

 */

define( 'AUTH_KEY',         '' );

define( 'SECURE_AUTH_KEY',  '' );

define( 'LOGGED_IN_KEY',    '' );

define( 'NONCE_KEY',        '' );

define( 'AUTH_SALT',        '' );

define( 'SECURE_AUTH_SALT', '' );

define( 'LOGGED_IN_SALT',   '' );

define( 'NONCE_SALT',       '' );


/**#@-*/
/**

 * WordPress database table prefix.

 *

 * You can have multiple installations in one database if you give each

 * a unique prefix. Only numbers, letters, and underscores please!

 */

$table_prefix = 'wp_';


/**
 * For developers: WordPress debugging mode.
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.

 * For information on other constants that can be used for debugging,
 * visit the documentation.

 * @link https://wordpress.org/support/article/debugging-in-wordpress/

 */

define( 'WP_DEBUG', false );


/* Add any custom values between this line and the "stop editing" line. */

/* That's all, stop editing! Happy publishing. */


/** Absolute path to the WordPress directory. */

if ( ! defined( 'ABSPATH' ) ) {

	define( 'ABSPATH', __DIR__ . '/' );

}


/** Sets up WordPress vars and included files. */

require_once ABSPATH . 'wp-settings.php';

