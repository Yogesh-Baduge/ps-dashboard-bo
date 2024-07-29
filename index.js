const helper = require('./_tools/helpers');
const mongoose = require('mongoose');
function generateGUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return `${s4()}-${s4()}-${s4()}`;
}

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/myapp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Client API endpoints
const clientSchema = new mongoose.Schema({
    name: String,
    guid: String,
    info: String,
    created: Date,
    modified: Date
});

const Client = mongoose.model('Client', clientSchema);

module.exports = async function (context, req) {
    context.log("Client function called");
    context.log(req);
    
    context.log("Request mongodbURI: " + process.env.MONGODB_URI);
    context.log("Request method: " + req.method);

    try {
        if ('GET' === req.method) {
            const clients = await Client.find();

            if (req.params.name) {
                clients = await Client.find({ name: req.params.name });
            }
            bodyResponse = clients;
        }
        else if ('POST' === req.method) {
            req.body.guid = helper.generateGUID();
            req.body.created = new Date();
            req.body.modified = new Date(); 
            const newClient = new Client(req.body);
            const savedClient = await newClient.save();
            bodyResponse = savedClient;
        }
        else if ('DELETE' === req.method) {  
            try {
                const deletedClient = await Client.findByIdAndDelete(req.params.id);
                console.log('Client deleted:', deletedClient);
                bodyResponse = deletedClient;
            } catch (error) {
                console.error('Error deleting client:', error);
            }
        }
    }
    catch (err) {
        context.log(err);
        bodyResponse = { "status": err.name };
    }

    context.log(bodyResponse);

    let headers = {
        "content-type": "application/json"
    };

    context.res = {
        headers: headers,
        body: bodyResponse
    };
}