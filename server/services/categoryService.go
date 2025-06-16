package services

import (
	"zendix/initializers"
	"zendix/models"
)

func GetAllCategoriesService() ([]models.Category, error) {
	var Category []models.Category

	err := initializers.DB.Find(&Category).Error
	return Category, err
}
