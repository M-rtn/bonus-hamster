import { AzureFunction, Context, HttpRequest } from "@azure/functions";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('HTTP trigger function processed a request.');
   var token = context.bindingData.token;
   const url = 'https://api.ah.nl/mobile-auth/v1/auth/token/refresh';


    var data = JSON.stringify({
        "refreshToken": token,
        "clientId": "appie"
      });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
            },
            body: data,
        });
        const text = await response.text();
        context.res = {
            status: 200,
            body: text
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: error.message
        };
    }
};

export default httpTrigger;