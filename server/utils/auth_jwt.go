package utils

import (
	"os"
	"react-go-chatapp/models"
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
		"iss":      "react-go-chatapp",
		"aud":      "react-go-chatapp",
		"iat":      time.Now().Unix(),
		"exp":      time.Now().Add(time.Hour * 72).Unix(),
		"sub":      user.ID,
		"email":    user.Email,
		"username": user.Username,
	})

	return token.SignedString([]byte(os.Getenv("SECRET_KEY")))
}