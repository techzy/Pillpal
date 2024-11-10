// Import modules using ES6 syntax
import { SerialPort } from 'serialport';
import { ReadlineParser } from '@serialport/parser-readline';
import db from './db.json' assert {type: 'json'};

import twilio from 'twilio';

const accountSid = 'AC8a366afeae435bd10863e1536ff2a692';
const authToken = 'a0c4a0667e45c3e8e18f6943f222d8ab';
const client = twilio(accountSid, authToken);

client.messages.create({
    body: ' Your lovedone/patient is missing his pills',
    messagingServiceSid: 'MG721d028d51134ddf3f0e80ecaffedaea',
    to: '+17809159714'
})

// Configure the serial port
const port = new SerialPort({
    path: "/dev/tty.usbmodem11201", // Make sure this matches your device's path
    baudRate: 9600,
});

// Set up the serial port parser
const parser = port.pipe(new ReadlineParser());

// Function to check if the time in db.json has passed
function checkIfTimePassed(prescriptionTime) {
    const now = new Date();
    const [prescriptionHour, prescriptionMinute] = prescriptionTime.split(':').map(Number);
    const prescriptionDate = new Date();
    prescriptionDate.setHours(prescriptionHour, prescriptionMinute, 0, 0);

    return now >= prescriptionDate;
}

// Function to continuously check if it’s time for each prescription
function startCheckingPrescriptions() {
    console.log('Checking perscriptions')
    setInterval(() => {
        const now = new Date();
        port.write('X')
        console.log(`Checking prescriptions at ${now.toLocaleTimeString()}`);

        db.prescriptions.forEach(prescription => {
            const { prescription: name, time } = prescription;

            if (checkIfTimePassed(time)) {
                console.log(`It's time for ${name} (or it has already passed).`);
                // Just checking connection
                
                
                // Send notification or command via serial port
                port.write(`Time for ${name}\n`, (err) => {
                    if (err) {
                        console.error('Error writing to serial port:', err.message);
                    } else {
                        console.log(`Notification sent for ${name}`);
                        port.write(name[0], (err) => {
                            if (err) {
                                console.error('Error writing to serial port:', err.message);
                            } else {
                                console.log('Sent "X" to the device.');
                            }
                        })
                    }
                });
            } else {
                console.log(`It's not time yet for ${name}.`);
            }
        });
    }, 60 * 1000); // Check every minute
}

// Function to continuously read data from the serial port
function startReadingSerialData() {
    console.log('Reading Data')

    parser.on("data", (line) => {
        console.log(`Received from serial: ${line}`);
        line == 65
        if(line == 65){
            console.log('ALERT')
            // .then(message => console.log(message.sid));
            client.messages.create({
                body: ' Your lovedone/patient is missing his pills',
                messagingServiceSid: 'MG721d028d51134ddf3f0e80ecaffedaea',
                to: '+17809159714'
            })
        }
        
        // Example of handling specific incoming messages
        if (line.trim() === "COMMAND RECEIVED") {
            console.log("Confirmed: Command received by the device.");
        }
    });
}

// Start both loops
startCheckingPrescriptions();
startReadingSerialData();
