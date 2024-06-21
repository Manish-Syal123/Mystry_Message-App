import mongoose from "mongoose";

type ConnectionObject = {
  isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  // check if the database connection already exist on the edge location or different continent // in nextjs backend server never keeps running like others, It starts the backend server when user make any request.
  if (connection.isConnected) {
    console.log("Already Connected to Database");
    return;
  }

  // if database connection not exist on that server of different continent, then form a connection with databse for our application
  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "", {});

    connection.isConnected = db.connections[0].readyState; // if the connection already exist then it will return a number

    console.log("DB connected Succefully");
  } catch (error) {
    console.log("Database Connection Failed ", error);

    process.exit(1); // gracefully exit th process if db connection fails, to save resourses
  }
}

export default dbConnect;
