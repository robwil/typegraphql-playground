import * as fs from 'fs';

export = {
    "name": "default",
    "type": "cockroachdb",
    "host": "free-tier.gcp-us-central1.cockroachlabs.cloud",
    "port": 26257,
    "database": "clumsy-orca-4695.typegraphql_example",
    "username": "typegraphql_app",
    "password": process.env.TYPEORM_PASSWORD,
    "synchronize": true,
    "logging": true,
    "entities": [
        "src/entity/*.*"
    ],
    ssl: {
        ca: fs.readFileSync('certs/cockroach.crt').toString()
    }
};