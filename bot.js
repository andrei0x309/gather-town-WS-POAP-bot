import GatherPOAPBot from './index.js';
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.GATHER_API_KEY;
const GATHER_SPACE = process.env.GATHER_SPACE_TEST

new GatherPOAPBot(API_KEY, GATHER_SPACE)