import Joi from "joi";
import {
  address_validator,
  countryStateCity_validator,
  date_validator,
  email_validator,
  gender_validator,
  name_validator,
  password_validator,
  phone_validator,
  username_validator,
  userRole_validator,
  userStatus_validator,
  createdDate_validator,
  existingAvatar_validator,
  existingGallery_validator,
} from "../validators.js";

// USER

// Create User
export const createUser_validation_schema = Joi.object({
  fullName: name_validator,
  email: email_validator,
  phone: phone_validator,
  gender: gender_validator,
  dob: date_validator,
  address: address_validator,
  country: countryStateCity_validator,
  state: countryStateCity_validator,
  city: countryStateCity_validator,
  username: username_validator,
  password: password_validator,
  status: userStatus_validator,
  role: userRole_validator,
  createdAt: createdDate_validator,
});

// Update User
export const updateUser_validation_schema = createUser_validation_schema
  .fork(
    [
      "fullName",
      "email",
      "phone",
      "gender",
      "dob",
      "address",
      "country",
      "state",
      "city",
      "username",
      "password",
      "status",
      "role",
    ],
    (schema) => schema.optional(),
  )
  .keys({
    id: Joi.string(),
    password: Joi.string(),
    existing_avatar: existingAvatar_validator,
    existing_gallery: existingGallery_validator,
  });

export const editProfile_validation_schema = createUser_validation_schema
  .fork(
    [
      "fullName",
      "email",
      "phone",
      "gender",
      "dob",
      "address",
      "country",
      "state",
      "city",
      "username",
    ],
    (schema) => schema.optional(),
  )
  .keys({
    id: Joi.string(),
    existing_avatar: existingAvatar_validator,
    existing_gallery: existingGallery_validator,
  });