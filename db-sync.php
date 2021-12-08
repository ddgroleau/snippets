<?php
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
    * Note - The private function 'ignore_tables() contains a list of tables that we will not overwrite
        during this process because they contain data pertinent to their respective environment.
*/

date_default_timezone_set('America/Phoenix');
error_reporting(E_ALL);

$db_sync_manager = new DbSyncManager();
$db_sync_manager->synchronize();

class DbSyncManager {
  private $environments;
  private $arguments;
  private $origin;
  private $destination;
  private $migration_dir;
  private $possible_yes;
  private $filename;

  public function  __construct() {
    $this->environments = json_decode(file_get_contents("db_mask.json"), true);
    $this->arguments = $_SERVER['argv'];
    $this->possible_yes = ['yes','Yes','y','Y'];
    $this->filename = "migration-".date("Y-m-d-H-i-s").".sql";
  }

  public function synchronize() {
    $this->validate_environment_arguments();
    $this->set_origin_and_destination_vars();
    $this->establish_migrations_directory();

    if(!$this->ackowledge_sync()) exit(0);
      
    $this->backup_destination_db();
    $this->dump_origin_db();
    $this->replace_origin_hostname();

    if($this->ackowledge_import()) $this->execute_import();

    $this->console_log("Synchronization complete. Database updated.");
    exit(0);
  }

  private function validate_environment_arguments() {
    if (count($this->arguments) != 3) {
      echo 'Missing arguments, example: php db-sync.php dev local';
      exit(1);
    }
    array_shift($this->arguments);
    foreach ($this->arguments as $argument) {
      if (!in_array($argument, array_keys($this->environments))) {
        echo 'Environment arguments not recognized';
        exit(1);
      }
    }
  }

  private function console_log($message) {
    echo "\n".$message."\n\n\n";
  }

  private function set_origin_and_destination_vars() {
    $this->origin = $this->environments[$this->arguments[0]];
    $this->destination = $this->environments[$this->arguments[1]];
    $this->origin['pattern'] = preg_quote($this->origin['pattern']);
    $this->destination['pattern'] = preg_quote($this->destination['pattern']);
  }

  private function establish_migrations_directory() {
    $this->migration_dir = "migrations"."\/".date("Y-m-d");
    if ( !is_dir( $this->migration_dir ) ) {
      $this->console_log("Creating backup directory at ".__DIR__."\/".$this->migration_dir.".");
      mkdir( $this->migration_dir );       
    }
  }

  private function ackowledge_import() {
    $import_acknowledgement = readline("The next step will import the origin database into the destination database. Continue? [y]es [n]o \n");
    if (in_array($import_acknowledgement, $this->possible_yes)) {
      return true;
    } else {
      $this->console_log("Migration scripts have been created. Exiting prior to import process execution.");
      exit(0);
    }
  }

  private function execute_import() {
    $this->console_log("Importing the origin database into the destination database...\n {$this->migration_dir}/from-{$this->origin['name']}_to-{$this->destination['name']}_{$this->filename} ==> {$this->destination['db_name']}");
    $import_environment = "mysql -h {$this->destination['db_host']}  -u {$this->destination['db_user']} --password={$this->destination['db_pass']} {$this->destination['db_name']} <  {$this->migration_dir}/from-{$this->origin['name']}_to-{$this->destination['name']}_{$this->filename}";
    passthru($import_environment);
  }

  private function ackowledge_sync() {
    $this->console_log("Attempting to synchronize ".$this->arguments[0]." environment (source) with ".$this->arguments[1]." environment (target)...\n".$this->environments[$this->arguments[0]]['wp_home']." ==> ".$this->environments[$this->arguments[1]]['wp_home']);
    $synchronize_acknowledgement = readline("Continue? [y]es [n]o \n");
    if (in_array($synchronize_acknowledgement, $this->possible_yes)) return true;
    return false;
  }

  private function backup_destination_db() {
     $this->console_log("Backing up destination database...\n".$this->destination['db_name']." ==>  {$this->migration_dir}/{$this->destination['name']}-{$this->filename}");
     $backup_destination = "mysqldump -h {$this->destination['db_host']} -u {$this->destination['db_user']} --password={$this->destination['db_pass']} --skip-extended-insert --column-statistics=0 {$this->destination['db_name']} >  {$this->migration_dir}/{$this->destination['name']}-{$this->filename}";
     passthru($backup_destination);
  }

  private function dump_origin_db() {
    $this->console_log("Dumping contents of origin database...\n".$this->environments[$this->arguments[0]]['wp_home']." ==>  {$this->migration_dir}/{$this->origin['name']}-{$this->filename}");
    $dump_origin =        "mysqldump -h {$this->origin['db_host']}      -u {$this->origin['db_user']}       --password={$this->origin['db_pass']}      --skip-extended-insert --column-statistics=0 {$this->origin['db_name']} {$this->ignore_tables($this->origin['db_name'])}  >  {$this->migration_dir}/{$this->origin['name']}-{$this->filename}" ;
    passthru($dump_origin);
  }

  private function replace_origin_hostname() {
    $this->console_log("Finding all occurences of origin hostname within database and replacing with destination hostname...\n {$this->origin['pattern']} ==> {$this->destination['pattern']}");
    
    $replace_hostname =   "sed 's/{$this->origin['pattern']}/{$this->destination['pattern']}/g'  {$this->migration_dir}/{$this->origin['name']}-{$this->filename} >  {$this->migration_dir}/from-{$this->origin['name']}_to-{$this->destination['name']}_{$this->filename}";
    $replace_hostname_with_prefix =  "sed 's/http\:\/\/{$this->origin['pattern']}/https\:\/\/{$this->destination['pattern']}/g'   {$this->migration_dir}/{$this->origin['name']}-{$this->filename} >  {$this->migration_dir}/from-{$this->origin['name']}_to-{$this->destination['name']}_{$this->filename}";
          
    if($this->origin['name'] == "local") {
      // If migrating from localhost, change 'http' to 'https'
      passthru($replace_hostname_with_prefix);
    } else {
      passthru($replace_hostname);
    }
  }

  private function ignore_tables($db_name) {
    $ignored_tables = [
      '.wp_frm_item_metas',
      '.wp_frm_items',
      '.wp_itsec_bans',
      '.wp_itsec_dashboard_events',
      '.wp_itsec_distributed_storage',
      '.wp_itsec_fingerprints',
      '.wp_itsec_geolocation_cache',
      '.wp_itsec_lockouts',
      '.wp_itsec_logs',
      '.wp_itsec_mutexes',
      '.wp_itsec_opaque_tokens',
      '.wp_itsec_temp',
      '.wp_itsec_user_groups',
      '.wp_usermeta',
      '.wp_users'
    ];
    $ignore_statement = '';
    foreach($ignored_tables as $table) {
      $ignore_statement = $ignore_statement.' --ignore-table '.$db_name.$table;
    }
    return $ignore_statement;
  }

}

?>