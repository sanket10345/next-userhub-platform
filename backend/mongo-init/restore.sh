#!/bin/sh
set -e

# Start MongoDB in background, wait for readiness
mongod --bind_ip_all --dbpath /data/db --logpath /tmp/mongod.log --logappend &

# Wait until Mongo is ready
echo "⏳ Waiting for MongoDB to be ready..."
until mongo --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 1
done

# Check if DB already has data
EXISTING_DATA=$(mongo usersdb --quiet --eval "db.getCollectionNames().length")

if [ "$EXISTING_DATA" -eq 0 ]; then
  echo "🔄 No data found. Restoring from dump..."
  mongorestore --drop --db usersdb /dump/usersdb
  echo "✅ Restore complete."
else
  echo "✔️  Data already present. Skipping restore."
fi

# Stop mongod gracefully
echo "🛑 Shutting down MongoDB..."
mongo admin --eval "db.shutdownServer()"

# Start MongoDB normally
echo "🚀 Starting MongoDB (foreground)..."
exec /usr/local/bin/docker-entrypoint.sh mongod --bind_ip_all
