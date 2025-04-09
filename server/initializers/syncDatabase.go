package initializers

import "go-freelance-app/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.Service{})
	DB.AutoMigrate(&models.Job{})
	
}
