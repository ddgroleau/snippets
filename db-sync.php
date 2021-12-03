<!-- <?php
/*
This is a CLI tool for synchronizing the wholehealthliving database across different environments. This process takes approximately 5-10 minutes to complete.

  Prerequisites:
    1. Current version of PHP is installed.
    2. 'php' added to $PATH (i.e. export PATH=$PATH:"/C/tools/php80").
    3. Current version of MySQL is installed.
    4. 'mysql' is added to $PATH (i.e. export PATH=$PATH:"/C/Program Files/MySQL/MySQL Workbench 8.0")

  To Synchronize Database Environments:
    * Environment synchronization should follow a linear pattern: local -> dev -> qa -> uat -> prod
      (You can start anywhere but do not skip a successive environment, i.e. do not go from dev to prod)
    * In the terminal, navigate to the directory where this file exists.
    * Run the command 'php db-sync.php <origin> <destination>'
        where <origin> is the source DB and <destination> is the target DB.
        EXAMPLE: 'php db-sync.php dev qa'
*/

date_default_timezone_set('America/Phoenix');
error_reporting(E_ALL);

$environments = json_decode(file_get_contents("db_mask.json"), true);
$arguments = $_SERVER['argv'];

if (count($arguments) != 3) {
  echo 'Missing arguments, example: php db-sync.php dev local';
  exit(1);
}

array_shift($arguments);

foreach ($arguments as $argument) {
  if (!in_array($argument, array_keys($environments))) {
    echo 'Environment arguments not recognized';
    exit(1);
  }
}

function console_log($message) {
  echo "\n".$message."\n\n\n";
}

function commence_sync($environments, $arguments) {

  // Get environment settings from json file
  $origin = $environments[$arguments[0]];
  $destination = $environments[$arguments[1]];

  // Extract settings as variables prefixed with origin or destination respectively
  extract($origin, EXTR_PREFIX_ALL, 'origin');
  extract($destination, EXTR_PREFIX_ALL, 'destination');
  
  // Establish patterns with correctly escaped characters for 'replace_hostname'
  $origin_pattern = preg_quote($origin_pattern);
  $destination_pattern = preg_quote($destination_pattern);
  
  // Create migrations directory if it does not exist
  $migration_dir = "migrations"."\/".date("Y-m-d");
  if ( !is_dir( $migration_dir ) ) {
    console_log("Creating backup directory at ".__DIR__."\/".$migration_dir.".");
    mkdir( $migration_dir );       
  }
  
  // Instantiate bash command strings
  $filename = "migration-" . date("Y-m-d-H-i-s") . ".sql";
  $backup_destination = "mysqldump -h $destination_db_host -u $destination_db_user  --password=$destination_db_pass --skip-extended-insert --column-statistics=0 $destination_db_name >  $migration_dir/$destination_name-$filename";
  $dump_origin =        "mysqldump -h $origin_db_host      -u $origin_db_user       --password=$origin_db_pass      --skip-extended-insert --column-statistics=0 $origin_db_name      >  $migration_dir/$origin_name-$filename" ;
  $replace_hostname =   "sed 's/$origin_pattern/$destination_pattern/g'  $migration_dir/$origin_name-$filename >  $migration_dir/from-{$origin_name}_to-{$destination_name}_$filename";
  $replace_hostname_with_prefix =  "sed 's/http\:\/\/$origin_pattern/https\:\/\/$destination_pattern/g'   $migration_dir/$origin_name-$filename >  $migration_dir/from-{$origin_name}_to-{$destination_name}_$filename";
  $import_environment = "mysql -h $destination_db_host  -u $destination_db_user --password=$destination_db_pass $destination_db_name <  $migration_dir/from-{$origin_name}_to-{$destination_name}_$filename";
  
  // Backup destination db
  console_log("Backing up destination database...\n".$destination_db_name." ==>  $migration_dir/$destination_name-$filename");
  passthru($backup_destination);

  // Get contents of origin db
  console_log("Dumping contents of origin database...\n".$environments[$arguments[0]]['wp_home']." ==>  $migration_dir/$origin_name-$filename");
  passthru($dump_origin);

  // Replace instances of origin hostname with destination hostname in sql script
  console_log("Finding all occurences of origin hostname within database and replacing with destination hostname...\n $origin_pattern ==> $destination_pattern");
  if($origin_name == "local") {
    // If migrating from localhost, change 'http' to 'https'
    passthru($replace_hostname_with_prefix);
  } else {
    passthru($replace_hostname);
  }

  // Confirm import to database
  console_log("Importing the origin database into the destination database...\n $migration_dir/from-{$origin_name}_to-{$destination_name}_$filename ==> $destination_db_name");
  $import_acknowledgement = readline("The next step will import the origin database into the destination database. Continue? [y]es [n]o \n");
  $possible_yes = ['yes','Yes','y','Y'];

  if (in_array($import_acknowledgement, $possible_yes)) {
    passthru($import_environment);
  } else {
    console_log("Migration scripts have been created. Exiting prior to import process execution.");
    exit(0);
  }
    console_log("Synchronization complete. Database updated.");
}

// Confirm sync execution
console_log("Attempting to synchronize ".$arguments[0]." environment (source) with ".$arguments[1]." environment (target)...\n".$environments[$arguments[0]]['wp_home']." ==> ".$environments[$arguments[1]]['wp_home']);
$synchronize_acknowledgement = readline("Continue? [y]es [n]o \n");
$possible_yes = ['yes','Yes','y','Y'];

if (in_array($synchronize_acknowledgement, $possible_yes))
  commence_sync($environments, $arguments);


exit(0); 
