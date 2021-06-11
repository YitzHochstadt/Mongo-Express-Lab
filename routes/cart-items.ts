import express from 'express';
import { getClient } from '../db';
import { ObjectId } from 'mongodb';
import CartItem from '../model/CartItem';

const route = express.Router();

route.get("/", async (req, res) => {
  try {
    const client = await getClient();
    const results = await client.db().collection<CartItem>('cartItems').find().toArray();
    res.json(results); // send JSON results
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

route.get("/search", async (req, res) => {
  const product = String(req.query.product || "");
  const maxPrice = Number(req.query.maxPrice as string);
  const pageSize = Number(req.query.pageSize as string);
  // possible query... { product: product, Price: { $lte: maxPrice } }
  const query: any = {};
  if (product) {
    query.product = product;
  }
  if (!isNaN(maxPrice)) {
    query.price = { $lte: maxPrice };
  }
  if (!isNaN(pageSize)) {
    query.length = { $gte: pageSize };
  }

  try {
    const client = await getClient();
    const results = await client.db().collection<CartItem>('cartItems').find(query).toArray();
    res.json(results); // send JSON results
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

route.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const cartItem = await client.db().collection<CartItem>('cartItems').findOne({ _id : new ObjectId(id) });
    if (cartItem) {
      res.json(cartItem);
    } else {
      res.status(404).json({message: "Not Found"});
    }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

route.post("/", async (req, res) => {
  const cartItem = req.body as CartItem;
  try {
    const client = await getClient();
    const result = await client.db().collection<CartItem>('cartItems').insertOne(cartItem);
    cartItem._id = result.insertedId;
    res.status(201).json(cartItem);
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

route.put("/:id", async (req, res) => {
  const id = req.params.id;
  const cartItem = req.body as CartItem;
  delete cartItem._id;
  try {
    const client = await getClient();
    const result = await client.db().collection<CartItem>('cartItems').replaceOne({ _id: new ObjectId(id) }, cartItem);
    if (result.modifiedCount === 0) {
      res.status(404).json({message: "Not Found"});
    } else {
      cartItem._id = new ObjectId(id);
      res.json(cartItem);
    }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

route.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const client = await getClient();
    const result = await client.db().collection<CartItem>('cartItems').deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      res.status(404).json({message: "Not Found"});
    } else {
      res.status(204).end();
    }
  } catch (err) {
    console.error("FAIL", err);
    res.status(500).json({message: "Internal Server Error"});
  }
});

export default route;