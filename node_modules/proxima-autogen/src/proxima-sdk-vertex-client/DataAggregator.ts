

class DataAggregator {

  datasources: []Datasource; //map
  datasourceTemplates: []DatasourceTemplate //
  name: string
  id: any

  constructor(name, id, datasources, datasourceTemplates, vertexConfig) {
    this.name = name
    this.id = id
    this.datasources = LoadDatasources(datasources) //if
    this.datasourceTemplates = LoadDatasourceTemplates(datasourceTemplates) //if
    LoadDataVertex(vertexConfig)
  }

  start(): void {
    for (let datasource of this.datasources) {
      datasource.start()
    }

    for (let templateDatasource of this.datasourceTemplates) {
      templateDatasource.start()
    }
  }

  status() {
    //unknown
    return true
  }
}


class DatasourceLoader {
  LoadDatasources(datasourceConfigList) {
    //check list
    //attach Datasource template
  }

  LoadDatasourceTemplates(datasourceTemplateConfigList) {
    //check first
    //init template
    //for templateConfig in templates
      //datasource
  }

  LoadDataVertex(vertexConfig) {
      //load vertex (apollo), extra config
      //check first
  }

LoadDataAggregator(dataAggregatorConfig) {
  //return new
  //get name
  //get id
  //datasources
  //datasourceTemplates
  //vertexConfig
  //
}

LoadClient(clientConfig) {
  //load client, extra config
  //blockchain client, providers, (init)
//blockchain type
}




}




class DatasourceTemplate {
  constructor() { //constructor
    this.name = name
    this.id = id
    this.provider = id//dataloader.LoadClient (whether or not it is defined)
    this.dataSource =  abi//contract init //contract config, in this case a Class, could be abi, address, (provider?)
    this.mappings = mappings
    this.config = config
    this.abi = abi


    //this.datasources = map
    //init datasources
  }

  add(srcID| arraySRC) { //return, iterable
    //if type is srcID // (add to list)
    if () { //type is list
      let datasource = this.newDatasource(srcID)
      this.datasources[srcID] = datasource
      datasource.start()
    } else {
      for (let addr of srcID) {
        let datasource = this.newDatasource(addr)
        this.datasources[addr] = datasource
        datasource.start()
      }
    }
  }

newDatasource(addr): Datasource { //return Datasource
    return new Datasource(this.name, this.id, this.provider, address, this.abi, this.config, this.mappings)
}

start(startBlock: number = this.startBlock) {
  for (let datasource of this.datasources) {
    datasource.start(startBlock)
  }
}

stop() {
  for (let datasource of this.datasources) {
    datasource.stop()
  }
}
}

//is an implementedDatasource Template
class Datasource  {
  constructor(name, id, provider, abi, address, config, mappings) {
    this.name = name
    this.id = id
    //load Provider
    this.provider = //dataloader.LoadClient (whether or not it is defined)
    this.mappings = mappings
    this.address = address
    this.config = config
    this.abi = abi
  }

  start(startBlock: number = this.startBlock) { //optional arg start, restart bool
    //get startBlock

    //attach listeners with mappings to the datasource
    //generate listeners
    //provider block listener

    //event listeners
    //datasource.on()
      //name, function
  // this.dataSource =  abi//contract init //contract config, in this case a Class, could be abi, address, (provider?)
  }

  stop() {
    //detach listeners
  }

}
