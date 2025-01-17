#!/bin/bash

# Check if pod name is provided
if [ -z "$1" ]; then
    echo "Usage: $0 <pod_name>"
    exit 1
fi

POD_NAME=$1

# Stop the pod
podman pod stop $POD_NAME

# Remove the pod and its containers
podman pod rm $POD_NAME --force

echo "Pod '$POD_NAME' and its containers have been removed."