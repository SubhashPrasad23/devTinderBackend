const validateEditProfile = (req) => {
  const AllowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "skills",
    "yearOfExperience",
    "bio",
    "photoURL"
  ];
  const isEditAllowed = Object.keys(req.body).every((key) =>
    AllowedEditFields.includes(key)
  );
  return isEditAllowed;
};

module.exports = validateEditProfile;
