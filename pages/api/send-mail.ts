import type { NextApiRequest, NextApiResponse } from 'next';

const nodemailer = require('nodemailer');

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // create reusable transporter object using the default SMTP transport

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.NEXT_PUBLIC_HOST_EMAIL, // generated ethereal user
      pass: process.env.NEXT_PUBLIC_HOST_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let message = {
    from: process.env.NEXT_PUBLIC_HOST_EMAIL, // sender address
    to: `${req.body.email}`, // list of receivers
    subject: `Account: ${req.body.name} receiver Tick ✔`, // Subject line
    text: 'We are processing your request please wait for email response', // plain text body
    html: '<b>We are processing your request please wait for email response</b>', // html body
  };

  if (req.method === 'POST') {
    transporter.sendMail(message, (err: any, data: any) => {
      if (err) {
        console.log(err);
        res.status(500).json(err);
      } else {
        console.log('mail send');
        res.status(200).json('success');
      }
    });
  } else {
    res.status(200);
  }
}
