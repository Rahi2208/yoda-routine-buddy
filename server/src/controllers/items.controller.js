import * as itemsService from "../services/items.service.js";

export async function list(req, res) {
  res.json({ items: await itemsService.listItems(req.user.id) });
}

export async function create(req, res) {
  const item = await itemsService.createItem(req.user.id, req.validated.body);
  res.status(201).json({ item });
}

export async function update(req, res) {
  const item = await itemsService.updateItem(req.user.id, req.validated.params.id, req.validated.body);
  res.json({ item });
}

export async function remove(req, res) {
  await itemsService.deleteItem(req.user.id, req.validated.params.id);
  res.status(204).end();
}
