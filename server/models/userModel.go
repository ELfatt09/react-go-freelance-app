package models

import (
	"gorm.io/gorm"

	"time"
)

type User struct {
	gorm.Model
	Email    string `gorm:"unique"`
	Password string
	Username string
	Bio      string `gorm:"type:text"`
	PfpPath  string
	VerifiedAt *time.Time `gorm:"default:null"`
	
}