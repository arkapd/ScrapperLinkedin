#!/bin/bash
# 📂 Database Backup Script

BACKUP_DIR="/backups/db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="campus_portal"
RETENTION_DAYS=7

mkdir -p $BACKUP_DIR

# 1. Dump Database
pg_dump $DB_NAME > $BACKUP_DIR/backup_$TIMESTAMP.sql

# 2. Compress
gzip $BACKUP_DIR/backup_$TIMESTAMP.sql

# 3. Cleanup old backups
find $BACKUP_DIR -type f -name "*.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: backup_$TIMESTAMP.sql.gz"
