package main

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"go-freelance-app/controllers"
	"go-freelance-app/initializers"
)

func init() {
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
}
func main() {

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowHeaders:    []string{"Content-Type", "Authorization", "accept"},
		AllowMethods:    []string{"GET", "POST", "PUT", "DELETE"},
	}))

	auth := r.Group("/auth/")
	auth.POST("/register",  controllers.Register)
	auth.POST("/login", controllers.LogIn)
	auth.PUT("/edit", controllers.EditUserInfo)
	auth.GET("/verify", controllers.Verify)
	auth.GET("/data", controllers.GetAuthenticatedUserData)

	r.Run()
}
