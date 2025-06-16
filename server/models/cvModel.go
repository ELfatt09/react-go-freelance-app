package models

import (
	"gorm.io/gorm"
)

type Cv struct {
	gorm.Model
	Title 		string
	Path 		string

	UserID 		uint
}