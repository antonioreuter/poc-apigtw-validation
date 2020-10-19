# Executing Component Tests locally

## Launching localstack
```
docker-compose up
```

## Launching localstack on OSX
```
TMPDIR=/private$TMPDIR docker-compose up
```

## Stopping localstack docker-compose
```
ctrl + C
```


## Define the environment variables

```
export NODE_ENV=dev
export STAGE=$NODE_ENV
export AWS_DEFAULT_REGION=us-east-1
```

# Deploying in the local environment

## Deploy the dynamodb tables

Note: Unfortunately, at this moment localstack has a bug to deploy on demand tables. For that reason we need to keep a local copy of `Source/fws-infra/db/fws-dynamodb-tables.yaml` with the **Provisioned Capacity**.

**Issue Ref.:** https://github.com/localstack/localstack/issues/1737

```
sh dev_environment_infrastructure.sh
```

## Deploy the fws-api component
```
npm run deploy:dev
```

# Insert data in dynamodb via seed files
```
npm run seed:dev
```

# Start the application locally
```
npm run start:dev
```

# AWS useful commands
## List tables
```
aws --endpoint http://localhost:4566 dynamodb list-tables
```

## List all records
```
aws --endpoint http://localhost:4566 dynamodb scan --table-name <table_name>
```
