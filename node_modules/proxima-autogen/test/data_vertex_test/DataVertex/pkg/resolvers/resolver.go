package resolvers

//go:generate go run github.com/99designs/gqlgen
import (
	_ "fmt"

	_ "github.com/json-iterator/go"
	//dataloader "github.com/proxima-one/proxima-data-vertex/pkg/dataloaders"
	gql "github.com/proxima-one/proxima-data-vertex/pkg/gql"
	_ "github.com/proxima-one/proxima-data-vertex/pkg/models"
	proxima "github.com/proxima-one/proxima-db-client-go/pkg/database"
)

var DefaultInputs map[string]interface{} = map[string]interface{}{"id": "00000000000", "prove": false, "limit": 100}

// THIS CODE IS A STARTING POINT ONLY. IT WILL NOT BE UPDATED WITH SCHEMA CHANGES.
type Resolver struct {
	db *proxima.ProximaDatabase
}

func (r *Resolver) Query() gql.QueryResolver {
	return &queryResolver{r}
}

func (r *Resolver) Mutation() gql.MutationResolver {
	return &mutationResolver{r}
}

type queryResolver struct{ *Resolver }
type mutationResolver struct{ *Resolver }


type dPoolResolver struct{ *Resolver }
type dPoolListResolver struct{ *Resolver }
type depositResolver struct{ *Resolver }
type funderResolver struct{ *Resolver }
type funderTotalInterestResolver struct{ *Resolver }
type fundingResolver struct{ *Resolver }
//type mutationResolver struct{ *Resolver }
//type queryResolver struct{ *Resolver }
type userResolver struct{ *Resolver }
type userTotalDepositResolver struct{ *Resolver }

func (r *Resolver) DPool() gql.DPoolResolver {return &dPoolResolver{r}}
func (r *Resolver) DPoolList() gql.DPoolListResolver {return &dPoolListResolver{r}}
func (r *Resolver) Deposit() gql.DepositResolver {return &depositResolver{r}}
func (r *Resolver) Funder() gql.FunderResolver {return &funderResolver{r}}
func (r *Resolver) FunderTotalInterest() gql.FunderTotalInterestResolver {return &funderTotalInterestResolver{r}}
func (r *Resolver) Funding() gql.FundingResolver {return &fundingResolver{r}}
func (r *Resolver) User() gql.UserResolver {return &userResolver{r}}
func (r *Resolver) UserTotalDeposit() gql.UserTotalDepositResolver {return &userTotalDepositResolver{r}}


func NewResolver(db *proxima.ProximaDatabase) gql.ResolverRoot {
	return &Resolver{db: db}
}
