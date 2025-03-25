package utils

import (
	"go-freelance-app/models"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func ParseToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		// Don't forget to validate the alg is what you expect:
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, nil
		}

		return []byte(os.Getenv("SECRET_KEY")), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}

	return nil, nil
}

func CreateToken(user models.User) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"iss":      "go-freelance-app",
		"aud":      "go-freelance-app",
		"iat":      time.Now().Unix(),
		"exp":      time.Now().AddDate(0, 0, 7).Unix(),
		"sub":      user.ID,
		"email":    user.Email,
		"username": user.Username,
	})

	return token.SignedString([]byte(os.Getenv("SECRET_KEY")))
}

func IsTokenExpired(claims jwt.MapClaims) bool {
	exp := claims["exp"].(float64)
	return time.Unix(int64(exp), 0).Before(time.Now())
}
