package auth

import (
	"context"
	"net/http"

	proxima "github.com/proxima-one/proxima-db-client-go/pkg/database"
)

// A private key for context that only this package can access. This is important
// to prevent collisions between different context uses
var userCtxKey = &contextKey{"user"}

type contextKey struct {
	name string
}

// A stand-in for our database backed user object
type User struct {
	ID      string
	Name    string
	IsAdmin bool
}

// Middleware decodes the share session cookie and packs the session into context
func Middleware(db *proxima.ProximaDatabase) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			c, err := r.Cookie("auth-cookie")

			// Allow unauthenticated users in
			if err != nil || c == nil {
				next.ServeHTTP(w, r)
				return
			}

			userId, err := validateAndGetUserID(c)
			if err != nil {
				http.Error(w, "Invalid cookie", http.StatusForbidden)
				return
			}

			// get the user from the database
			user := getUserByID(db, userId)

			// put it in context
			ctx := context.WithValue(r.Context(), userCtxKey, user)

			// and call the next with our new context
			r = r.WithContext(ctx)
			next.ServeHTTP(w, r)
		})
	}
}

func validateAndGetUserID(c *http.Cookie) (string, error) {
	return "USERID", nil
}

func getUserByID(db *proxima.ProximaDatabase, userID string) User {
	var userVal User
	return userVal
}

// ForContext finds the user from the context. REQUIRES Middleware to have run.
func ForContext(ctx context.Context) *User {
	raw, _ := ctx.Value(userCtxKey).(*User)
	return raw
}
