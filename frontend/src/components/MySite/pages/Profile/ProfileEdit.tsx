import { useEffect, useRef, useState } from "react";
import { Formik, Form, FormikHelpers } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import FormInput from "../../../../common-components/FormInput";
import FormSelect from "../../../../common-components/FormSelect";
import Button from "../../../../common-components/Button";
import CountryStateCity from "../../../../common-components/CountryStateCity";
import { X } from "lucide-react";
import useImagePopUpModal from "../../../../hooks/useImagePopUpModal";
import ImagePopup from "../../../../common-components/ImagePopUp";
import api from "../../../../api/axios";
import { editProfile } from "../../../../api/usersApi";

type CreateUserPayload = {
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dob: string;
  address: string;
  country: string;
  state: string;
  city: string;
  username: string;
  avatar: File | null;
  gallery: File[];
};

export default function ProfileEdit() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/users/profile");
        if (res.data.success) {
          setUserData(res.data.data);
        }
      } catch (error) {
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const imagePopUpModal = useImagePopUpModal();

  const [avatar, setAvatar] = useState<File | string>("");
  const [files, setFiles] = useState<(File | string)[]>([]);

  const ALLOWED_TYPES = ["image/jpg", "image/png", "image/jpeg"];
  const MAX_SIZE = 2 * 1024 * 1024;

  const [avatarUploadInvalidText, setAvatarUploadInvalidText] = useState({
    show: false,
    text: "",
  });
  const [galleryUploadInvalidText, setGalleryUploadInvalidText] = useState({
    show: false,
    text: "",
  });

  useEffect(() => {
    const timerId = setTimeout(() => {
      setAvatarUploadInvalidText({ show: false, text: "" });
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [avatarUploadInvalidText]);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setGalleryUploadInvalidText({ show: false, text: "" });
    }, 2000);
    return () => {
      clearTimeout(timerId);
    };
  }, [galleryUploadInvalidText]);

  useEffect(() => {
    if (!userData) return;
    if (userData.avatar) setAvatar(userData.avatar);
    if (userData.gallery) {
      const cleaned = userData.gallery.filter(
        (f: string | null) => f && f !== "null" && f.trim() !== "",
      );

      setFiles(cleaned);
    }
  }, [userData]);

  const initialValues: CreateUserPayload = userData
    ? {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        gender: userData.gender,
        dob: userData.dob,
        address: userData.address,
        country: userData.country,
        state: userData.state,
        city: userData.city,
        username: userData.username,
        avatar: null,
        gallery: [],
      }
    : {
        fullName: "",
        email: "",
        phone: "",
        gender: "",
        dob: "",
        address: "",
        country: "",
        state: "",
        city: "",
        username: "",
        avatar: null,
        gallery: [],
      };

  const validationSchema = Yup.object({
    fullName: Yup.string()
      .min(2, "Full name must be at least 2 characters")
      .required("Full name required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits")
      .required("Phone Number is required"),
    gender: Yup.string().required("Gender is required"),
    dob: Yup.date()
      .typeError("Date of Birth must be a valid date")
      .required("Date of Birth is required"),
    address: Yup.string()
      .min(5, "Address must be at least 5 characters")
      .required("Address is required"),
    country: Yup.string().required("Country is required"),
    state: Yup.string().required("State is required"),
    city: Yup.string().required("City is required"),
    username: Yup.string()
      .min(3, "username must be at least 3 characters")
      .required("username is required"),
  });

  const handleSubmit = async (
    values: CreateUserPayload,
    helpers: FormikHelpers<CreateUserPayload>,
  ) => {
    const { setSubmitting, setStatus, resetForm } = helpers;
    try {
      const formData = new FormData();

      formData.append("fullName", values.fullName);
      formData.append("email", values.email);
      formData.append("phone", values.phone);
      formData.append("gender", values.gender);
      formData.append("dob", values.dob);
      formData.append("address", values.address);
      formData.append("country", values.country);
      formData.append("state", values.state);
      formData.append("city", values.city);
      formData.append("username", values.username);

      if (avatar instanceof File) {
        formData.append("avatar", avatar);
      }
      if (!(avatar instanceof File)) {
        formData.append("existing_avatar", avatar);
      }

      files
        .filter((f) => !(f instanceof File))
        .forEach((file) => formData.append("existing_gallery", file));

      files
        .filter((f) => f instanceof File)
        .forEach((file) => {
          formData.append("gallery", file);
        });

      await editProfile(formData);
      setStatus?.("User updated successfully");
      resetForm();

      navigate("/profile");
    } catch (error: any) {
      setStatus?.(error.response?.data?.message || "Operation failed");
    }

    setSubmitting(false);
  };

  if (loading) return <p className="text-center">Loading...</p>;
  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-extrabold text-slate-900">Edit Profile</h2>
      </div>

      <Formik<CreateUserPayload>
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="bg-white dark:bg-gray-700 rounded-lg p-6 w-[1000px] flex flex-col gap-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* First Name */}
              <FormInput
                label="Fullname"
                name="fullName"
                type="text"
                required
              />

              {/* Email */}
              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="example@gmail.com"
                required
              />

              <FormInput
                label="Phone Number"
                name="phone"
                type="number"
                placeholder="10 digits"
                required
              />

              <FormSelect
                label="Gender"
                name="gender"
                placeholder="Select Gender"
                required
                options={[
                  { label: "Male", value: "Male" },
                  { label: "Female", value: "Female" },
                ]}
              />

              <FormInput
                label="Date of Birth"
                name="dob"
                type="date"
                required
              />

              <FormInput label="Address" name="address" type="text" required />

              <div className="md:col-span-3">
                <CountryStateCity />
              </div>

              <FormInput
                label="Username"
                name="username"
                type="text"
                required
              />

              {/* Profile Photo */}
              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => avatarInputRef.current?.click()}
                  variant="secondary"
                  className="font-medium"
                >
                  Profile Photo
                </Button>
                <input
                  name="avatar"
                  type="file"
                  ref={avatarInputRef}
                  placeholder="avatar"
                  className="hidden w-0 h-0"
                  onChange={(event: any) => {
                    const file = event.target.files[0];
                    if (!file) return;

                    if (!ALLOWED_TYPES.includes(file.type)) {
                      setAvatarUploadInvalidText({
                        show: true,
                        text: `${file.name} is not PNG/JPG/JPEG`,
                      });
                      event.target.value = "";
                      return;
                    }

                    if (file.size > MAX_SIZE) {
                      setAvatarUploadInvalidText({
                        show: true,
                        text: `${file.name} exceeds 2 MB`,
                      });
                      event.target.value = "";
                      return;
                    }

                    setAvatar(file);
                    setFieldValue("avatar", file);
                  }}
                />

                {avatarUploadInvalidText.show && (
                  <div className="text-red-500 text-sm">
                    {avatarUploadInvalidText.text}
                  </div>
                )}

                {avatar && (
                  <div
                    className="text-gray-500 text-sm hover:underline cursor-pointer"
                    onClick={() => {
                      const path =
                        avatar instanceof File
                          ? URL.createObjectURL(avatar)
                          : `http://localhost:5000/uploads/${avatar}`;

                      imagePopUpModal.confirmImagePopUp(path);
                    }}
                  >
                    {avatar instanceof File
                      ? avatar.name
                      : avatar.split("-").slice(1).join("-")}
                  </div>
                )}
              </div>
              {/* Gallery */}
              <div className="flex flex-col gap-1">
                <Button
                  className="font-medium"
                  variant="secondary"
                  onClick={() => galleryInputRef.current?.click()}
                >
                  Upload Files
                </Button>

                <input
                  name="gallery"
                  type="file"
                  placeholder="gallery"
                  ref={galleryInputRef}
                  className="hidden w-0 h-0"
                  multiple
                  onChange={(event) => {
                    const selectedFiles = Array.from(event.target.files || []);

                    const validFiles = selectedFiles.filter((file) => {
                      if (!ALLOWED_TYPES.includes(file.type)) {
                        setGalleryUploadInvalidText({
                          show: true,
                          text: `${file.name} is not PNG/JPG/JPEG`,
                        });
                        return false;
                      }

                      if (file.size > MAX_SIZE) {
                        setGalleryUploadInvalidText({
                          show: true,
                          text: `${file.name} exceeds 2 MB`,
                        });
                        return false;
                      }

                      return true;
                    });

                    const combined = [...files, ...validFiles];

                    setFiles(combined);
                    setFieldValue("gallery", combined);
                  }}
                />

                {galleryUploadInvalidText.show && (
                  <div className="text-red-500 text-sm">
                    {galleryUploadInvalidText.text}
                  </div>
                )}

                {files.map((file, index) => {
                  if (!file) return null;

                  const name =
                    file instanceof File
                      ? file.name
                      : file.split("-").slice(1).join("-");

                  const path =
                    file instanceof File
                      ? URL.createObjectURL(file)
                      : `http://localhost:5000/uploads/${file}`;

                  return (
                    <div
                      key={index}
                      className="text-gray-500 text-sm flex items-center align-center gap-1 ml-5 px-5 py-0.5 hover:bg-gray-100 rounded-full"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const updated = files.filter((_, i) => i !== index);

                          setFiles(updated);
                          setFieldValue("gallery", updated);
                        }}
                        className="rounded-full text-sm font-bold text-red-600 h-4 w-4 flex justify-center items-center"
                      >
                        <X />
                      </button>
                      <div
                        className="text-gray-500 text-sm hover:underline hover:cursor-pointer"
                        onClick={() =>
                          file && imagePopUpModal.confirmImagePopUp(path)
                        }
                      >
                        {name}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit button */}
            <div className="mt-8 flex gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="py-2 text-sm font-medium"
              >
                Edit Profile
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/profile")}
                className="py-2 text-sm font-medium"
              >
                Cancel
              </Button>
            </div>
          </Form>
        )}
      </Formik>
      {imagePopUpModal.showImagePopUpModal && (
        <ImagePopup
          item={imagePopUpModal.selected}
          onCancel={imagePopUpModal.cancelImagePopUp}
        />
      )}
    </div>
  );
}
