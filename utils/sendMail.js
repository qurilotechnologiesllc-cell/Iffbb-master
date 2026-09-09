import nodemailer from "nodemailer";

export const sendOtpMail = async (email, otp) => {

    console.log("Sending OTP email to:", email, "with OTP:", otp);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        },
    });


    const mailOptions = {
        from: process.env.SMTP_EMAIL,
        to: email,
        subject: "Password Reset OTP",
        html: `
      <div style="font-family: Arial; text-align:center;">
        <h2>Hi welcome to Qurilio Password Reset Request</h2>
        <p>Your OTP is:</p>
        <h1 style="color:#4CAF50;">${otp}</h1>
        <p>This OTP will expire in 5 minutes.</p>
      </div>
    `,
    };

    await transporter.sendMail(mailOptions);
};

export const sendThankYouMail = async (email, courseTitle, amount, currency) => {
    console.log("Sending purchase confirmation email to:", email);

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASS,
        },
    });

    const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency?.toUpperCase() || "USD",
    }).format(amount);

    const mailOptions = {
        from: `"IFBB" <${process.env.SMTP_EMAIL}>`,
        to: email,
        subject: `🎉 Congratulations! You purchased ${courseTitle}`,

        html: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Purchase Confirmation</title>
        </head>

        <body style="
            margin: 0;
            padding: 0;
            background-color: #f4f7fb;
            font-family: Arial, Helvetica, sans-serif;
        ">

            <div style="
                width: 100%;
                padding: 40px 0;
            ">

                <div style="
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
                ">

                    <!-- Header -->
                    <div style="
                        background: linear-gradient(135deg, #4f46e5, #7c3aed);
                        padding: 35px 25px;
                        text-align: center;
                    ">

                        <h1 style="
                            margin: 0;
                            color: #ffffff;
                            font-size: 28px;
                        ">
                            🎉 Congratulations!
                        </h1>

                        <p style="
                            margin: 10px 0 0;
                            color: #e9e7ff;
                            font-size: 16px;
                        ">
                            Your purchase was successful
                        </p>

                    </div>


                    <!-- Content -->
                    <div style="padding: 35px 30px;">

                        <p style="
                            margin: 0 0 15px;
                            color: #333333;
                            font-size: 17px;
                        ">
                            Hi there 👋,
                        </p>

                        <p style="
                            margin: 0 0 25px;
                            color: #555555;
                            font-size: 15px;
                            line-height: 1.7;
                        ">
                            Thank you for choosing <strong>IFBB</strong>.
                            We're excited to have you with us and can't wait
                            for you to start learning.
                        </p>


                        <!-- Course Card -->
                        <div style="
                            background-color: #f8f9ff;
                            border: 1px solid #e5e7eb;
                            border-radius: 10px;
                            padding: 25px;
                            margin-bottom: 25px;
                        ">

                            <p style="
                                margin: 0 0 8px;
                                color: #777777;
                                font-size: 13px;
                                text-transform: uppercase;
                                letter-spacing: 0.5px;
                            ">
                                Course Purchased
                            </p>

                            <h2 style="
                                margin: 0 0 20px;
                                color: #222222;
                                font-size: 21px;
                            ">
                                ${courseTitle}
                            </h2>


                            <div style="
                                border-top: 1px solid #e5e7eb;
                                padding-top: 15px;
                            ">

                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="
                                            color: #777777;
                                            font-size: 14px;
                                            padding: 6px 0;
                                        ">
                                            Amount Paid
                                        </td>

                                        <td style="
                                            color: #222222;
                                            font-size: 15px;
                                            font-weight: bold;
                                            text-align: right;
                                            padding: 6px 0;
                                        ">
                                            ${formattedAmount}
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="
                                            color: #777777;
                                            font-size: 14px;
                                            padding: 6px 0;
                                        ">
                                            Payment Status
                                        </td>

                                        <td style="
                                            color: #16a34a;
                                            font-size: 14px;
                                            font-weight: bold;
                                            text-align: right;
                                            padding: 6px 0;
                                        ">
                                            ✓ Paid
                                        </td>
                                    </tr>

                                </table>

                            </div>

                        </div>


                        <!-- Message -->

                        <div style="
                            background-color: #f0fdf4;
                            border-left: 4px solid #22c55e;
                            padding: 15px 18px;
                            margin-bottom: 30px;
                        ">

                            <p style="
                                margin: 0;
                                color: #166534;
                                font-size: 14px;
                                line-height: 1.6;
                            ">
                                🚀 You're all set! Your course is now available
                                in your Qurilio account. Start learning and
                                make the most of your new course.
                            </p>

                        </div>


                        <!-- CTA -->

                        <div style="text-align: center;">

                            <a href="${process.env.FRONTEND_URL}/my-courses"
                                style="
                                    display: inline-block;
                                    background-color: #4f46e5;
                                    color: #ffffff;
                                    text-decoration: none;
                                    padding: 14px 30px;
                                    border-radius: 7px;
                                    font-size: 15px;
                                    font-weight: bold;
                                ">
                                Start Learning →
                            </a>

                        </div>

                    </div>


                    <!-- Footer -->

                    <div style="
                        background-color: #f8f9fa;
                        padding: 25px;
                        text-align: center;
                        border-top: 1px solid #eeeeee;
                    ">

                        <p style="
                            margin: 0 0 8px;
                            color: #333333;
                            font-size: 14px;
                            font-weight: bold;
                        ">
                            Thank you for learning with Qurilio ❤️
                        </p>

                        <p style="
                            margin: 0;
                            color: #999999;
                            font-size: 12px;
                            line-height: 1.5;
                        ">
                            This is an automated purchase confirmation email.
                            Please do not reply to this email.
                        </p>

                    </div>

                </div>

            </div>

        </body>
        </html>
        `,
    };

    await transporter.sendMail(mailOptions);
};





