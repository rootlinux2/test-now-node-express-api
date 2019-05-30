import express from "express";
import routes from "./src/routes/routes";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
const app = express();
const PORT = 3003;

const connection = "mongodb://localhost:27017/allincuba";
mongoose.Promise = global.Promise;
mongoose.connect(connection, { useNewUrlParser: true });

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(cors());
app.use(fileUpload({ safeFileNames: true, preserveExtension: true }));
routes(app);

app.listen(process.env.PORT || PORT, () => {
  console.log(`you are server is running on ${PORT}`);
});
