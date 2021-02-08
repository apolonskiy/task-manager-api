const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andriy.polonskiy@gmail.com',
        subject: 'Welcome to Task Manager App!',
        text: `Welcome ${name} to the app!. Let me know how you get along.`
    })
}

const sendCanelEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'andriy.polonskiy@gmail.com',
        subject: `Sorry to hear about your leave ${name}!`,
        text: `Would you be so kind to give us your feedback about the app and reason why you left it?`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCanelEmail
}