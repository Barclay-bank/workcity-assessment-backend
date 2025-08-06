const Client = require('../models/Client');

exports.createClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const clientExists = await Client.findOne({ email });
    if (clientExists) {
      return res.status(400).json({ message: 'Client already exists' });
    }

    const client = await Client.create({ name, email, phone });
    res.status(201).json({ message: 'Client created', client });
  } catch (error) {
    res.status(500).json({ message: 'Error creating client', error: error.message });
  }
};

exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find();
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clients', error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json(client);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving client', error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    const client = await Client.findByIdAndUpdate(
      req.params.id,
      { name, email, phone },
      { new: true }
    );

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ message: 'Client updated', client });
  } catch (error) {
    res.status(500).json({ message: 'Error updating client', error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);

    if (!client) return res.status(404).json({ message: 'Client not found' });

    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting client', error: error.message });
  }
};
