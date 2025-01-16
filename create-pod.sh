#!/bin/bash
# Author: [Shyam Sunder]
# Purpose: Create a pod with a three containers

echo "Creating a pod with three containers"
echo "-------------------------------------"
echo "Create a pod with name shortify_pod"

podman pod create --name shortify_pod -p 3000:3000 -p 5432:5432 -p 6379:6379

echo "Pod created successfully"
podman pod list
echo "-------------------------------------"

echo "Creating a container for redis with name redis"
podman run --pod shortify_pod -d --name redis redis
redis_container_id=$(podman ps | grep redis | awk '{print $1}')
echo "Container created successfully with container ID: $redis_container_id"
podman ps
echo "-------------------------------------"

echo "Creating a container for postgres with name postgres"
podman run --pod shortify_pod -e POSTGRES_USER=flanker -e POSTGRES_PASSWORD=flanker -e POSTGRES_DB=url_shortner -d --name postgres postgres
postgres_container_id=$(podman ps | grep postgres | awk '{print $1}')
echo "Container created successfully with container ID: $postgres_container_id"
podman ps
echo "-------------------------------------"

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready"
until podman exec $postgres_container_id pg_isready -U flanker; do
    echo "PostgreSQL is not ready yet. Waiting..."
    sleep 2
done
echo "PostgreSQL is ready"
echo "-------------------------------------"

echo "Creating a container for shortify with name shortify"
podman build -t shortify .
echo "Build successful"
podman run --pod shortify_pod -d --name shortify shortify
shortify_container_id=$(podman ps | grep shortify | awk '{print $1}')
echo "Container created successfully with container ID: $shortify_container_id"
podman ps
echo "-------------------------------------"

echo "Container ID of shortify is $shortify_container_id"
echo "Waiting for a few seconds to ensure the database is ready"
sleep 10
echo "Run DB migrations"
podman exec -it $shortify_container_id npm run migration:run
echo "DB migrations run successfully"
echo "-------------------------------------"