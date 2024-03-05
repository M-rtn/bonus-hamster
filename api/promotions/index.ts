import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as crypto from "crypto";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const date = context.bindingData.week;
    const cookies = req.headers.cookie?.split(";");
    const password = process.env.password;
    const decipher = crypto.createDecipher('aes-256-cbc', password);

    let acces_token = null;


    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name.trim() == context.bindingData.id) {
            acces_token = value.split("&")[0];
            break;
        }
    }

    if(acces_token){

    let decrypted = decipher.update(acces_token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const url = 'https://api.ah.nl/mobile-services/bonuspage/v1/choose-and-activate?bonusStartDate=' + date;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'authorization': 'Bearer ' + decrypted,
                'content-type': 'application/json',
            },
        });

        if (!response.ok) {
            throw {
                code: response.status,
                message: response.statusText
            }
        }

        const json = await response.json();

        context.res = {
            status: 200,
            body: json
        };

    } catch (error) {
        context.res = {
            status: error.code || 500,
            body: {error: error.message || "Network Error"}
        };
    };

    } else {
        context.res = {
            status: 404,
            body: {error: "Session Expired"}
        };
    }
}

export default httpTrigger;

