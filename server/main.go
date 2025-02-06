package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gin-contrib/cors"

	"react-go-chatapp/initializers"
	"react-go-chatapp/controllers"
)

func init(){
	initializers.LoadEnvVariables()
	initializers.ConnectToDB()
	initializers.SyncDatabase()
}
func main() {

	r := gin.Default()
	r.Use(cors.New(cors.Config{
		AllowAllOrigins: true,
		AllowHeaders:    []string{"Content-Type", "Authorization", "accept"},
	}))

	auth := r.Group("/auth/")
	auth.POST("/register", controllers.Register)
	auth.POST("/login", controllers.LogIn)
	auth.GET("/verify", controllers.Verify)
	auth.GET("/data", controllers.GetAuthenticatedUserData)

	r.Run()
}

