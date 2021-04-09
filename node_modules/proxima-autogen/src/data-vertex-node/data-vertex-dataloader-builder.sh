cd "DataVertex"

###go get

cd "pkg/dataloaders"

go run github.com/vektah/dataloaden DPoolListLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.DPoolList" && go run github.com/vektah/dataloaden DPoolLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.DPool" && go run github.com/vektah/dataloaden UserLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.User" && go run github.com/vektah/dataloaden UserTotalDepositLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.UserTotalDeposit" && go run github.com/vektah/dataloaden DepositLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.Deposit" && go run github.com/vektah/dataloaden FunderLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.Funder" && go run github.com/vektah/dataloaden FunderTotalInterestLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.FunderTotalInterest" && go run github.com/vektah/dataloaden FundingLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.Funding" && go run github.com/vektah/dataloaden MPHHolderLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.MPHHolder" && go run github.com/vektah/dataloaden MPHLoader string "*github.com/proxima-one/proxima-data-vertex/pkg/models.Mph"
