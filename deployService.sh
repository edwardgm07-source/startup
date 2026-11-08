#!/bin/bash

set -e

while getopts k:h:s: flag
do
    case "${flag}" in
        k) key=${OPTARG};;
        h) hostname=${OPTARG};;
        s) service=${OPTARG};;
    esac
done

if [[ -z "$key" || -z "$hostname" || -z "$service" ]]; then
    printf "\nMissing required parameter.\n"
    printf "  syntax: deployService.sh -k <pem key file> -h <hostname> -s <service>\n\n"
    exit 1
fi

printf "\n----> Deploying $service to $hostname with $key\n"

# Build the frontend and service distribution.
printf "\n----> Building the distribution package\n"

rm -rf build
rm -rf dist

npm install
npm run build

mkdir -p build/public

cp -rf dist/* build/public/
cp service/index.js build/
cp service/package.json build/
cp service/package-lock.json build/

# Clear the previous production deployment.
printf "\n----> Clearing the previous deployment\n"

ssh -i "$key" ubuntu@$hostname << ENDSSH
set -e

rm -rf "services/${service}"
mkdir -p "services/${service}"
ENDSSH

# Copy the frontend and backend to AWS.
printf "\n----> Copying the distribution package\n"

scp -r -i "$key" build/* ubuntu@$hostname:services/$service

# Install production dependencies and restart the service.
printf "\n----> Starting the production service\n"

ssh -i "$key" ubuntu@$hostname << ENDSSH
set -e

export NVM_DIR="\$HOME/.nvm"
source "\$NVM_DIR/nvm.sh"

cd "services/${service}"
npm install --omit=dev

if pm2 describe "${service}" > /dev/null 2>&1; then
    NODE_ENV=production pm2 restart "${service}" --update-env
else
    NODE_ENV=production pm2 start index.js --name "${service}"
fi

pm2 save
ENDSSH

# Remove local deployment files.
printf "\n----> Removing the local distribution package\n"

rm -rf build
rm -rf dist

printf "\n----> Deployment complete\n"