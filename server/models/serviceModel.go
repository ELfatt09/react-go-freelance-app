package models

import (
	"gorm.io/gorm"
)

type Service struct {
	gorm.Model
	Title 		string
	Description string
	Subcategory string

	MinPrice 	float64
	MaxPrice 	float64

	UserID 		uint
	User 		User 	`gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE;constraint:OnUpdate:CASCADE"`

	CategoryID 	uint
	Category 	Category 	`gorm:"foreignKey:CategoryID;constraint:OnDelete:CASCADE;constraint:OnUpdate:CASCADE"`


}
