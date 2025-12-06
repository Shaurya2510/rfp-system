require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");
const rfpRoutes = require('./routes/rfp');
const vendorRoutes = require('./routes/vendors');
const emailRoutes = require('./routes/emails');
const proposalRoutes = require('./routes/proposals');
const { checkInbox } = require('./imapService');
const comparisonRoutes = require("./routes/comparison");


const app = express();
app.use(cors({
    origin: "http://localhost:5173",
}));


app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.use('/api/vendors', vendorRoutes);
app.use('/api/rfps', rfpRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/proposals', proposalRoutes);
app.use("/api/comparison", comparisonRoutes);


app.get('/', (req, res) => {
    res.send('RFP backend is running!');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
    console.log("Starting IMAP inbox watcher...");
});

// Run IMAP inbox checker every 30 seconds
setInterval(() => {
    console.log("Checking Gmail inbox...");
    checkInbox().catch(err => console.error("IMAP error:", err));
}, 30000);
