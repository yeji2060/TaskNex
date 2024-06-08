const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// MongoDB Connect
const uri = 'mongodb+srv://tasknexdb:allusers@cluster0.zwemrru.mongodb.net/tasknexdb?retryWrites=true&w=majority&appName=Cluster0';

// Db Connect
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  console.log('Connected to MongoDB');
  
  // Events schema
  const eventsSchema = new mongoose.Schema({
    title: String,
    short_desc: String,
    details: String,
    submitted_by: String,
    submitted_at: String,
    status: String,
    due_date: String,
    priority: String,
    image_urls: String,
    last_updated: String
  });

  // Claims schema
  const claimsSchema = new mongoose.Schema({
    title: String,
    short_desc: String,
    details: String,
    submitted_by: String,
    submitted_at: String,
    status: String,
    due_date: String,
    priority: String,
    expense_amount: Number,
    comments: String,
    last_updated: String
  });

  // Define the Events_status_LogSchema schema
  const Events_status_LogSchema = new mongoose.Schema({
    title: String,
    short_desc: String,
    submitted_at: String,
    status: String
  });

  // Define the Claims_status_LogSchema schema
  const Claims_status_LogSchema = new mongoose.Schema({
    title: String,
    short_desc: String,
    submitted_at: String,
    status: String,
    expense_amount: Number
  });

  // Create the models
  const EventsIdea = mongoose.model('EventsIdea', eventsSchema);
  const Claims = mongoose.model('Claims', claimsSchema);
  const EventsLog = mongoose.model('EventsLog', Events_status_LogSchema);
  const ClaimsLog = mongoose.model('ClaimsLog', Claims_status_LogSchema);

  // Function to drop collections if they exist and then insert data
  const resetAndSeedCollection = async (model, data, collectionName) => {
    try {
      await model.collection.drop();
      console.log(`${collectionName} collection dropped`);
    } catch (err) {
      if (err.code === 26) {
        console.log(`${collectionName} collection does not exist`);
      } else {
        console.error(`Error dropping ${collectionName} collection:`, err);
        return;
      }
    }

    try {
      await model.insertMany(data);
      console.log(`${collectionName} collection seeded`);
    } catch (err) {
      console.error(`Error inserting into ${collectionName} collection:`, err);
    }
  };

  // Data to insert
  const eventsData = [
    { 
      title: 'Event 1', 
      short_desc: 'Short description of Event 1', 
      details: 'Detailed description of Event 1', 
      submitted_by: 'User A', 
      submitted_at: new Date().toISOString(), 
      status: 'Pending', 
      due_date: new Date().toISOString(), 
      priority: 'High', 
      image_urls: 'http://example.com/image1.jpg', 
      last_updated: new Date().toISOString() 
    },
    { 
      title: 'Event 2', 
      short_desc: 'Short description of Event 2', 
      details: 'Detailed description of Event 2', 
      submitted_by: 'User B', 
      submitted_at: new Date().toISOString(), 
      status: 'In Progress', 
      due_date: new Date().toISOString(), 
      priority: 'Medium', 
      image_urls: 'http://example.com/image2.jpg', 
      last_updated: new Date().toISOString() 
    },
    { 
      title: 'Event 3', 
      short_desc: 'Short description of Event 3', 
      details: 'Detailed description of Event 3', 
      submitted_by: 'User C', 
      submitted_at: new Date().toISOString(), 
      status: 'Completed', 
      due_date: new Date().toISOString(), 
      priority: 'Low', 
      image_urls: 'http://example.com/image3.jpg', 
      last_updated: new Date().toISOString() 
    }
  ];

  const claimsData = [
    { 
      title: 'Claim 1', 
      short_desc: 'Short description of Claim 1', 
      details: 'Detailed description of Claim 1', 
      submitted_by: 'User A', 
      submitted_at: new Date().toISOString(), 
      status: 'Pending', 
      due_date: new Date().toISOString(), 
      priority: 'High', 
      expense_amount: 1000, 
      comments: 'Comments for Claim 1', 
      last_updated: new Date().toISOString() 
    },
    { 
      title: 'Claim 2', 
      short_desc: 'Short description of Claim 2', 
      details: 'Detailed description of Claim 2', 
      submitted_by: 'User B', 
      submitted_at: new Date().toISOString(), 
      status: 'Approved', 
      due_date: new Date().toISOString(), 
      priority: 'Medium', 
      expense_amount: 500, 
      comments: 'Comments for Claim 2', 
      last_updated: new Date().toISOString() 
    },
    { 
      title: 'Claim 3', 
      short_desc: 'Short description of Claim 3', 
      details: 'Detailed description of Claim 3', 
      submitted_by: 'User C', 
      submitted_at: new Date().toISOString(), 
      status: 'Rejected', 
      due_date: new Date().toISOString(), 
      priority: 'Low', 
      expense_amount: 300, 
      comments: 'Comments for Claim 3', 
      last_updated: new Date().toISOString() 
    }
  ];

  const eventsLogData = [
    { 
      title: 'Event 1 Log', 
      short_desc: 'Short description of Event 1 Log', 
      submitted_at: new Date().toISOString(), 
      status: 'Pending' 
    },
    { 
      title: 'Event 2 Log', 
      short_desc: 'Short description of Event 2 Log', 
      submitted_at: new Date().toISOString(), 
      status: 'In Progress' 
    },
    { 
      title: 'Event 3 Log', 
      short_desc: 'Short description of Event 3 Log', 
      submitted_at: new Date().toISOString(), 
      status: 'Completed' 
    }
  ];

  const claimsLogData = [
    { 
      title: 'Claim 1 Log', 
      short_desc: 'Short description of Claim 1 Log', 
      submitted_at: new Date().toISOString(), 
      status: 'Pending', 
      expense_amount: 1000 
    },
    { 
      title: 'Claim 2 Log', 
      short_desc: 'Short description of Claim 2 Log', 
      submitted_at: new Date().toISOString(), 
      status: 'Approved', 
      expense_amount: 500 
    },
    { 
      title: 'Claim 3 Log', 
      short_desc: 'Short description of Claim 3 Log', 
      submitted_at: new Date().toISOString(), 
      status: 'Rejected', 
      expense_amount: 300 
    }
  ];

  // Reset and seed collections
  await resetAndSeedCollection(EventsIdea, eventsData, 'EventsIdea');
  await resetAndSeedCollection(Claims, claimsData, 'Claims');
  await resetAndSeedCollection(EventsLog, eventsLogData, 'EventsLog');
  await resetAndSeedCollection(ClaimsLog, claimsLogData, 'ClaimsLog');

  mongoose.connection.close();
});
