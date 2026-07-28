"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const env_1 = require("./env");
exports.redisClient = new ioredis_1.default(env_1.env.REDIS_URL, {
    maxRetriesPerRequest: null,
    lazyConnect: true,
});
exports.redisClient.on('error', (err) => {
    console.warn('⚠️ Redis Connection Warning:', err.message);
});
exports.redisClient.on('connect', () => {
    console.log('✅ Redis connected successfully');
});
