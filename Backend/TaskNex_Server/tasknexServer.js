const express = require('express');
const TaskNexApp = express();
const dotenv = require('dotenv');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
const ObjectId = mongo.ObjectId
dotenv.config();
const MongoOnline = process.env.MongoOnline;
const cors = require('cors')
const bodyparser = require('body-parser');
const res = require('express/lib/response');
const port = process.env.PORT || 1111;
let db;



TaskNexApp.use(bodyparser.urlencoded({extended:true}));
TaskNexApp.use(bodyparser.json());
TaskNexApp.use(cors());
TaskNexApp.use(express());


TaskNexApp.get('/',(req,res)=>{
    res.send("Welcome to TaskNex by EA, Yeji and Victor")
})

//return all Tasks

TaskNexApp.get('/tasks', async (req, res) => {
    try {
      const tasks = await db.collection('tasks').find({}).toArray();
      res.json(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: 'Failed to fetch tasks' });
    }
  });

TaskNexApp.get('/getEventIdeas', (req,res)=> {
    let query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return EventIdeas wrt userId
    else if(req.query.user){
        let user = (req.query.user)
        query={userId:(user)}
    }

//return EventIdeas wrt department
    else if (req.query.userDept){
        let userDept=(req.query.userDept)
        query={'department':(userDept)}
    }

    db.collection('eventsideas').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

//return all Claims
TaskNexApp.get('/getClaims', (req,res)=> {
    let query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return Claims wrt userId
    else if(req.query.userClaims){
        let  userClaims = (req.query.userClaims)
        query={userId:(userClaims)}
    }

//return Claims wrt department
    else if (req.query.claimsByDept){
        let claimsByDept=(req.query.claimsByDept)
        query={'department':(claimsByDept)}
    }

    db.collection('claims').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


TaskNexApp.post('/insertEvent', async (req, res) => {
    const { taskType, title, priority, amount, due_date, short_desc, details, userId, submitted_by, status } = req.body;
  
    if (!taskType || !title || !priority || !due_date || !short_desc || !details || !userId || !submitted_by || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const newTask = {
      taskType,
      title,
      priority,
      amount,
      due_date: new Date(due_date),
      short_desc,
      details,
      userId,
      submitted_by,
      status,
      submitted_at: new Date(),
      last_updated: new Date(),
      image_urls: [],
      comments: []
    };
  
    try {
      const result = await db.collection('tasks').insertOne(newTask);
      res.json(result);
    } catch (error) {
      console.error("Error inserting event idea:", error);
      res.status(500).json({ error: 'Failed to insert event idea' });
    }
  });
  

  TaskNexApp.post('/expenseClaim', async (req, res) => {
    const { taskType, title, priority, amount, due_date, short_desc, details, userId, submitted_by, status } = req.body;
  
    if (!taskType || !title || !priority || !due_date || !short_desc || !details || !userId || !submitted_by || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  
    const newTask = {
      taskType,
      title,
      priority,
      amount,
      due_date: new Date(due_date),
      short_desc,
      details,
      userId,
      submitted_by,
      status,
      submitted_at: new Date(),
      last_updated: new Date(),
      image_urls: [],
      comments: []
    };
    try {
        const result = await db.collection('tasks').insertOne(newTask);
        res.json(result);
      } catch (error) {
        console.error("Error inserting expense claim:", error);
        res.status(500).json({ error: 'Failed to insert expense claim' });
      }
    });


    TaskNexApp.put('/updateTaskStatus/:id', async (req, res) => {
        const { id } = req.params;
        const { status } = req.body;
      
        if (!status) {
          return res.status(400).json({ error: 'Status is required' });
        }
      
        try {
          // Ensure the id is a valid ObjectId
          if (!ObjectId.isValid(id)) {
            console.error('Invalid task ID:', id);
            return res.status(400).json({ error: 'Invalid task ID' });
          }
      
          const result = await db.collection('tasks').updateOne(
            { _id: ObjectId(id) },
            { $set: { status: status, last_updated: new Date() } }
          );
      
          if (result.matchedCount === 0) {
            console.error('Task not found:', id);
            return res.status(404).json({ error: 'Task not found' });
          }
      
          res.json(result);
        } catch (error) {
          console.error("Error updating task status:", error);
          res.status(500).json({ error: 'Failed to update task status' });
        }
      });

      TaskNexApp.put('/editTask/:id', async (req, res) => {
        const { id } = req.params;
        const { taskType, title, priority, amount, due_date, short_desc, details, status } = req.body;
      
        try {
          if (!ObjectId.isValid(id)) {
            console.error('Invalid task ID:', id);
            return res.status(400).json({ error: 'Invalid task ID' });
          }
      
          const updateFields = {
            taskType,
            title,
            priority,
            amount,
            due_date: new Date(due_date),
            short_desc,
            details,
            status,
            last_updated: new Date()
          };
      
          const result = await db.collection('tasks').updateOne(
            { _id: ObjectId(id) },
            { $set: updateFields }
          );
      
          if (result.matchedCount === 0) {
            console.error('Task not found:', id);
            return res.status(404).json({ error: 'Task not found' });
          }
      
          res.json(result);
        } catch (error) {
          console.error("Error updating event:", error);
          res.status(500).json({ error: 'Failed to update event' });
        }
    });


TaskNexApp.delete('/delEvent/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Attempting to delete task with ID: ${id}`);
  
    try {
      // Ensure the id is a valid ObjectId
      if (!ObjectId.isValid(id)) {
        console.error('Invalid task ID:', id);
        return res.status(400).json({ error: 'Invalid task ID' });
      }
  
      const result = await db.collection('tasks').deleteOne({ _id: ObjectId(id) });
      console.log('Delete result:', result);
  
      if (result.deletedCount === 0) {
        console.error('Task not found:', id);
        return res.status(404).json({ error: 'Task not found' });
      }
  
      res.json(result);
    } catch (error) {
      console.error("Error deleting task:", error);
      res.status(500).json({ error: 'Failed to delete task' });
    }
  });
  
// View history of status changes

TaskNexApp.get('/getEventsStatusLog', (req,res)=> {
    let query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return events status log wrt title
    else if(req.query.eventsRequests){
        let eventsRequests = (req.query.eventsRequests)
        query={title:(eventsRequests)}
    }

    db.collection('eventslogs').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})

TaskNexApp.get('/getClaimsStatusLog', (req,res)=> {
    let query = {};
    console.log(req.query.id)
    if(req.query.id){
        query={_id:(req.query.id)}
    }
//return events status log wrt title
    else if(req.query.ClaimRequest){
        let ClaimRequest = (req.query.ClaimRequest)
        query={title:(ClaimRequest)}
    }

    db.collection('claimslogs').find(query).toArray((err,result) => {
        if(err) throw err;
        res.send(result)
    })
})


// Update events status log
TaskNexApp.post('/EventsStatusLogPost',(req,res)=>{
	console.log(req.body);
	db.collection('eventslogs').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send({message: 'A new log was added'}, result);
	})
})

// Update claims status log
TaskNexApp.post('/ClaimsStatusLogPost',(req,res)=>{
	console.log(req.body);
	db.collection('claimslogs').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send({message: 'A new log was added'}, result);
	})
})

// Aggregation query to get a single user's data with events and claims
TaskNexApp.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const result = await db.collection('users').aggregate([
            {
                $match: {
                    userId: userId
                }
            },
            {
                $lookup: {
                    from: "eventsIdeas",
                    let: { userId: "$userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$submitted_by", "$$userId"] } } },
                        { $project: { title: 1, short_desc: 1, due_date: 1, status: 1 } }
                    ],
                    as: "userEvents"
                }
            },
            {
                $lookup: {
                    from: "claims",
                    let: { userId: "$userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$submitted_by", "$$userId"] } } },
                        { $project: { title: 1, expense_amount: 1, status: 1, due_date: 1 } }
                    ],
                    as: "userClaims"
                }
            },
            {
                $unwind: {
                    path: "$userEvents",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$userClaims",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$userId",
                    fname: { $first: "$fname" },
                    lname: { $first: "$lname" },
                    email: { $first: "$email" },
                    phone: { $first: "$phone" },
                    department: { $first: "$department" },
                    role: { $first: "$role" },
                    events: { $push: "$userEvents" }, // Push events into an array
                    claims: { $push: "$userClaims" }  // Push claims into an array
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id field
                    userId: "$_id",
                    fname: 1,
                    lname: 1,
                    email: 1,
                    phone: 1,
                    department: 1,
                    role: 1,
                    events: 1,
                    claims: 1
                }
            }
        ]).toArray();

        res.json(result);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({message: 'Internal Server Error'});
        
    }
});


TaskNexApp.get('/usersWithEventsAndClaims', async (req, res) => {
    try {
        const result = await db.collection('users').aggregate([
            {
                $lookup: {
                    from: "events",
                    let: { userId: "$userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$submitted_by", "$$userId"] } } },
                        { $project: { title: 1, short_desc: 1, due_date: 1, priority: 1 } }
                    ],
                    as: "userEvents"
                }
            },
            {
                $lookup: {
                    from: "claims",
                    let: { userId: "$userId" },
                    pipeline: [
                        { $match: { $expr: { $eq: ["$submitted_by", "$$userId"] } } },
                        { $project: { title: 1, expense_amount: 1, status: 1, due_date: 1 } }
                    ],
                    as: "userClaims"
                }
            },
            {
                $unwind: {
                    path: "$userEvents",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $unwind: {
                    path: "$userClaims",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $group: {
                    _id: "$userId",
                    fname: { $first: "$fname" },
                    lname: { $first: "$lname" },
                    email: { $first: "$email" },
                    phone: { $first: "$phone" },
                    department: { $first: "$department" },
                    role: { $first: "$role" },
                    events: { $push: "$userEvents" }, // Push events into an array
                    claims: { $push: "$userClaims" }  // Push claims into an array
                }
            },
            {
                $project: {
                    _id: 0, // Exclude _id field
                    userId: "$_id",
                    fname: 1,
                    lname: 1,
                    email: 1,
                    phone: 1,
                    department: 1,
                    role: 1,
                    events: 1,
                    claims: 1
                }
            }
        ]).toArray();

        res.json(result);
    } catch (err) {
        console.error("Error:", err);
        res.status(500).send({message: 'Internal Server Error'});
    }
});




MongoClient.connect(MongoOnline, (err, client) => {
    if(err) console.log("error while connecting");
    db = client.db('tasknexdb');
    TaskNexApp.listen(port, '0.0.0.0',()=>{
        console.log(`listening on port ${port}`)
    })
})
