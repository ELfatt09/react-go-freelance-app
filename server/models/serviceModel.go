package models

import (
	"gorm.io/gorm"
)

type Service struct {
	gorm.Model
	User User `gorm:"foreignKey:UserID"`
	Job Job `gorm:"foreignKey:JobID"`
	JobID uint
	Title string
	Description string
	Level string
	UserID uint
}
