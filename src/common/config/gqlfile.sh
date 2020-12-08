go get github.com/99designs/gqlgen
go get github.com/vektah/dataloaden

#(will already have the base resolvers)
#will already have dataloaders with imports
#generate new models from schema


#//go:generate go run github.com/99designs/gqlgen on resolver

#to recursively generate then do go generate ./..


#imports for resolvers (queries and mutations) with dataloader

#make dataloader for all queries and mutations (...)
#imports for dataloader

#add mutation and query resolvers to resolvers.go (auto-gen)
  #default query inputs
  #need to use the resolver dataloader to resolve queries

#dataloader need to create the handlers for the db/tables to -- search, get
#dataupdater -- update batched
#db search + resolve list
#db get + resolve

#resolver/model-gen/dataloader


#dapp aggregator gen




#db/table gen (docker container)

#unmarshall db output from json
#marshall db output from json


#db table/cache/compression/snapshot gen from models
