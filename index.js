let express = require("express");
let app = express();
let mongoose = require("mongoose");
let cors = require("cors");

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/api/auth", require("./api/auth"));
app.use("/api/blog", require("./api/blog"));

app.use("/", express.static(__dirname + "/frontend/build"));

async function main() {
  try {
    await mongoose
      .connect(
        `mongodb://admin:${process.env.PASSWORD}@cluster0-shard-00-00.sggqo.mongodb.net:27017,cluster0-shard-00-01.sggqo.mongodb.net:27017,cluster0-shard-00-02.sggqo.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-igqdhf-shard-0&authSource=admin&retryWrites=true&w=majority`
      )
      .catch(() => {
        throw Error("Mongoose failed to connect [in main function]");
      });

    app.listen(process.env.PORT || 5000, () =>
      console.log(`Listening on port ${process.env.PORT || 5000}`)
    );
  } catch (error) {
    console.error(error);
  }
}

main();
