import * as hikes from './hikes_model.mjs';
import express from 'express';
const app = express();

const PORT = 3040;

/**
 * Create a new hike with the zipcode, name, length, difficulty and topFive provided in the query parameters
 */
app.get("/create", (req, res) => {
    console.log(req.query);
    hikes.createHike(req.query.zipcode, req.query.name, req.query.length, req.query.difficulty, req.query.topFive)
        .then(hike => {
            res.send(hike);
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

/**
 * Retrive hikes. 
 * If the query parameters include one parameter, then only the hikes with that parameter are returned.
 * Otherwise, all hikes are returned.
 */
let counttot = 0; // this variable will count total retrieve requests
let countzer = 0; // this variable will count retrieve requests with zero query parameters
let countpar = 0; // this variable counts the retrieve requests with at least one parameter

app.use("/retrieve", (req, res, next) => {
    if (req.query._id === undefined
        && req.query.zipcode === undefined
        && req.query.name === undefined
        && req.query.length === undefined
        && req.query.difficulty === undefined
        && req.query.topFive === undefined ) {
            countzer += 1;
        }
    counttot += 1;
    countpar = counttot - countzer

    if (counttot % 10 === 0) {
        console.log(`Total retrieval requests = ${counttot}, the total with query parameters = ${countpar} and the total with no query parameters = ${countzer}.`)
    };
    next();
});

app.get("/retrieve", (req, res) => {
    console.log(req.query);
    // Is there a query parameter named _id, zipcode, name, length, difficulty or topFive? If so add a filter based on its value.
    let filter = {}
    if (req.query._id !== undefined) {
        filter = { _id: req.query._id};
    } else if (req.query.zipcode !== undefined) {
        filter = { zipcode: req.query.zipcode};
    } else if (req.query.name !== undefined) {
        filter = { name: req.query.name};
    } else if (req.query.length !== undefined) {
        filter = { length: req.query.length}; 
    } else if (req.query.difficulty !== undefined) {
        filter = { difficulty: req.query.difficulty};
    } else if (req.query.topFive !== undefined) {
        filter = { topFive: req.query.topFive};
    }

    hikes.findHikes(filter, '', 0)
        .then(hikes => {
            console.log(hikes)
            res.send(hikes);
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
   // next();
});




/**
 * Update the hike whose _id and one or more other parameters is provided and set its zipcode, name, length, difficulty and topFive to
 * the values provided in the query parameters or keep as is if not provided
 */
app.get("/update", (req, res) => {
    console.log(req.query);
    let filter = ({});
    if (req.query.zipcode !== undefined) {
        filter.zipcode = req.query.zipcode; 
    }
    if (req.query.name !== undefined) {
        filter.name = req.query.name;
    } 
    if (req.query.length !== undefined) {
        filter.length = req.query.length; 
    } 
    if (req.query.difficulty !== undefined) {
        filter.difficulty = req.query.difficulty;
    }
    if (req.query.topFive !== undefined) {
        filter.topFive = req.query.topFive;
    }

    hikes.updateHike( req.query._id, filter)
        .then(updateCount => {
            console.log(updateCount);
            res.send({ updateCount: updateCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Not found' });
        });
});

/**
 * Delete the hike whose _id is provided in the query parameters
 */
app.get("/delete", (req, res) => {
    console.log(req.query);
    let filter = {}
    if (req.query._id !== undefined) {
        filter = { _id: req.query._id};
    } else if (req.query.zipcode !== undefined) {
        filter = { zipcode: req.query.zipcode};
    } else if (req.query.name !== undefined) {
        filter = { name: req.query.name};
    } else if (req.query.length !== undefined) {
        filter = { length: req.query.length};
    } else if (req.query.difficulty !== undefined) {
        filter = { difficulty: req.query.difficulty}; 
    } else if (req.query.topFive !== undefined) {
        filter = { topFive: req.query.topFive};
    }

    hikes.deleteByParam(filter)
        .then(deletedCount => {
            console.log(deletedCount);
            res.send({ deletedCount: deletedCount });
        })
        .catch(error => {
            console.error(error);
            res.send({ error: 'Request failed' });
        });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});