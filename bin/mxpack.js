#! /usr/bin/env node
const path = require('path');
const fs = require('fs');
const Compier = require('../lib/Compiler.js');
const root = process.cwd(); // 获取当前目录
let configPath = path.join(root, 'webpack.config.js');
let config = require(configPath);
let compiler = new Compier(config);
// 发射entryOption事件
compiler.hooks.entryOption.call(config);
compiler.run();
