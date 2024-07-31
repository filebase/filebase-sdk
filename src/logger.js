
let logger = {
  "debug": console.log,
  "info": console.log,
  "log": console.log,
  "verbose": console.log,
  "silly": console.log,
};
logger.child = () => {
  return logger
};

if (isNode()) {
  (async () => {
    const winston = await import("winston");
    const { combine, timestamp, json } = winston.format;
    logger = winston.createLogger({
      level:  process.env.LOG_LEVEL || "info",
      format: combine(timestamp(), json()),
      transports: [new winston.transports.Console()],
    })
  })()
}

// Function to check if the code is running in Node.js or the browser
function isNode() {
  return typeof process !== "undefined" && process.release.name === "node";
}

export default logger;
