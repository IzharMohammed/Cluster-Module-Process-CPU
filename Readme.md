# Node.js Clustering Example

This repository demonstrates **Node.js clustering**, which allows you to take advantage of multiple CPU cores by creating child processes (workers) to handle incoming requests. Each worker runs independently and listens on the same port. The clustering module in Node.js is used to spawn multiple instances of your application, effectively utilizing all available CPU cores.

## Key Concepts

### Cluster Module
The `cluster` module allows the application to fork multiple processes, known as workers, from the primary process (sometimes called the master process). These workers share the same server port and distribute incoming requests across the workers.

### CPU Cores
This application uses all the available CPU cores by creating as many worker processes as there are CPU cores.

### Forking Processes
Each worker is a new **process**, not a thread. Node.js is single-threaded, but by forking multiple worker processes, the application can use all CPU cores simultaneously.

## What Does This Code Do?

### Primary (Master) Process
- If the current process is the primary (master) process, it logs the number of available CPU cores and its process ID.
- It forks worker processes, one for each available CPU core, using `cluster.fork()`.
- If a worker dies (exits), it immediately forks a new worker to replace the dead one, ensuring that all CPU cores remain utilized.

### Worker Processes
- Each worker is a separate process running an instance of the Express app.
- All worker processes listen on the same port (3000), and requests are distributed between them.
- There are two routes:
  - `/`: A simple route that returns "Hello World".
  - `/api/:n`: A route that performs a summation operation up to `n`, with a maximum limit of 5 billion. It returns the result along with the worker process ID that handled the request.

## Does This Code Create Multiple Threads or Use All CPUs?

- **No threads**: This code does not create multiple threads. Node.js is single-threaded by default.
- **Uses all CPUs with multiple processes**: Instead, it forks multiple processes (one per CPU core). Each process (worker) can run on a separate CPU core. This allows the application to handle more requests concurrently by utilizing all available cores.

## Summary
- **Clustering** is used to create multiple worker processes (one for each CPU core).
- Each worker runs an independent instance of the Express app and listens on the same port.
- This method improves the scalability of the Node.js application by distributing the load across multiple processes, but **it does not create threads**—it creates processes.

## How to Run This Code

1. Install dependencies:
   ```bash
   npm install
