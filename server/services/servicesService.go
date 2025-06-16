package services

import (
	"errors"
	"zendix/initializers"
	"zendix/models"
	"zendix/utils"
)

func GetAllServicesService() ([]models.Service, error) {
	var services []models.Service
	err := initializers.DB.Find(&services).Error
	return services, err
}

func CreateServiceServices(tokenString, title, description string, minPrice, maxPrice int) (models.Service, error) {
	var service models.Service
	var user models.User
	claim, err := utils.ParseToken(tokenString)
	if err != nil {
		return service, errors.New("token not valid")
	}

	err = initializers.DB.Select("job_id").First(&user, "id = ?", claim["sub"]).Error
	if err != nil {
		return service, errors.New("user not found")
	}

	service.UserID = uint(claim["sub"].(float64))
	service.Title = title
	service.Description = description
	service.MinPrice = float64(minPrice)
	service.MaxPrice = float64(maxPrice)
	initializers.DB.Create(&service)

	return service, nil
}