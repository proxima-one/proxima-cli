package resolver
//go:generate go run github.com/99designs/gqlgen
import (
	_ models "github.com/proxima-one/proxima-data-vertex/pkg/models"
	gql "github.com/proxima-one/proxima-data-vertex/pkg/gql"
	dataloader "github.com/proxima-one/proxima-data-vertex/pkg/dataloaders"
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
