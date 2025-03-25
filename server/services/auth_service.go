package services

import (
	"errors"
	"go-freelance-app/initializers"
	"go-freelance-app/models"
	"go-freelance-app/utils"
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
		return "", errors.New("user not found")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", errors.New("invalid password")
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

func EditUserInfoService(tokenString, username, bio, pfpPath string) (models.User, error) {
	claim, err := utils.ParseToken(tokenString)
	if err != nil {
		return models.User{}, errors.New("token not valid")
	}

	var user models.User
	initializers.DB.First(&user, "id = ?", claim["sub"])

	user.Username = username
	user.Bio = bio
	user.PfpPath = pfpPath

	if err := initializers.DB.Save(&user).Error; err != nil {
		return models.User{}, err
	}

	return user, nil
}

func VerifyAuthTokenService(tokenString string) (bool, error) {
	claim, err := utils.ParseToken(tokenString)

	if err != nil {
		return false, errors.New("token not valid")
	}

	if utils.IsTokenExpired(claim) {
		return false, errors.New("token expired")
	}

	return true, nil
}