import { randomUUID } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

// const axios = require('axios');

let sampleSession = {
  customer: randomUUID(),
  currency: "USD",
  amount_total: 1000,
  id: randomUUID(),
  display_items: [
    {
      custom: {
        name: "hello world 1",
      },
      amount: 100,
      quantity: 1,
    },
  ],
};
async function sendPurchaseEventToGtag(session: typeof sampleSession) {
  const endpoint = "https://www.google-analytics.com/mp/collect";
  const measurementId = "G-6RHP402FHF"; // Replace with your GA4 Measurement ID
  const apiSecret = "9szpHvEATzuVQxYABjP_yA"; // Replace with your Measurement Protocol Secret

  // Construct the payload
  const payload = {
    client_id: "123456", // Unique identifier for the user
    events: [
      {
        name: "subscription_completed",
        params: {
          title:"hello world 1",
          subscription_id:"1234567890",
          // currency: session.currency,
          // value: session.amount_total / 100, // Convert cents to dollars
          // transaction_id: session.id, // Use session ID as transaction ID
          // items: session.display_items.map(
          //   (item: (typeof sampleSession.display_items)[0]) => ({
          //     item_name: item.custom.name,
          //     price: item.amount / 100,
          //     quantity: item.quantity,
          //   })
          // ),
        },
      },
    ],
  };

  try {
    const response = await fetch(
      `${endpoint}?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );
    console.log(response);
    console.log("Purchase event sent successfully to GA4");
  } catch (error) {
    console.error("Error sending purchase event to GA4:", error);
  }
}

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {

//   if(req.method === 'POST'){

//     await sendPurchaseEventToGtag(sampleSession);
//         return res.status(200).json({ authenticated: true });
//   }
//   else{
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

// }

function getCid(){
  return randomUUID();
}


async function sendEventToGTM(url:string, payload:any, previewHeader:string) {
  try {
    // Validate inputs
    if (!url || !payload || !previewHeader) {
      throw new Error("Missing required parameters (url, payload, previewHeader).");
    }

    // Construct fetch request
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Gtm-Server-Preview": previewHeader,
      },
      body: JSON.stringify(payload),
    });

    // Handle response
    const responseBody = await response.text();
    if (!response.ok) {
      throw new Error(
        `Failed to send event. Status: ${response.status}, Response: ${responseBody}`
      );
    }

    console.log("Event successfully sent to GTM:", responseBody);
  } catch (error) {
    console.error("Error sending event to GTM:", error);
  }
}


const gtmUrl = "https://server-side-tagging-m7thogtwma-uc.a.run.app/g";
const previewHeader = "ZW52LTV8WEQ4Z2RnUG4wWDlUUzZlQ1ZUTEZ1QXwxOTNlNDkyYzVjZjQxZTI4MDJjZDI=";
const gtmPayload = {
  event: "subscription_completed",
  customer_id: "1234567890",
  plan_name: "Pro",
  amount: 100,
  currency: "USD",
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  const label = "Pro";
  const tid = "G-9L2Y115NQ3";
  const amount = 100;
  const currency = "USD";

  const cid = getCid();
  if (req.method === "POST") {
const response = await fetch(
  `https://server-side-tagging-gt5l76hovq-uc.a.run.app/g/collect?v=2&en=purchase&tid=${tid}&cid=${cid}&value=${amount}&label=${label}&currency=${currency}`
  
  , {
  // headers:{
  //   "x-gtm-server-preview":"ZW52LTZ8MTctSldCN0lCRDgxLUlSVkY3dFFkd3wxOTNlODUxNTIzOTZhMjgyN2E3MWM="
  // }
});

const text = await response.text();
    console.log(response, text);
    return res.status(200).json({ authenticated: true });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
