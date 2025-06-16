package controllers

import (
	"log"
	"net/http"

	"zendix/models"
	"zendix/services"
	"zendix/utils"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var body struct {
		Email    string
		Password string
		Fullname string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}

	if !utils.ValidateEmail(body.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
		return
	}

	user, err := services.RegisterService(body.Email, body.Password, body.Fullname)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Registered successfully", "user": user})
}

func LogIn(c *gin.Context) {
	var body struct {
		Email    string
		Password string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parameters"})
		return
	}

	tokenString, err := services.LogInService(body.Email, body.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Authentication Successful",
		"token":   tokenString,
	})
}

func GetAuthenticatedUserData(c *gin.Context) {
	tokenString, err := utils.GetTokenFromHeader(c.GetHeader("Authorization"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	user, err := services.GetAuthenticatedUserDataService(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}
func IsValid(c *gin.Context) {
	log.Println("token: " + c.GetHeader("Authorization"))
	tokenString, err := utils.GetTokenFromHeader(c.GetHeader("Authorization"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	if _, err := services.ValidateAuthTokenService(tokenString); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"auth": false})
		return
	}

	c.JSON(http.StatusOK, gin.H{"auth": true})
}

func EditUserInfo(c *gin.Context) {
	var body struct {
		models.UserPersonalInfo
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parameters"})
		return
	}

	tokenString, err := utils.GetTokenFromHeader(c.GetHeader("Authorization"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	user, err := services.EditUserInfoService(tokenString, body.Fullname, body.SubTitle, body.Address, body.Phone, body.Gender, body.Description)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"user": user,
	})
}

func EditUserPfp(c *gin.Context) {
	tokenString, err := utils.GetTokenFromHeader(c.GetHeader("Authorization"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	pfpImage, err := c.FormFile("PfpImage")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err = services.EditUserPfpService(tokenString, pfpImage)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Pfp changed successfully"})

}

func ChangePassword(c *gin.Context) {
	var body struct {
		OldPassword string
		NewPassword string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parameters"})
		return
	}

	tokenString, err := utils.GetTokenFromHeader(c.GetHeader("Authorization"))
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	err = services.ChangePasswordService(tokenString, body.OldPassword, body.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Password changed successfully"})
}
