import * as nodemailer from 'nodemailer';
import gmailConfig from '../config/gmail.config';

let mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: gmailConfig.user,
    pass: gmailConfig.pass,
  },
});

const sendMailWithLink = (receiver: string, subject: string, text: string, linkText: string, linkUrl: string) => {
  const html = `
      <p>${text}</p>
      <p><a href="${linkUrl}" target="_blank">${linkText}</a></p>
    `;

  const mailOptions = {
    from: gmailConfig.user,
    to: receiver,
    subject: subject,
    html: html,
  };

  mailTransport.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

const sendMail = (to: string, subject: string, text: string) => {
  const details = {
    from: gmailConfig.user,
    to: to,
    subject: subject,
    text: text,
  };
  mailTransport.sendMail(details, (error: any) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Mail sent successfully');
    }
  });
};

export const gmailService = {
  sendMail,
  sendMailWithLink,
};
