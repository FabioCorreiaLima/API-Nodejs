const itemRepository = require('../repositories/itemRepository');

exports.createItem = async (req, res) => {
  try {
    const item = await itemRepository.createItem(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar item' });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await itemRepository.getAllItems();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const updatedItem = await itemRepository.updateItem(req.params.id, req.body);
    res.status(200).json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar item' });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    await itemRepository.deleteItem(req.params.id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Erro ao deletar item' });
  }
};
