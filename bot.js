import dotenv from 'dotenv'
import GatherPOAPBot from './lib/index.js'

dotenv.config()

const API_KEY = process.env.GATHER_API_KEY
const GATHER_SPACE = process.env.GATHER_SPACE;

(() => new GatherPOAPBot(API_KEY, GATHER_SPACE))()
