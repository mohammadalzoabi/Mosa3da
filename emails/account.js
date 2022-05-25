const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: "mosa3da.com@gmail.com",
      subject: "Welcome to Mosa3da",
      html: `
      
      <!DOCTYPE html>
      <html lang="en">
      <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
      </head>
      <body style="color: black">
               <h3>Hello ${name},</h3>

               We are <strong>Mosa3da</strong> team and we would like to thank you for signing up to our service.<br><br>

               We would love to hear what you think of <strong>Mosa3da</strong> and if there is anything we can improve. If you have any questions, please reply to this email. We are always happy to help!<br><br>

               Thank you,<br>
               <strong>Mosa3da Team</strong>
      </body>
      </html>
      `,
    })
    .then(() => {
      console.log("Welcome Email has been sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendResetPasswordEmail = (email, name, link) => {
  sgMail
    .send({
      to: email,
      from: "mosa3da.com@gmail.com",
      subject: "Mosa3da Account Reset Password",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
      </head>
      <body style="color: black">
           <h3>Hello ${name},</h3>
         
           <h4>
               Here is your link to reset your Mosa3da account password:
               <a href="${link}">Click Here</a>
           </h4>

           Thank you,<br>
           <strong>Mosa3da Team</strong>
      </body>
      </html>
         `,
    })
    .then(() => {
      console.log("Reset Password Email has been sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

const sendJoinUsEmail = (email, name) => {
     sgMail
    .send({
      to: email,
      from: "mosa3da.com@gmail.com",
      subject: "Mosa3da Received Your Application!",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
      </head>
      <body style="color: black">
           <h3>Hello ${name},</h3>
         
           <h4>
               Your application to join Mosa3da has been submitted successfully, Our team will review the application and contact you as soon as possible.
           </h4>

           Thank you,<br>
           <strong>Mosa3da Team</strong>
      </body>
      </html>
         `,
    })
    .then(() => {
      console.log("Join us Email has been sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

const sendJoinUsApprovalEmail = (email, name) => {
     sgMail
    .send({
      to: email,
      from: "mosa3da.com@gmail.com",
      subject: "Welcome to Mosa3da Team!",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
      </head>
      <body style="color: black">
           <h3>Hello ${name},</h3>
         
           <h4>
               Congratulations! Your application to join Mosa3da has been Accepted. Our team has reviewed your application and we see you qualified.
               <br>
               Please <a href="http://localhost:5000/forgot-password">reset your password</a> to be able to sign in to your account.
           </h4>

           Thank you,<br>
           <strong>Mosa3da Team</strong>
      </body>
      </html>
         `,
    })
    .then(() => {
      console.log("Approval Email has been sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

const sendJoinUsRejectionEmail = (email, name) => {
     sgMail
    .send({
      to: email,
      from: "mosa3da.com@gmail.com",
      subject: "Joining Mosa3da Result",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
      </head>
      <body style="color: black">
           <h3>Hello ${name},</h3>
         
           <h4>
               Your application to join Mosa3da has been reviewed by our team. We are sorry to tell you that your application did not meet the criteria of Mosa3da.
           </h4>

           Thank you,<br>
           <strong>Mosa3da Team</strong>
      </body>
      </html>
         `,
    })
    .then(() => {
      console.log("Rejection Email has been sent");
    })
    .catch((error) => {
      console.error(error);
    });
}

const sendAppointmentToTherapistEmail = (therapistEmail, therapistName, patientName, date, duration) => {
     sgMail
    .send({
      to: therapistEmail,
      from: "mosa3da.com@gmail.com",
      subject: "Appointment booked!",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
      </head>
      <body style="color: black">
           <h3>Hello ${therapistName},</h3>
         
           <h4>
               Your Appointment on <strong>${date}</strong> has been booked by <strong>${patientName}</strong>.
           </h4>

           <h4>Duration of appointment: ${duration}</h4>

           Thank you,<br>
           <strong>Mosa3da Team</strong>
      </body>
      </html>
         `,
    })
    .then(() => {
      console.log("Appointment booking details Email has been sent to therapist.");
    })
    .catch((error) => {
      console.error(error);
    });
}

const sendAppointmentToPatientEmail = (email, name, therapistName, date, duration) => {
     sgMail
    .send({
      to: email,
      from: "mosa3da.com@gmail.com",
      subject: "Appointment booked!",
      html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
           <meta charset="UTF-8">
           <meta http-equiv="X-UA-Compatible" content="IE=edge">
           <meta name="viewport" content="width=device-width, initial-scale=1.0">
           <title>Document</title>
      </head>
      <body style="color: black">
           <h3>Hello ${name},</h3>
         
           <h4>
               Your Appointment on <strong>${date}</strong> has been booked with <strong>${therapistName}</strong>.
           </h4>

           <h4>Duration of appointment: ${duration}</h4>

           Thank you,<br>
           <strong>Mosa3da Team</strong>
      </body>
      </html>
         `,
    })
    .then(() => {
      console.log("Appointment booking details Email has been sent to patient.");
    })
    .catch((error) => {
      console.error(error);
    });
}


module.exports = {
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendJoinUsEmail,
  sendJoinUsApprovalEmail,
  sendJoinUsRejectionEmail,
  sendAppointmentToTherapistEmail,
  sendAppointmentToPatientEmail
};
