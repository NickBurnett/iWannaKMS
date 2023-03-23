// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import sendgrid from '@sendgrid/mail';
import qr from 'qrcode';

sendgrid.setApiKey(process.env.SENDGRID_API_KEY ?? '');

async function sendEmail(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send('Invalid email');
  }

  const qrcode = (await qr.toDataURL(email)).replace(
    'data:image/png;base64,',
    ''
  );
  const msg: sendgrid.MailDataRequired = {
    to: email,
    from: 'nicolas.burnett@acmutd.co',
    subject: 'Axxess Hackathon QR-code ID',
    text: "Hello,\n\nThank you for registering for the Axxess hackathon at UTD! Below is your unique QR-code for scan-ins such as check-in, events, food, and more!\n\nWe can't wait for you to join us. Happy hacking!\n\nBest,\nAxxess",
    attachments: [
      {
        content: qrcode,
        filename: 'qrcode.png',
      },
    ],
  };
  sendgrid.send(msg).catch((err) => console.log(err.response.body.errors));
  res.status(200).json({});
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    sendEmail(req, res);
  } else {
    res.status(405).json({});
  }
}