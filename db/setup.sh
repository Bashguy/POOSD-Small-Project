#!/bin/bash

source /home/bitnami/htdocs/.env
echo "Setting up database: $DB_NAME"

# Function to execute SQL file
execute_sql_file() {
    local sql_file=$1
    echo "Executing SQL file: $sql_file"
    mariadb -u "$DB_USER" -p$DB_PASS "$DB_NAME" < "$sql_file"
    if [ $? -eq 0 ]; then
        echo "SQL file executed successfully"
    else
        echo "Error executing SQL file"
        exit 1
    fi
}

# Function to check if database exists
database_exists() {
    mariadb -u "$DB_USER" -p$DB_PASS -e "USE $DB_NAME" 2>/dev/null
    return $?
}

SQL_FILE="/home/bitnami/htdocs/SQL/00_schema_init.sql"

# Main execution
if database_exists; then
    echo "Database $DB_NAME already exists. Updating schema..."
    execute_sql_file "$SQL_FILE"
else
    echo "Database $DB_NAME does not exist. Creating and initializing..."
    mariadb -u "$DB_USER" -p$DB_PASS -e "CREATE DATABASE $DB_NAME"
    execute_sql_file "$SQL_FILE"
fi

echo "Database management complete"