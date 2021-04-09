
`use strict`
const fse = require('fs-extra');
const path = require('path');
const { exec } = require("child_process");
//const shell = require('shell')
const {updateState, getAppState} = require("../common/config/proximaConfig.js")

async function benchmark() {
  msg.BENCHMARK_STARTING_MSG()
  if (canBenchmark()) {
    let config = ""
    benchmarkDockerApplication(config)
    msg.BENCHMARK_ENDING_MSG()
  } else {
    msg.BENCHMARK_ERROR_MSG()
  }
}

function benchmarkDockerApplication(config) {
  exec("docker run -p 50051:50051 chasesmith95/proxima-db-server:latest") //run dockerdatabase,
  //wait
  let  vertexBenchDir = "./DataVertex/pkg/vertex/"
  //process chdir
  let vertexBenchArg = "go test -bench=."
  exec(vertexBenchArg, function(code, stdout, stderr) {
    //console.log('Exit code:', code);
    //console.log('Program output:', stdout);
    console.log('Program stderr:', stderr);
  });

  //process chdir
}

function canBenchmark() {
  return (getAppState() == "Built")
}

module.exports = {name: "benchmark", fn: benchmark, description: "Benchmark the node"};
