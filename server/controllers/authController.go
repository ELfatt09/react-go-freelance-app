package controllers

import (
	"net/http"
	"strings"

	"go-freelance-app/services"
	"go-freelance-app/utils"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {
	var body struct {
		Email    string
		Password string
		Username string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to read body"})
		return
	}

	if !utils.ValidateEmail(body.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email"})
		return
	}

	user, err := services.RegisterService(body.Email, body.Password, body.Username)
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
	tokenString := c.GetHeader("Authorization")
	if tokenString == "bearer " {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token empty"})
		return
	}

	user, err := services.GetAuthenticatedUserDataService(tokenString)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"email":    user.Email,
		"username": user.Username,
		"pfpPath":  user.PfpPath,
		"bio":      user.Bio,
	})
}
func Verify(c *gin.Context) {
	tokenString := strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer ")
	if tokenString != "" {
		c.JSON(http.StatusOK, gin.H{"auth": true})
		return
	}
	c.JSON(http.StatusOK, gin.H{"auth": false})
}

func EditUserInfo(c *gin.Context) {
	var body struct {
		Username string
		Bio      string
		PfpPath  string
	}

	if err := c.Bind(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid parameters"})
		return
	}

	tokenString := strings.TrimPrefix(c.GetHeader("Authorization"), "Bearer ")
	if tokenString == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token empty"})
		return
	}

	user, err := services.EditUserInfoService(tokenString, body.Username, body.Bio, body.PfpPath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"username": user.Username,
		"pfpPath":  user.PfpPath,
		"bio":      user.Bio,
	})
}
