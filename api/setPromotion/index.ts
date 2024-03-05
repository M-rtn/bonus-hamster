import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import * as crypto from "crypto";


const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const cookies = req.headers.cookie?.split(";");
    const offerId = req.body.offerId;
    const segmentId = req.body.segmentId
    const offerStartDate = req.body.offerStartDate;

    let acces_token = null;


    for (const cookie of cookies) {
        const [name, value] = cookie.split("=");
        if (name.trim() == context.bindingData.id) {
            acces_token = value.split("&")[0];
            break;
        }
    }

    if(acces_token){

    const url = `https://api.ah.nl/mobile-services/bonuspage/v1/activate/${offerId}`;
    const raw = `segmentId=${segmentId}&startDate=${offerStartDate}`

    const password = process.env.password;
    const decipher = crypto.createDecipher('aes-256-cbc', password);

    let decrypted = decipher.update(acces_token, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
               'authorization': `Bearer ${decrypted}`,
                'content-type': "application/x-www-form-urlencoded; charset=utf-8",
            },
            body: raw
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
            body: error.message || 'Internal Server Error: Something went wrong on the server.' ,
        };
    }
} else {
    context.res = {
        status: 404,
        body: {error: "Session Expired"}
    };
}
};

export default httpTrigger;