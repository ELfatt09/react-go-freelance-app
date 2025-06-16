package initializers

import "zendix/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.UserPersonalInfo{})
	DB.AutoMigrate(&models.Service{})
	DB.AutoMigrate(&models.Cv{})
	DB.AutoMigrate(&models.Verification_token{})
	DB.AutoMigrate(&models.Category{})
}
