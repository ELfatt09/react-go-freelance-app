package initializers

import "go-freelance-app/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
}
