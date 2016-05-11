#NodeExpressPsql

./config/config.json is in .gitignore, add your own, mine looks like this

{
  "development": {
    "username": "your user",
    "password": "your password",
    "database": "your db",
    "host": "127.0.0.1",
    "dialect": "postgres",
    "logging": false
  },
  "test": {
    "username": null,
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "postgres"
  },
  "production": {
    "username": null,
    "password": null,
    "database": "database_production",
    "host": "127.0.0.1",
    "dialect": "postgres"
  }
}