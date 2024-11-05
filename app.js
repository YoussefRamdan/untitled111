// إضافة مكتبة للتحقق من التوقيت
const { exec } = require('child_process');

// تحقق من تزامن التوقيت
exec('date', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error fetching system time: ${error.message}`);
        return;
    }
    console.log(`Current system time: ${stdout}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');
const app = express();
const PORT = 3000;

// إعداد Firebase
const serviceAccount = require(path.join(__dirname, 'credentials.json'));

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

app.use(bodyParser.json());

// البيانات الخاصة بالإشعار
app.post('/sendNotification/', async (req, res) => {
    const { title, message, token } = req.body;

    console.log("Received request:", req.body); // تأكد من الطباعة للطلب المستلم

    const messagePayload = {
        data: {
            title: title,
            message: message,
        },
        token: token,
    };

    try {
        await admin.messaging().send(messagePayload);
        console.log("Notification sent successfully"); // تأكيد نجاح الإرسال
        res.status(200).send('Notification sent successfully');
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).send(`Failed to send notification: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
