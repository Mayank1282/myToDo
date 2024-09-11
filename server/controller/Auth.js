const { MongoClient } = require("mongodb");
const mongodb_url = require("../mongodb_connect");
const { ObjectId } = require("mongodb");
const fs = require("fs");
const path = require("path");

class Auth {
  async UserLogin(req, res) {
    if (req.method === "POST") {
      return;
    } else {
      const client = new MongoClient(mongodb_url);

      try {
        await client.connect();

        const email = req.query.email;
        const password = req.query.password;

        const db = client.db("toDo");

        const collection = db.collection("users");

        const query = { email: email, password: password };

        const record = await collection.find(query).toArray();

        if (record.length > 0) {
          return res.json(record);
        } else {
          return res.json({ message: "Invalid Login Details" });
        }
      } catch (err) {
        return res.json(err);
      } finally {
        client.close();
      }
    }
  }

  async UserRegistration(req, res) {
    if (req.method === "GET") {
      const client = new MongoClient(mongodb_url);

      try {
        await client.connect();

        const email = req.query.email;

        const db = client.db("toDo");
        const collection = db.collection("users");

        const query = { email: email };

        const user = await collection.find(query).toArray();

        if (user.length > 0) {
          return res.json({ user: user });
        } else {
          return res.json({ user: [] });
        }
      } catch (err) {
        return res.json(err);
      } finally {
        client.close();
      }
    } else {
      const client = new MongoClient(mongodb_url);

      try {
        await client.connect();

        const name = req.body.name;
        const email = req.body.email;
        const phone_number = req.body.phone;
        const password = req.body.password;

        const db = client.db("toDo");
        const collection = db.collection("users");

        const record = {
          name: name,
          email: email,
          phone: phone_number,
          password: password,
        };

        const data = await collection.insertOne(record);

        const getData = await collection.findOne({ _id: data.insertedId });

        const obj = Object.keys(getData);

        return res.json(obj);
      } catch (err) {
        return res.json(err);
      } finally {
        client.close();
      }
    }
  }

  async ForgotPassword(req, res) {
    if (req.method === "GET") {
      return;
    } else {
      const client = new MongoClient(mongodb_url);

      try {
        await client.connect();

        const email = req.body.email;
        const new_pswd = req.body.new_pswd;

        const db = client.db("toDo");
        const collection = db.collection("users");

        const change = { $set: { password: new_pswd } };
        const query = { email: email };

        const data = await collection.updateOne(query, change);

        if (data.matchedCount > 0) {
          const getData = await collection.findOne(query);

          return res.json(getData);
        } else {
          return res.json("Invalid Email or Password");
        }
      } catch (err) {
        return res.json(err);
      } finally {
        client.close();
      }
    }
  }

  async UpdateProfile(req, res) {
    if (req.method === "GET") {
      return;
    }

    const client = new MongoClient(mongodb_url);

    try {
      await client.connect();

      const {
        _id: user_id,
        name,
        designation,
        gender,
        dob,
        profile_image,
      } = req.body;

      const matches = profile_image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/);
      if (!matches || matches.length !== 3) {
        return res.status(400).send({ message: "Invalid image data" });
      }

      const buffer = Buffer.from(matches[2], "base64");
      const imageName = `profile-${Date.now()}.png`; // Change extension based on file type
      const imagePath = path.join(
        __dirname,
        "../public/user_images",
        imageName
      );

      // Save the image to the file system
      try {
        fs.writeFileSync(imagePath, buffer);
      } catch (err) {
        console.error(err);
        return res.status(500).send({ message: "Failed to save image" });
      }

      const modified_on = new Date();

      const db = client.db("toDo");
      const collection = db.collection("users");

      const cond = { _id: new ObjectId(String(user_id)) };

      const query = {
        $set: {
          name: name,
          designation: designation,
          gender: gender,
          dob: dob,
          profile_image: imageName, // Save the image name/path in the database
          modified_on: modified_on,
        },
      };

      await collection.updateOne(cond, query);

      res.status(200).send({ message: "Profile updated successfully" });
    } catch (error) {
      console.error("Error updating profile:", error);
      return res.status(500).json({ error: "An error occurred" });
    } finally {
      client.close();
    }
  }
}

const obj = new Auth();

module.exports = obj;
