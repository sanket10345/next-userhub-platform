#!/bin/sh
set -e

echo "⏳ Starting central MongoDB restore process..."

# Start MongoDB in background (fork mode)
mongod --fork --bind_ip_all --dbpath /data/db --logpath /tmp/mongod.log

echo "⏳ Waiting for MongoDB to be ready..."
until mongo --eval "db.adminCommand('ping')" >/dev/null 2>&1; do
  sleep 1
done

echo "🔍 Checking if 'usersdb' already has data..."
EXISTING_DATA=$(mongo usersdb --quiet --eval "db.getCollectionNames().length")

if [ "$EXISTING_DATA" -eq 0 ]; then
  echo "🔄 No data found. Restoring from dump..."
  mongorestore --drop --db usersdb /dump/usersdb
  echo "✅ Dump restore complete."
else
  echo "✔️  Data already present. Skipping restore."
fi

echo "🛑 Shutting down temporary MongoDB process..."
mongo admin --eval "db.shutdownServer()"

echo "🚀 Starting MongoDB in foreground..."
exec /usr/local/bin/docker-entrypoint.sh mongod --bind_ip_all