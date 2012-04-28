#!/usr/bin/env coffee

Router = require './router'
http   = require 'http'

#!/usr/bin/env coffee

router = Router({static_route: process.cwd(), served_by: "Guaycuru Static Server"})
router.log "Working directory: #{router.static_route}"

server = http.createServer router
argv = process.argv.slice 2
server.listen if argv[0]? and not isNaN(parseInt(argv[0])) then parseInt(argv[0]) else 8000

addr = server?.address() or {address: '0.0.0.0', port: argv[0] or 8000}

router.log "Serving web content at #{addr.address}:#{addr.port}"