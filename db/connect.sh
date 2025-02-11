source /home/bitnami/htdocs/.env

mariadb -u $DB_USER -p$DB_PASS "$DB_NAME"