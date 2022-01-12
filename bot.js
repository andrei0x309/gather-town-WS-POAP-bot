import dotenv from 'dotenv'
import GatherPOAPBot from './index.js'

dotenv.config()

const API_KEY = process.env.GATHER_API_KEY
const GATHER_SPACE = process.env.GATHER_SPACE_YUP;

(() => new GatherPOAPBot(API_KEY, GATHER_SPACE))()
