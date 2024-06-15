const express = require('express');
const TaskNexApp = express();
const dotenv = require('dotenv');
const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;
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

// Create a event
TaskNexApp.post('/insertEvent',(req,res)=>{
	console.log(req.body);
	db.collection('eventsideas').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("A new event was created", result);
	})
})

// Create an Expense Claim
TaskNexApp.post('/expenseClaim',(req,res)=>{
	console.log(req.body);
	db.collection('claims').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("A new event was created", result);
	})
})


//Edit a user's event
TaskNexApp.put('/editEvent/:id',(req,res)=>{
    console.log(req.params.id);
    let id = (req.params.id)
    db.collection('eventsideas').updateOne(
        {_id:id},
        {
            $set: {
                title:req.body.title,
                short_desc:req.body.short_desc,
                details:req.body.details,
                submitted_by:req.body.submitted_by,
                submitted_at:req.body.submitted_at,
                status:req.body.status,
                due_date:req.body.due_date,
                priority:req.body.priority,
                image_urls:req.body.image_urls,
                comments:req.body.comments,
                last_updated:req.body.last_updated

                    
            }
        },
        
    )
    res.send('event updated')      
  
})


//Edit a user's Expense Claim
TaskNexApp.put('/editClaim/:id',(req,res)=>{
    console.log(req.params.id);
    let id = (req.params.id)
    db.collection('claims').updateOne(
        {_id:id},
        {
            $set: {
                title:req.body.title,
                short_desc:req.body.short_desc,
                details:req.body.details,
                submitted_by:req.body.submitted_by,
                submitted_at:req.body.submitted_at,
                status:req.body.status,
                due_date:req.body.due_date,
                priority:req.body.priority,
                expense_amount:req.body.expense_amount,
                comments:req.body.comments,
                last_updated:req.body.last_updated

                    
            }
        },
        
    )
    res.send('claims updated')      
  
})

//delete an Event
TaskNexApp.delete('/delEvent/:id',(req,res)=>{
    let id = req.params.id
    db.collection('eventsideas').deleteOne(
        {_id:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})

//delete a Claim
TaskNexApp.delete('/delClaim/:id',(req,res)=>{
    let id = req.params.id
    db.collection('claims').deleteOne(
        {_id:id},(err,result)=>{
        if(err) throw err;
        res.send(result)
    })
})


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
		res.send("A new log was added", result);
	})
})

// Update claims status log
TaskNexApp.post('/ClaimsStatusLogPost',(req,res)=>{
	console.log(req.body);
	db.collection('claimslogs').insertOne(req.body,(err,result)=>{
		if(err) throw err;
		res.send("A new log was added", result);
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
        res.status(500).send("Internal Server Error");
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
        res.status(500).send("Internal Server Error");
    }
});




MongoClient.connect(MongoOnline, (err, client) => {
    if(err) console.log("error while connecting");
    db = client.db('tasknexdb');
    TaskNexApp.listen(port, '0.0.0.0',()=>{
        console.log(`listening on port ${port}`)
    })
})
