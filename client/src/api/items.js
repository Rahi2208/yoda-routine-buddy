import { request } from "./client.js";

export const listItems = () => request("GET", "/api/items").then((data) => data.items);
export const createItem = (data) => request("POST", "/api/items", data).then((res) => res.item);
export const updateItem = (id, data) => request("PATCH", `/api/items/${id}`, data).then((res) => res.item);
export const deleteItem = (id) => request("DELETE", `/api/items/${id}`);
