const sendEmail = require("./sendMail");

const sendBookingConfirmation = async (customer, booking,event) => {
  const subject = "Booking Confirmation - Event";
  const message = `
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                border-radius: 8px;
            }
            .greeting {
                font-size: 24px;
                color: #4CAF50;
                margin-bottom: 15px;
            }
            .details {
                font-size: 16px;
                line-height: 1.5;
            }
            .details span {
                font-weight: bold;
            }
            .calendar-link {
                display: inline-block;
                margin-top: 20px;
                background-color: #4285F4;
                color: white;
                padding: 10px 20px;
                text-decoration: none;
                border-radius: 5px;
            }
            .calendar-link:hover {
                background-color: #3367D6;
            }
            @media screen and (max-width: 600px) {
                .container {
                    padding: 15px;
                }
                .greeting {
                    font-size: 20px;
                }
                .details {
                    font-size: 14px;
                }
            }
        </style>
        <title>Booking Confirmation</title>
    </head>
    <body>
        <div class="container">
            <div class="greeting">
                Hello ${booking.name},<br><br>
                Thank you for booking with us! Here are the details of your booking:
            </div>
            <div class="details">
                <span>Event:</span> ${event.title}<br>
                <span>Date:</span> ${event.date}<br>
                <span>Location:</span> ${event.location}<br><br>
                We look forward to hosting you!
            </div>
            <a class="calendar-link" href="https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
              event.title
            )}&dates=${encodeURIComponent(
    event.date
  )}T090000Z/${encodeURIComponent(
    event.date
  )}T100000Z&details=Join+us+for+the+event+at+${encodeURIComponent(
    event.location
  )}" target="_blank">
                Add to Google Calendar
            </a>
        </div>
    </body>
    </html>
  `;

  await sendEmail({
    email: customer.email,
    subject,
    message,
    isHtml: false,
  });
};

module.exports = { sendBookingConfirmation };
