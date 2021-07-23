const sgMail = require("@sendgrid/mail");
const Mailgen = require("mailgen");
require("dotenv").config();

class EmailService {
  #sender = sgMail;
  #GenerateTemplate = Mailgen;

  #createTemlate(verifyToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: "default",
      product: {
        name: "Your Wallet",
        link: process.env.BACKEND_LINK,
      },
    });

    const email = {
      body: {
        name,
        intro:
          "Welcome to Your Private Wallet! We're very excited to have you on board.",
        action: {
          instructions:
            "To get started with Your Private Wallet, please click here:",
          button: {
            color: "#22BC66",
            text: "Confirm your account",
            link: `${process.env.BACKEND_LINK}api/users/verify/${verifyToken}`,
          },
        },
        outro:
          "Need help, or have questions? Just reply to this email, we'd love to help.",
      },
    };

    const emailBody = mailGenerator.generate(email);
    return emailBody;
  }

  async sendVerifyEmail(verifyToken, email, name) {
    const emailBody = this.#createTemlate(verifyToken, name);
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
      to: email, // Change to your recipient
      from: "contacts.api.noreply@gmail.com", // Change to your verified sender
      subject: "Send to verify your email on our service",
      html: emailBody,
    };

    await this.#sender.send(msg);
  }
}

module.exports = EmailService;
