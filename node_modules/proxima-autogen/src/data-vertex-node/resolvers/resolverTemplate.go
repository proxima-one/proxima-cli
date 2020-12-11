package resolvers
//go:generate go run github.com/99designs/gqlgen
import (
	"context"
	models  //models pkg "github.com/proxima-one/binance-chain-subgraph/pkg/models"
	gql //gql pkg "github.com/proxima-one/binance-chain-subgraph/pkg/gql"
	dataloader //dataloader pkg "github.com/proxima-one/binance-chain-subgraph/pkg/dataloader"
)

type Resolver struct{
	loader *dataloader.Dataloader
}

func (r *Resolver) Query() gql.QueryResolver {
	return &queryResolver{r}
}

func (r *Resolver) Mutation() gql.MutationResolver {
  return &mutationResolver{r}
}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }

/*
resolver - database and loader
*/
func NewResolver(loader *dataloader.Dataloader) (gql.Config) {
	r := Resolver{}
	r.loader = loader
	return gql.Config{
		Resolvers: &r,
	}
}
