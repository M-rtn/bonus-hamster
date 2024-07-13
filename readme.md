
# Onpersoonlijke Bonus App [inactive]

This web app allows you to host as many bonuscards as you can create. With a simple mobile friendly view you can scroll through your cards and select the one which gives you the most Bonus!


![sample](https://github.com/M-rtn/bonus-hamster/assets/19554624/50f4398c-f736-4893-8372-74b16d8d845a)
![sample_1](https://github.com/M-rtn/bonus-hamster/assets/19554624/3795730f-fb8a-4fd4-85eb-06cbc2f372f8)


## How does it work?


It piggybacks on the authentication that is used on the Albert Heijn mobile app. The refresh token is stored in Cosmos DB and refreshed every 2 hours with an Azure function and encrypted and stored in a Cosmos DB.

On connecting with the Web App, the encrypted access token is retrived and an API proxy is used to decrypt and fetch records from Albert Heijn.

#### What have you used?

- Postman Proxies to reverse engineer the Albert Heijn API's
- Azure Static Web App with VUE 
- Azure Functions using Typescript
- Azure CosmosDB for storage
- Azure Runbook for Cost Management

### How do I use it?

Currently the repository is not configured in such a way that it is easily ran it's unlikely that this will change in the near future.

