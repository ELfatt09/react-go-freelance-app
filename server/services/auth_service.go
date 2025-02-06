package services

import (
	"errors"
	"react-go-chatapp/initializers"
	"react-go-chatapp/models"
	"react-go-chatapp/utils"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

func RegisterService(email, password, username string) (models.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, err
	}

	user := models.User{Email: email, Password: string(hash), Username: username}
	if err := initializers.DB.Create(&user).Error; err != nil {
		return models.User{}, err
	}

	return user, nil
}

func LogInService(email, password string) (string, error) {
	var user models.User
	initializers.DB.First(&user, "email = ?", email)
	if user.ID == 0 {
		return "", errors.New("User not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("Invalid password")
	}

	tokenString, err := utils.CreateToken(user)
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

func GetAuthenticatedUserDataService(authorizationHeader string) (models.User, error) {
	tokenString := strings.TrimPrefix(authorizationHeader, "Bearer ")
	claim, err := utils.ParseToken(tokenString)

	if err != nil {
		return models.User{}, errors.New("token not valid")
	}

	var user models.User
	initializers.DB.First(&user, "id = ?", claim["sub"])

	return user, nil
}

