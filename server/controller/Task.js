const { MongoClient } = require("mongodb");
const mongodb_url = require("../mongodb_connect");
const { ObjectId } = require("mongodb");

class Task {
  async CreateTask(req, res) {
    const client = new MongoClient(mongodb_url);

    try {
      await client.connect();

      let title = req.body.title;
      let description = req.body.description;
      let task_date = req.body.task_date;
      let user_id = req.body.user_id;
      let created_at = new Date();

      const db = client.db("toDo");
      const collection = db.collection("tasks");

      let record = {
        title: title,
        description: description,
        task_date: task_date,
        created_at: created_at,
        user_id: user_id,
      };

      const data = await collection.insertOne(record);

      const get_data = await collection.findOne({ _id: data.insertedId });

      const obj = Object.keys(get_data);

      return res.json(obj);
    } catch (error) {
      return res.json(error);
    } finally {
      client.close();
    }
  }

  async NewTask(req, res) {
    const client = new MongoClient(mongodb_url);

    try {
      await client.connect();

      const user_id = req.query.id;

      const db = client.db("toDo");
      const collection = db.collection("tasks");

      const query = { user_id: user_id };

      const get_data = await collection
        .find(query)
        .sort({ _id: -1 })
        .limit(1)
        .toArray();

      return res.json(get_data);
    } catch (error) {
      return res.json(error);
    } finally {
      client.close();
    }
  }

  async RecentTask(req, res) {
    const client = new MongoClient(mongodb_url);

    try {
      await client.connect();

      const user_id = req.query.id;

      const db = client.db("toDo");
      const collection = db.collection("tasks");

      const query = { user_id: user_id };

      const get_data = await collection
        .find(query)
        .sort({ _id: -1 })
        .limit(4)
        .toArray();

      return res.json(get_data);
    } catch (error) {
      return res.json(error);
    } finally {
      client.close();
    }
  }

  async AllTask(req, res) {
    const client = new MongoClient(mongodb_url);

    try {
      await client.connect();

      const user_id = req.query.id; // Assuming user_id is a string

      const db = client.db("toDo");
      const collection = db.collection("tasks");

      const get_data = await collection
        .aggregate([
          {
            $match: { user_id: user_id }, // Match user_id as a string in tasks
          },
          {
            $lookup: {
              from: "users",
              let: { userId: { $toObjectId: "$user_id" } }, // Convert user_id to ObjectId for comparison
              pipeline: [
                {
                  $match: {
                    $expr: { $eq: ["$_id", "$$userId"] }, // Match _id in users to converted user_id
                  },
                },
              ],
              as: "userDetails",
            },
          },
          {
            $unwind: "$userDetails", // Deconstructs the array to return one object
          },
        ])
        .toArray();

      // console.log(get_data);

      return res.json(get_data);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    } finally {
      await client.close();
    }
  }

  async TaskAction(req, res) {
    const client = new MongoClient(mongodb_url);

    try {
      await client.connect();

      const action = req.query.action;
      const task_id = req.query.task_id;

      const db = client.db("toDo");
      const collection = db.collection("tasks");

      if (action == "edit" || action == "view") {
        const query = { _id: new ObjectId(String(task_id)) };
        const data = await collection.findOne(query);

        return res.json(data);
      }

      if (action == "delete") {
        const query = { _id: new ObjectId(String(task_id)) };
        await collection.deleteOne(query);
      }
    } catch (error) {
      return res.json(error);
    } finally {
      client.close();
    }
  }

  async UpdateTask(req, res) {
    const client = new MongoClient(mongodb_url);

    try {
      await client.connect();

      const task_id = req.body.task_id;

      let title = req.body.formData.title;
      let description = req.body.formData.description;
      let task_date = req.body.formData.task_date;
      let modified_on = new Date();

      const db = client.db("toDo");
      const collection = db.collection("tasks");

      const cond = { _id: new ObjectId(String(task_id)) };
      const query = {
        $set: {
          title: title,
          description: description,
          task_date: task_date,
          modified_on: modified_on,
        },
      };

      await collection.updateOne(cond, query);
    } catch (error) {
      return res.json(error);
    } finally {
      client.close();
    }
  }
}

const obj = new Task();

module.exports = obj;
