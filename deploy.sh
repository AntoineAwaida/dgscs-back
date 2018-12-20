#!/bin/bash

git pull
pm2 restart ./server/server.js