package initializers

import "react-go-chatapp/models"

func SyncDatabase() {
	DB.AutoMigrate(&models.User{})
}