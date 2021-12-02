<!-- <?php
/*
This is a CLI tool for synchronizing a wordpress database across different environments. This process takes approximately 5-10 minutes to complete.

  Prerequisites:
    1. Current version of PHP is installed.
    2. 'php' added to $PATH (i.e. export PATH=$PATH:"/C/tools/php80").
    3. Current version of MySQL is installed.
    4. 'mysql' is added to $PATH (i.e. export PATH=$PATH:"/C/Program Files/MySQL/MySQL Workbench 8.0")

  To Synchronize Database Environments:
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
  $migration_dir = "migrations"."\\".date("Y-m-d");

  if ( !is_dir( $migration_dir ) ) {
    console_log("Creating backup directory at ".__DIR__."\\".$migration_dir.".");
    mkdir( $migration_dir );       
  }

  $filename = "migration-" . date("Y-m-d-H-i-s") . ".sql";

  $backup_destination = "mysqldump -h $destination_db_host -u $destination_db_user  --password=$destination_db_pass --skip-extended-insert --column-statistics=0 $destination_db_name >  $migration_dir/$destination_db_user-$filename";
  $dump_origin =        "mysqldump -h $origin_db_host      -u $origin_db_user       --password=$origin_db_pass      --skip-extended-insert --column-statistics=0 $origin_db_name      >  $migration_dir/$origin_db_user-$filename" ;
  $replace_hostname =   "sed 's/$origin_pattern/$destination_pattern/g'  $migration_dir/$origin_db_user-$filename >  $migration_dir/From$origin_db_user-To$destination_db_user-$filename";
  $import_environment = "mysql     -h $destination_db_host  -u $destination_db_user --password=$destination_db_pass $destination_db_name <  $migration_dir/From$origin_db_user-To$destination_db_user-$filename";

  console_log("Backing up destination database...\n".$destination_db_name." ==>  $migration_dir/$destination_db_user-$filename");
  passthru($backup_destination);

  console_log("Dumping contents of origin database...\n".$environments[$arguments[0]]['wp_home']." ==>  $migration_dir/$origin_db_user-$filename");
  passthru($dump_origin);

  console_log("Finding all occurences of origin hostname within database and replacing with destination hostname...\n $origin_pattern ==> $destination_pattern");
  passthru($replace_hostname);

  console_log("Importing origin into destination database...\n $migration_dir/$destination_db_user-$filename ==> $destination_db_name");
  passthru($import_environment);

  console_log("Synchronization complete. Database updated.");
}

console_log("Attempting to synchronize ".$arguments[0]." environment (source) with ".$arguments[1]." environment (target)...\n".$environments[$arguments[0]]['wp_home']." ==> ".$environments[$arguments[1]]['wp_home']);
$line = readline("Continue? [y]es [n]o \n");

$possible_yes = [
  'yes',
  'Yes',
  'y',
  'Y'
];

// Confirm sync execution
if (in_array($line, $possible_yes))
  commence_sync($environments, $arguments);


exit(0); 
