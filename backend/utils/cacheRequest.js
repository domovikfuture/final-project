import NodeCache from "node-cache";

const cache = new NodeCache();

const cacheRequest = (duration = 60) => (req, res, next) => {
  if (req.method !== "GET") {
    console.log("Кэш не возможен для методов, отличных от GET!");
    return next();
  }
  const key = req.originalUrl;
  const cachedResponse = cache.get(key);

  if (cachedResponse) {
    console.error(`Кэш уже установлен ${key}`);
    res.send(cachedResponse);
  } else {
    console.log(`Кэша нет ${key}`);
    res.originalSend = res.send;
    res.send = (body) => {
      res.originalSend(body);
      cache.set(key, body, duration);
    };
    next();
  }
};

export default cacheRequest;
