package middlewares

import (
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"go-freelance-app/utils"
)

func RequireAuth(c *gin.Context) {
	tokenString := strings.TrimPrefix(c.Request.Header.Get("Authorization"), "Bearer ")

	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
	
		// hmacSampleSecret is a []byte containing your secret, e.g. []byte("my_secret_key")
		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}
	
	if _, ok := token.Claims.(jwt.MapClaims); !ok || !token.Valid {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": "Invalid token claims",
		})
		return
	}

	claims := token.Claims.(jwt.MapClaims)

	if utils.IsTokenExpired(claims) {
		c.JSON(http.StatusUnauthorized, gin.H{
			"error": "Token expired",
		})
		return
	}

	c.Next()
}
