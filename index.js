import express from "express";
import cluster from "cluster";
import os from "os";

// Get the number of CPU cores available on the machine
const totalCPUs = os.cpus().length;

const port = 3000;

// If the current process is the primary (master) process
if (cluster.isPrimary) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Primary ${process.pid} is running`);

  // Fork a new worker process for each CPU core
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork(); // Creates a new worker process
  }

  // When a worker process exits (dies), log the event and fork a new worker
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork(); // Replace the dead worker with a new one
  });

} else {
  // This code runs inside each worker process

  const app = express();
  console.log(`Worker ${process.pid} started`);

  // Define a simple route that returns "Hello World"
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // Define a route that performs a large computation based on the URL parameter
  app.get("/api/:n", function (req, res) {
    let n = parseInt(req.params.n); // Get the value from the URL parameter
    let count = 0;

    // Limit the value of n to avoid extremely large numbers
    if (n > 5000000000) n = 5000000000;

    // Perform a simple summation loop up to n
    for (let i = 0; i <= n; i++) {
      count += i; // Increment the count
    }

    // Return the final count and the worker's process ID
    res.send(`Final count is ${count} ${process.pid}`);
  });

  // Start the express server and listen on the specified port
  app.listen(port, () => {
    console.log(`App listening on port ${port}`);
  });
}
