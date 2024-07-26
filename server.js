const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

/*upload download*/
const multer = require('multer');
const path = require('path');
//const product = require('./models/product');

//common below line
const app = express();

function generateGUID() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return `${s4()}-${s4()}-${s4()}`;
}

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('File uploaded successfully');
});

app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'filename.ext');
  res.download(filePath);
});

const PORT = process.env.PORT || 5000;
/*app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});**/

// Middleware
app.use(bodyParser.json());
app.use(cors());

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

app.get('/api/client', async (req, res) => {
  const clients = await Client.find();
  res.json(clients);
});

app.get('/api/client/name/:name', async (req, res) => {
  const clients = await Client.find({ name: req.params.name });
  res.json(clients);
});

app.post('/api/client', async (req, res) => {
  req.body.guid = generateGUID();
  req.body.created = new Date();
  req.body.modified = new Date();
  const newClient = new Client(req.body);
  const savedClient = await newClient.save();
  res.json(savedClient);
});

app.delete('/api/client/id/:id', async (req, res) => {
  try {
    const deletedClient = await Client.findByIdAndDelete(req.params.id);
    console.log('Client deleted:', deletedClient);
    res.json(deletedClient);
  } catch (error) {
    console.error('Error deleting client:', error);
  }
})

// Product API endpoints
const productSchema = new mongoose.Schema({
  name: String,
  guid: String,
  info: String,
  created: Date,
  modified: Date
});

const Product = mongoose.model('Product', productSchema);

app.get('/api/product', async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.get('/api/product/name/:name', async (req, res) => {
  const products = await Product.find({ name: req.params.name });
  res.json(products);
});

app.post('/api/product', async (req, res) => {
  req.body.guid = generateGUID();
  req.body.created = new Date();
  req.body.modified = new Date();
  const newProduct = new Product(req.body);
  const savedProduct = await newProduct.save();
  res.json(savedProduct);
});

app.delete('/api/product/id/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    console.log('Product deleted:', deletedProduct);
    res.json(deletedProduct);
  } catch (error) {
    console.error('Error deleting product:', error);
  }
})

// Product API endpoints
const envSchema = new mongoose.Schema({
  name: String,
  guid: String,
  info: String,
  created: Date,
  modified: Date
});

const Env = mongoose.model('Env', envSchema);

app.get('/api/env', async (req, res) => {
  const envs = await Env.find();
  res.json(envs);
});

app.get('/api/env/name/:name', async (req, res) => {
  const envs = await Env.find({ name: req.params.name });
  res.json(envs);
});

app.post('/api/env', async (req, res) => {
  req.body.guid = generateGUID();
  req.body.created = new Date();
  req.body.modified = new Date();
  const newEnv = new Env(req.body);
  const savedEnv = await newEnv.save();
  res.json(savedEnv);
});

app.delete('/api/env/id/:id', async (req, res) => {
  try {
    const deletedEnv = await Env.findByIdAndDelete(req.params.id);
    console.log('Env deleted:', deletedEnv);
    res.json(deletedEnv);
  } catch (error) {
    console.error('Error deleting env:', error);
  }
})


// Integrations API endpoints
const integrationSchema = new mongoose.Schema({
  name: String,
  type: String,
  guid: String,
  clientguid: String,
  productguid: String,
  envguid: String,
  url: String,
  enabled: Boolean,
  info: String,
  created: Date,
  modified: Date
});

const Integration = mongoose.model('Integration', integrationSchema);

app.get('/api/integration', async (req, res) => {
  const integrations = await Integration.find();
  res.json(integrations);
});

app.get('/api/integration/name/:name', async (req, res) => {
  const integrations = await Integration.find({ name: req.params.name });
  res.json(integrations);
});

app.get('/api/integration/client/:guid/product/:productguid/env/:envguid', async (req, res) => {
  const integrations = await Integration.find({ clientguid: req.params.guid, productguid: req.params.productguid, envguid: req.params.envguid });
  res.json(integrations);
});

app.post('/api/integration', async (req, res) => {
  req.body.type = req.body.type.value;
  req.body.productguid = req.body.productguid.value;
  req.body.envguid = req.body.envguid.value;
  req.body.clientguid = req.body.clientguid.value;
  req.body.guid = generateGUID();
  req.body.created = new Date();
  req.body.modified = new Date();
  const newIntegration = new Integration(req.body);
  const savedIntegration = await newIntegration.save();
  res.json(savedIntegration);
});

app.delete('/api/integration/id/:id', async (req, res) => {
  try {
    const deletedIntegration = await Integration.findByIdAndDelete(req.params.id);
    console.log('Integration deleted:', deletedIntegration);
    res.json(deletedIntegration);
  } catch (error) {
    console.error('Error deleting integration:', error);
  }
})

app.listen(PORT, () => {
  console.log(`Server2 running on port ${PORT}`);
});
