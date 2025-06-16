package controllers

import (
	"net/http"
	"zendix/services"

	"github.com/gin-gonic/gin"
)

func GetAllCategories(c *gin.Context) {
	jobs, err := services.GetAllCategoriesService()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"jobs": jobs})
}
