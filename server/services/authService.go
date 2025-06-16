package services

import (
	"errors"
	"io"
	"mime/multipart"
	"os"
	"time"

	"zendix/initializers"
	"zendix/models"
	"zendix/utils"

	"golang.org/x/crypto/bcrypt"
)

// RegisterService registers a new user in the database, given their email, password, and fullname.
// The password is hashed with bcrypt and the user is created with the given email and fullname.
// An error is returned if there is an issue generating the hash, or if there is an issue
// creating the user in the database. The function also sends a verification email to the user's
// email address.
func RegisterService(email, password, fullname string) (models.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return models.User{}, err
	}

	user := models.User{Email: email, Password: string(hash)}
	userPersonalInfo := models.UserPersonalInfo{Fullname: fullname}
	user.PersonalInfo = userPersonalInfo
	if err := initializers.DB.Preload("PersonalInfo").Create(&user).Error; err != nil {
		return models.User{}, err
	}

	SendVerificationEmail(email)

	return user, nil
}

// LogInService authenticates a user by verifying their email and password.
// It retrieves the user from the database using the provided email and
// compares the stored hashed password with the provided password using bcrypt.
// If authentication is successful, a JWT token is generated and returned.
// Returns an error if the user is not found, the password is invalid, or
// if there is an issue creating the token.
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

// GetAuthenticatedUserDataService retrieves the user associated with the given JWT token.
// The token is parsed and the user is retrieved from the database using the sub claim.
// If the token is invalid, an error is returned. Otherwise, the user is returned.
func GetAuthenticatedUserDataService(tokenString string) (models.User, error) {
	claim, err := utils.ParseToken(tokenString)

	if err != nil {
		return models.User{}, errors.New("token not valid")
	}

	var user models.User
	initializers.DB.Preload("PersonalInfo").First(&user, "id = ?", claim["sub"])

	return user, nil
}

func EditUserInfoService(tokenString, fullname, SubTitle, Address, Phone, Gender, description string) (models.User, error) {
	claim, err := utils.ParseToken(tokenString)
	if err != nil {
		return models.User{}, errors.New("token not valid")
	}

	var user models.User
	var userPersonalInfo models.UserPersonalInfo
	if err := initializers.DB.Preload("PersonalInfo").First(&user, "id = ?", claim["sub"]).Error; err != nil {
		return models.User{}, err
	}
	if err := initializers.DB.First(&userPersonalInfo, "user_id = ?", claim["sub"]).Error; err != nil {
		return models.User{}, err
	}

	userPersonalInfo.Fullname = fullname
	userPersonalInfo.SubTitle = SubTitle
	userPersonalInfo.Address = Address
	userPersonalInfo.Phone = Phone
	userPersonalInfo.Gender = Gender
	userPersonalInfo.Description = description

// Baru update data user



	if err := initializers.DB.Save(&user).Error; err != nil {
		return models.User{}, err
	}

	if err := initializers.DB.Save(&userPersonalInfo).Error; err != nil {
		return models.User{}, err
	}

	return user, nil
}

func EditUserPfpService(tokenString string, pfpImage *multipart.FileHeader) error {
	claim, err := utils.ParseToken(tokenString)
	if err != nil {
		return errors.New("token not valid")
	}

	var userPersonalInfo models.UserPersonalInfo
	if err := initializers.DB.First(&userPersonalInfo, "user_id = ?", claim["sub"]).Error; err != nil {
		return errors.New("user not found")
	}

	newFileName := time.Now().Format("2006-01-02-15-04-05") + pfpImage.Filename
	destination := "storage/pfp/" + newFileName

	file, err := pfpImage.Open()
	if err != nil {
		return errors.New("failed to open profile picture")
	}
	defer file.Close()

	data, err := io.ReadAll(file)
	if err != nil {
		return errors.New("failed to read profile picture")
	}

	if err := os.WriteFile(destination, data, 0644); err != nil {
		return errors.New("failed to save profile picture")
	}

	if userPersonalInfo.PfpPath != "" && userPersonalInfo.PfpPath != "/" + newFileName {
		if err := os.Remove("." + userPersonalInfo.PfpPath); err != nil {
			return errors.New("failed to delete old profile picture")
		}
	}

	userPersonalInfo.PfpPath = "/" + destination
	if err := initializers.DB.Save(&userPersonalInfo).Error; err != nil {
		return errors.New("failed to update user profile picture path")
	}

	return nil
}

// ValidateAuthTokenService validates the provided JWT token string.
// It parses the token to extract claims and checks if the token is expired.
// Returns true if the token is valid and not expired, along with a nil error.
// Returns false with an error if the token is invalid or expired.
func ValidateAuthTokenService(tokenString string) (bool, error) {
	claim, err := utils.ParseToken(tokenString)

	if err != nil {
		return false, errors.New("token not valid")
	}

	if utils.IsTokenExpired(claim) {
		return false, errors.New("token expired")
	}
	var user models.User
	initializers.DB.First(&user, "id = ?", claim["sub"])

	return true, nil
}

func ChangePasswordService(tokenString, oldPassword, newPassword string) error {
	claim, err := utils.ParseToken(tokenString)
	if err != nil {
		return errors.New("token not valid")
	}

	var user models.User
	initializers.DB.First(&user, "id = ?", claim["sub"])

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(oldPassword)); err != nil {
		return errors.New("invalid password")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	user.Password = string(hash)
	return initializers.DB.Save(&user).Error
}
