import mongoose from "mongoose";

function connect() {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connnected to Mongodb");
    })
    .catch((err) => {
      console.log(err);
    });
}

export default connect;
