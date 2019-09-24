const express = require('express')

// Create express instnace
const app = express()

// Require API routes
const users = require('./routes/project')

app.use(express.json()) // 解析body
// Import API Routes
app.use(users)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}